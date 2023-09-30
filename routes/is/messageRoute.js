'use strict';

const express = require('express')
const router = express.Router({caseSensitive: true})
const conn = require("../../connections/con_message_board.js");
const { boardSchema, threadSchema, replySchema } = require("../../schemas/is/messageboard.js");
const Board = conn.model("Boards", boardSchema);
const Thread = conn.model("Threads", threadSchema);
const Reply = conn.model("Replies", replySchema);
const hash = require("../../public/js/is/message_board_hash.js");

// http://expressjs.com/en/starter/basic-routing.html
router.get("/", function (req, res) {
    res.render("message_board/index", { layout: 'layouts/message_board.ejs', title: "Message Board: home"}); 
});

/* ~~~~~~ BOARDS ~~~~~~ */

router.get('/b/:board', async (req, res) => {
    try {
      let board = await Board.findOne({ text: req.params.board });
      if(!board) {
        board = await createBoard(req.params.board);
      }
      res.render('message_board/board', { layout: 'layouts/message_board.ejs', title: "Message Board: " + board.text});
    }
    catch(e) {
      console.log(e);
      res.send({error: e});
    }
});

router.get('/b/:board/:thread_id', async (req, res) => {
    try {
        let thread = await Thread.findById(req.params.thread_id);
        res.render('message_board/thread', { layout: 'layouts/message_board.ejs', title: "Message Board Thread: " + thread.board.text, thread: thread});
    }
    catch(e) {
        console.log(e);
        res.send({error: e});
    }
});

function createBoard(board) {
    return new Board({
        text: board
    }).save();
}

/* ~~~~~~ REPLIES ~~~~~~ */

router.get('/api/replies/:board', async (req, res) => {
    const thread_id = req.query.thread_id;
    try {
      let thread = await returnThread(thread_id);1
      res.send(thread);
    } 
    catch (e) {
      console.log(e)
      res.send({error: e}) 
    }
});
  
//post a new reply
router.post('/api/replies/:board', async (req, res) => {
const time = Date.now();
try {
    let { text, delete_password, thread_id } = req.body;
    let reply = await createReply(time, thread_id, text, delete_password);
    let thread = await updateThread(time, thread_id, reply._id);
    res.redirect(`/projects/is/message-board/b/${req.params.board}/${thread_id}`)
}
catch(e) {
    console.log(e);
    res.send({error: e});
}
});

//report a reply
router.put('/api/replies/:board', async (req, res) => {
try {
    let reply = await Reply.findByIdAndUpdate(req.body.reply_id, { reported: true }); 
    res.send("reported")
} catch (e) {
    console.log(e)
    res.send({error: e}) 
}
});

//delete a reply
router.delete('/api/replies/:board', async (req, res) => {
try {
    let reply = await Reply.findById(req.body.reply_id);
    if(hash.comparePassword(req.body.delete_password, reply.password)) {
    await Reply.findByIdAndUpdate(req.body.reply_id, { text: "[deleted]" });
    res.send("success");
    } else {
    res.send("incorrect password");
    }
} catch (e) {
    console.log(e)
    res.send({error: e})
}
});

//create reply - I have to pass time otherwise fcc test fails
async function createReply(time, thread_id, text, password) {
return new Reply({
    thread: thread_id,
    text: text,
    password: hash.hashPassword(password),
    created_on: time
}).save();
}

//update thread - I have to pass time otherwise fcc test fails
async function updateThread(time, thread_id, reply_id) {
return Thread.findByIdAndUpdate(thread_id, {
    $push: { replies: reply_id },
    bumped_on: time
});
}

async function returnReplies(thread_id) {
try {
    let replies = await Reply.find({ thread: thread_id }).sort({ created_on: -1 });
    return replies.map(reply => {
    return {
        _id: reply._id,
        text: reply.text,
        created_on: reply.created_on
    }
    });
}
catch (e) {
    console.log(e);
    return null;
}
}

