marked.setOptions({
  gfm: true,
  breaks: true
});
class Markdown extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement("div", {
      id: "markdown"
    }, /*#__PURE__*/React.createElement("p", {
      className: "header"
    }, "Markdown Formatting Input"), /*#__PURE__*/React.createElement("textarea", {
      id: "editor",
      value: this.props.value,
      onChange: this.props.sendInput
    }));
  }
}
class Preview extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement("div", {
      id: "results"
    }, /*#__PURE__*/React.createElement("p", {
      className: "header"
    }, "Markdown Formated Output"), /*#__PURE__*/React.createElement(MarkdownExample, {
      output: this.props.output
    }));
  }
}
class MarkdownExample extends React.Component {
  getMarkdownText() {
    var rawMarkup = marked.parse(this.props.output);
    return {
      __html: rawMarkup
    };
  }
  render() {
    return /*#__PURE__*/React.createElement("div", {
      id: "preview",
      dangerouslySetInnerHTML: this.getMarkdownText()
    });
  }
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: `# Welcome to my Markdown Previewer
## This short demo showcases the power of marked library.

Click if you want to learn more about [Marked](https://marked.js.org/#usage) and its usage.

I can create ordered lists:

1. First item
2. Second item
3. Third item

But also un-ordered lists:

- I'm first
- I'm second
- I'm third

If you feel adventurous you can even create a list containing lists! Example:

1. First item 
- I'm first's 1st
- I'm first's second
2. Second item
- Second's first!
    - Second's first's first!
    - Okay that's probably enough now..
3. Third item
- I'm first
- I'm second

> Here's a quote from a great thinker: *'I think* **therefore** *I am'*

I recently created a *'complex'* regEx algorithm that checks if a US phone number is valid, I though I'd share it here:\n
\`const complexRegEx = /^(1[\s-(]?)?(\(\d{3}\)|\d{3})[\s-]?\s?\d{3}[\s-]?\d{4}$/\`
\`\`\`
function telephoneCheck(str) {
return /^(1[\s-(]?)?(\(\d{3}\)|\d{3})[\s-]?\s?\d{3}[\s-]?\d{4}$/.test(str);
}
\`\`\``
    };
    this.getInput = this.getInput.bind(this);
  }
  getInput(e) {
    this.setState({
      input: e.target.value
    });
  }
  render() {
    return /*#__PURE__*/React.createElement("div", {
      id: "wrapper"
    }, /*#__PURE__*/React.createElement(Markdown, {
      value: this.state.input,
      sendInput: this.getInput
    }), /*#__PURE__*/React.createElement(Preview, {
      output: this.state.input
    }));
  }
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render( /*#__PURE__*/React.createElement(App, null));
