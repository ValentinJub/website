const Quotes = [{
  author: 'Frank Zappa',
  quote: 'So many books, so little time'
}, {
  author: 'Oscar wild',
  quote: 'Be yourself; everyone else is already taken'
}, {
  author: 'Albert Einstein',
  quote: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe"
}, {
  author: 'Marcus Tullius Cicero',
  quote: 'A room without books is like a body without a soul'
}, {
  author: 'Bernard M. Baruch',
  quote: "Be who you are and say what you feel, because those who mind don't matter, and those who matter don't mind"
}, {
  author: 'Mae West',
  quote: 'You only live once, but if you do it right, once is enough'
}, {
  author: 'Mahatma Gandhi',
  quote: 'Be the change that you wish to see in the world'
}, {
  author: 'Mark Twain',
  quote: "If you tell the truth, you don't have to remember anything"
}];
class UI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rand: 0,
      quoteStyle: {}
    };
  }
  render() {
    const authors = Quotes.map(x => x.author);
    const quotes = Quotes.map(x => x.quote);
    let quoteStyle = {};
    if (Quotes[this.state.rand]["quote"].length > 75) {
      quoteStyle = {
        fontSize: "20px"
      };
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "container UI"
    }, /*#__PURE__*/React.createElement("div", {
      className: "box",
      id: "quote-box"
    }, /*#__PURE__*/React.createElement("p", {
      id: "text",
      style: quoteStyle
    }, "\"", quotes[this.state.rand], "\""), /*#__PURE__*/React.createElement("p", {
      id: "author"
    }, /*#__PURE__*/React.createElement("em", null, "-", authors[this.state.rand], "-")), /*#__PURE__*/React.createElement("div", {
      id: "buttons"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        const rand = Math.floor(Math.random() * Quotes.length);
        return this.setState({
          rand: rand
        });
      },
      type: "button",
      className: "btn btn-primary",
      id: "new-quote"
    }, "Random quote!"), /*#__PURE__*/React.createElement("a", {
      id: "tweet-quote",
      className: "btn btn-warning",
      href: "https://www.twitter.com/intent/tweet",
      target: "_blank"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-brands fa-twitter"
    }), "Tweet it!"))), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", {
      id: "foot"
    }, "Made by ", /*#__PURE__*/React.createElement("a", {
      id: "me",
      href: "https://codepen.io/ValentinW",
      target: "_blank"
    }, "Valentin Wissler")));
  }
}
class App extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement(UI, null);
  }
}

//display react content to the page
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render( /*#__PURE__*/React.createElement(App, null));
