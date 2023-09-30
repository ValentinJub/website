$( document ).ready(function() {
    let  items = [];
    let  itemsRaw = [];
    
    $.getJSON('library/api/books', function(data) {
      //let  items = [];
      itemsRaw = data;
      $.each(data, function(i, val) {
        items.push('<li class="bookItem" id="' + i + '">' + val.title + ' - ' + val.commentcount + ' comments</li>');
        return ( i !== 14 );
      });
      if (items.length >= 15) {
        items.push('<p>...and '+ (data.length - 15)+' more!</p>');
      }
      $('<ul/>', {
        'class': 'listWrapper',
        html: items.join('')
        }).appendTo('#display');
    });
    
    let  comments = [];
    $('#display').on('click','li.bookItem',function() {
      $("#detailTitle").html('<b>'+itemsRaw[this.id].title+'</b> (id: '+itemsRaw[this.id]._id+')');
      $.getJSON('library/api/books/'+itemsRaw[this.id]._id, function(data) {
        comments = [];
        $.each(data.comments, function(i, val) {
          comments.push('<li>' +val+ '</li>');
        });
        comments.push('<br><form id="newCommentForm"><input type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment"></form>');
        comments.push('<br><button class="btn btn-info addComment" id="'+ data._id+'">Add Comment</button>');
        comments.push('<button class="btn btn-danger deleteBook" id="'+ data._id+'">Delete Book</button>');
        $('#detailComments').html(comments.join(''));
      });
    });
    
    $('#bookDetail').on('click','button.deleteBook',function() {
      $.ajax({
        url: 'library/api/books/'+this.id,
        type: 'delete',
        success: function(data) {
          //update list
          $('#detailComments').html('<p class="detailComments">'+data+'<p><p>Refresh the page</p>');
        }
      });
    });  
    
    $('#bookDetail').on('click','button.addComment',function() {
      let  newComment = $('#commentToAdd').val();
      $.ajax({
        url: 'library/api/books/'+this.id,
        type: 'post',
        dataType: 'json',
        data: $('#newCommentForm').serialize(),
        success: function(data) {
          comments.unshift(newComment); //adds new comment to top of list
          $('#detailComments').html(comments.join(''));
        }
      });
    });
    
    
    $('#newBook').click(function(e) {
      e.preventDefault();
      $.ajax({
        url: 'library/api/books',
        type: 'post',
        dataType: 'json',
        data: $('#newBookForm').serialize(),
        success: function(data) {
          return false;
        }
      });
    });
    
    $('#deleteAllBooks').click(function() {
      $.ajax({
        url: 'library/api/books',
        type: 'delete',
        dataType: 'json',
        success: function(data) {
          //update list
        }
      });
    }); 

    $('#commentTest').submit(function(){
      let  id = $('#idinputtest').val();
      $(this).attr('action', "library/api/books/" + id);
    });
});