async function returnThread(thread_id) {
try {
    const thread = await Thread.findById(thread_id);
    const replies = await returnReplies(thread_id);
    const jsonedThread = {
    _id: thread._id,
    text: thread.text,
    created_on: thread.created_on,
    bumped_on: thread.bumped_on,
    replycount: replies.length,
    replies: replies
    }
    return jsonedThread;
}
catch (e) {
    console.log(e);
    return null;
}
}

/* ~~~~~~ THREADS ~~~~~~ */

router.get('/api/threads/:board', async (req, res) => {
    try {
      let board = await Board.findOne({ text: req.params.board });
      if(!board) {
        board = await createBoard(req.params.board);
      }
      const threads = await returnThreads(board._id);
      res.send(threads);
    } 
    catch (e) {
      console.log(e); 
      res.send({error: e});
    }
  });
  
  //post a new thread
  router.post('/api/threads/:board', async (req, res) => {
    let time = Date.now();
    let { text, delete_password } = req.body;
    let hashedPassword = hash.hashPassword(delete_password);
    try {
      let parent_board = await Board.findOne({ text: req.params.board });
      if(!parent_board) {
        parent_board = await createBoard(req.params.board);
      }
      let thread = await new Thread({
        board: parent_board.id,
        text: text,
        password: hashedPassword,
        created_on: time,
        bumped_on: time
      }).save();
      res.redirect(`/projects/is/message-board/b/${req.params.board}`);
    } catch (e) {
      console.log(e)
      res.send({error: e})
    }
  });
  
  //report a thread
  router.put('/api/threads/:board', async (req, res) => {
    try {
      let thread = await Thread.findByIdAndUpdate(req.body.thread_id, { reported: true }); 
      res.send("reported")
    } catch (e) {
     console.log(e) 
     res.send({error: e})
    }
  });
  
  //delete a thread
  router.delete('/api/threads/:board', async (req, res) => {
    let { thread_id, delete_password } = req.body;
    try {
      let thread = await Thread.findById(thread_id) 
      if(hash.comparePassword(delete_password, thread.password)) {
        await Thread.findByIdAndDelete(thread_id);
        await Reply.deleteMany({ thread: thread_id });
        res.send("success");
      } else {
        res.send("incorrect password");
      }
    } catch (e) {
      console.log(e)
      res.send({error: e})
    }
  });
  
  async function returnReplies(thread_id) {
    try {
      //get all replies for a thread
      let replies = await Reply.find({ thread: thread_id }).sort({ created_on: -1 });
      return replies.map(reply => {
        return {
          _id: reply._id,
          text: reply.text,
          created_on: reply.created_on
        }
      });
    }
    catch (e) {
      console.log(e);
      return null;
    }
  }
  
  async function returnThreads(board_id) {
    try {
      //get the 10 most recent threads
      const threads = await Thread.find({ board: board_id })
        .sort({ bumped_on: -1 })
        .limit(10)
      //convert threads to json
      let jsonedThreads = threads.map(thread => {
        return {
          _id: thread._id,
          text: thread.text,
          created_on: thread.created_on,
          bumped_on: thread.bumped_on,
        }
      });
      //add replycount and replies to each thread
      //using a for loop because I need to use await
      for (let inc in jsonedThreads) {
        const reply = await returnReplies(jsonedThreads[inc]._id);
        jsonedThreads[inc].replycount = reply.length;
        jsonedThreads[inc].replies = reply.slice(0,3);
      }
      return jsonedThreads;
    } catch (e) {
    console.log(e);
    return null;
    }
  }
  
  
  async function createBoard(board) {
    return new Board({
      text: board,
      threads: []
    }).save();
  }
  
  function mongoReset() {
    Board.collection.drop((err, res) => {
      if(err) console.log(err);
      console.log(res);
    })
    Thread.collection.drop((err, res) => {
      if(err) console.log(err);
      console.log(res);
    })
    Reply.collection.drop((err, res) => {
      if(err) console.log(err);
      console.log(res);
    })
  }

module.exports = router;
  