const Quotes = [
    {author: 'Frank Zappa',
    quote: 'So many books, so little time'},
    {author: 'Oscar wild',
    quote: 'Be yourself; everyone else is already taken'},
    {author: 'Albert Einstein',
    quote: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe"},
    {author: 'Marcus Tullius Cicero',
    quote: 'A room without books is like a body without a soul'},
    {author: 'Bernard M. Baruch',
    quote: "Be who you are and say what you feel, because those who mind don't matter, and those who matter don't mind"},
    {author: 'Mae West',
    quote: 'You only live once, but if you do it right, once is enough'},
    {author: 'Mahatma Gandhi',
    quote: 'Be the change that you wish to see in the world'},
    {author: 'Mark Twain',
    quote: "If you tell the truth, you don't have to remember anything"}
];


class UI extends React.Component {
constructor(props) {
    super(props)
    this.state = {
    rand: 0,
    quoteStyle: {}
    }
}
render() {
    const authors = Quotes.map((x) => x.author);
    const quotes = Quotes.map((x) => x.quote);
    let quoteStyle = {};
    if(Quotes[this.state.rand]["quote"].length > 75) {
    quoteStyle = {
        fontSize: "20px"
    }
    }
    return (
    <div className="container UI">
        <div className="box" id="quote-box">
            <p id="text"
            style={quoteStyle}>"{quotes[this.state.rand]}"
            </p>
            <p id="author"><em>-{authors[this.state.rand]}-</em></p>
            <div id="buttons">
            <button onClick={() => {
                const rand = Math.floor(Math.random() * Quotes.length);  
                return this.setState({rand:rand});
                }}
                type="button"
                className="btn btn-primary"
                id="new-quote"
            >Random quote!</button>
            <a id="tweet-quote" className="btn btn-warning" href="https://www.twitter.com/intent/tweet" target="_blank"><i className="fa-brands fa-twitter"></i>Tweet it!</a>
            </div>
        </div>
        <br/>
        <p id="foot">Made by <a id="me" href="https://codepen.io/ValentinW" target="_blank">Valentin Wissler</a></p>
    </div>
    )
}
}

class App extends React.Component {
    render() {
        return (
            <UI />
        )
    }
}

//display react content to the page
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);