const keys = 'C/789*456-123+0.=';
const sign = ['clear','divide','seven','eight','nine','multiply','four','five','six','subtract','one','two','three','add','zero','decimal','equals'];

//screen displaying results and current inputs
class Display extends React.Component {
render() {
    return (
    <div id="display">
    {this.props.value}
    </div>
    )
}
}

//keys to input 
function Key(props) {
return (
    <div
    className="keys"
    id={props.identity}
    onClick={() => props.handleKey(props.value)}
    >
    {props.value}
    </div>
)
}

//set of keys
class Pad extends React.Component {
constructor(props) {
    super(props);
    this.state = {
    
    };
}

//add event listener to monitor keyboard inputs
componentDidMount() {
    document.addEventListener('keydown', this.handleKeyEvent);
}

//remove event listener when component unmounts
componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyEvent);
}

//if you dont use arrow function the this becomes this function and not this class
handleKeyEvent = (e) => {
    if(keys.indexOf(e.key) !== -1) {
        this.props.onClick(e.key)
    }
}

layKey(i) {
    return <Key 
    value={keys[i]} 
    identity={sign[i]}
    handleKey={() => this.props.onClick(keys[i])}
    />
}

render() {
    return (
    <div id="pad">
        <div id="row-1">
        {this.layKey(0)}
        {this.layKey(1)}
        </div>
        <div id="row-2">
        {this.layKey(2)}
        {this.layKey(3)}
        {this.layKey(4)}
        {this.layKey(5)}
        </div>
        <div id="row-3">
        {this.layKey(6)}
        {this.layKey(7)}
        {this.layKey(8)}
        {this.layKey(9)}
        </div>
        <div 
        id="row-4">
        {this.layKey(10)}
        {this.layKey(11)}
        {this.layKey(12)}
        {this.layKey(13)}
        </div>
        <div id="row-5">
        {this.layKey(14)}
        {this.layKey(15)}
        {this.layKey(16)}
        </div>
    </div>
    )
}
}

//calculator, do logic here
class Calculator extends React.Component {
constructor(props) {
    super(props);
    this.state = {
    //input to display
    input: '0',
    //mathematical expression
    expression: [],
    //switch for symbols use
    symbolUsed: false,
    //symbol array to manage multiple symbols in a row
    symbols: [],
    //switch to close parenthesis
    parenthesisNeedClosing: false
    };
    this.handleKeyClick = this.handleKeyClick.bind(this);
    this.calculate = this.calculate.bind(this);
}

calculate(expression) {
    const exp = expression.join('');
    const result = math.evaluate(exp);
    this.setState({input:result,expression:[],symbolUsed:false,parenthesisNeedClosing:false});
}

//return 1 if parenthesis need closing
manageSymbols(symbols,exp,input) {
    if(symbols.length === 1) {
    exp.push(input);
    exp.push(symbols[0]);
    symbols.length = 0;
    return 0;
    }
    else if(symbols.length > 1) {
    exp.push(input);
    if(symbols[symbols.length - 1] === '-') {
        exp.push(symbols[symbols.length - 2]);
        exp.push('(-');
        symbols.length = 0;
        return 1;
    }
    else {
        exp.push(symbols[symbols.length - 1]);
        symbols.length = 0;
        return 0;
    }
    }
}

handleKeyClick(key) {
    let currentInput = this.state.input;
    let exp = [...this.state.expression]; 
    let symbols = [...this.state.symbols];
    let par = this.state.parenthesisNeedClosing;
    switch (key) {
    
    /*----------------------------Numbers----------------------------*/
    
    case '0':
        //do not add 0 next to a starting 0
        if(currentInput != '0') {
        currentInput += '0'
        }
        else if(this.state.symbolUsed) {
        par = this.manageSymbols(symbols, exp, currentInput);
        currentInput = '0';
        }
        this.setState({input:currentInput,symbolUsed:false,expression:exp,symbols:symbols,parenthesisNeedClosing:par});
        break;
    case '1':
        if(currentInput == '0') {
        currentInput = '1';
        }
        else if(this.state.symbolUsed) {
        par = this.manageSymbols(symbols, exp, currentInput);
        currentInput = '1'
        }
        else {
        currentInput += '1'
        }
        this.setState({input:currentInput,symbolUsed:false,expression:exp,symbols:symbols,parenthesisNeedClosing:par});
        break;
    case '2':
        if(currentInput == '0') {
        currentInput = '2';
        }
        else if(this.state.symbolUsed) {
        par = this.manageSymbols(symbols, exp, currentInput);
        currentInput = '2'
        }
        else {
        currentInput += '2'
        }
        this.setState({input:currentInput,symbolUsed:false,expression:exp,symbols:symbols,parenthesisNeedClosing:par});
        break;
    case '3':
        if(currentInput == '0') {
        currentInput = '3';
        }
        else if(this.state.symbolUsed) {
        par = this.manageSymbols(symbols, exp, currentInput);
        currentInput = '3'
        }
        else {
        currentInput += '3'
        }
        this.setState({input:currentInput,symbolUsed:false,expression:exp,symbols:symbols,parenthesisNeedClosing:par});
        break;
    case '4':
        if(currentInput == '0') {
        currentInput = '4';
        }
        else if(this.state.symbolUsed) {
        par = this.manageSymbols(symbols, exp, currentInput);
        currentInput = '4'
        }
        else {
        currentInput += '4'
        }
        this.setState({input:currentInput,symbolUsed:false,expression:exp,symbols:symbols,parenthesisNeedClosing:par});
        break;
    case '5':
        if(currentInput == '0') {
        currentInput = '5';
        }
        else if(this.state.symbolUsed) {
        par = this.manageSymbols(symbols, exp, currentInput);
        currentInput = '5'
        }
        else {
        currentInput += '5'
        }
        this.setState({input:currentInput,symbolUsed:false,expression:exp,symbols:symbols,parenthesisNeedClosing:par});
        break;
    case '6':
        if(currentInput == '0') {
        currentInput = '6';
        }
        else if(this.state.symbolUsed) {
        par = this.manageSymbols(symbols, exp, currentInput);
        currentInput = '6'
        }
        else {
        currentInput += '6'
        }
        this.setState({input:currentInput,symbolUsed:false,expression:exp,symbols:symbols,parenthesisNeedClosing:par});
        break;
    case '7':
        if(currentInput == '0') {
        currentInput = '7';
        }
        else if(this.state.symbolUsed) {
        par = this.manageSymbols(symbols, exp, currentInput);
        currentInput = '7'
        }
        else {
        currentInput += '7'
        }
        this.setState({input:currentInput,symbolUsed:false,expression:exp,symbols:symbols,parenthesisNeedClosing:par});
        break;
    case '8':
        if(currentInput == '0') {
        currentInput = '8';
        }
        else if(this.state.symbolUsed) {
        par = this.manageSymbols(symbols, exp, currentInput);
        currentInput = '8'
        }
        else {
        currentInput += '8'
        }
        this.setState({input:currentInput,symbolUsed:false,expression:exp,symbols:symbols,parenthesisNeedClosing:par});
        break;
    case '9':
        if(currentInput == '0') {
        currentInput = '9';
        }
        else if(this.state.symbolUsed) {
        par = this.manageSymbols(symbols, exp, currentInput);
        currentInput = '9'
        }
        else {
        currentInput += '9'
        }
        this.setState({input:currentInput,symbolUsed:false,expression:exp,symbols:symbols,parenthesisNeedClosing:par});
        break;
    
    /*----------------------------/Numbers----------------------------*/
    /*----------------------------Decimal----------------------------*/
    
    case '.':
        //look into positive or negative lookaheads and other advanced regEx to avoid multiple decimal points in same expression
        if(/\d+\W\d*$/.test(currentInput) || this.state.symbolUsed) {
        return;
        }
        else currentInput += '.';
        this.setState({input:currentInput});
        break;
    
    /*----------------------------/Decimal----------------------------*/
    /*----------------------------Symbols----------------------------*/
    
    case '+':
        if(par) {
        exp.push(')');
        par = false;
        }
        symbols.push('+');
        this.setState({expression:exp,symbolUsed:true,symbols:symbols,parenthesisNeedClosing:par});
        break;
    case '-':
        if(par) {
        exp.push(')');
        par = false;
        }
        symbols.push('-');
        this.setState({expression:exp,symbolUsed:true,symbols:symbols,parenthesisNeedClosing:par});
        break;
    case '*':
        if(par) {
        exp.push(')');
        par = false;
        }
        symbols.push('*');
        this.setState({expression:exp,symbolUsed:true,symbols:symbols,parenthesisNeedClosing:par});
        break;
    case '/':
        if(par) {
        exp.push(')');
        par = false;
        }
        symbols.push('/');
        this.setState({expression:exp,symbolUsed:true,symbols:symbols,parenthesisNeedClosing:par});
        break;
    
    /*----------------------------/Symbols----------------------------*/
    
    case 'C':
        currentInput = '0';
        exp = [];
        symbols = [];
        this.setState({input:currentInput,expression:exp,symbols:symbols,symbolUsed:false,parenthesisNeedClosing:false});
        break;
    
    case '=':
        if(par) {
        exp.push(currentInput);
        exp.push(')');
        par = false;
        }
        else {
        exp.push(currentInput);
        }
        this.calculate(exp);
        break;
    
    default:
        break;
    }
}

render() {
    return (
        <div id="calc">
        <Display value={this.state.input} />
        <Pad onClick={(key) => this.handleKeyClick(key)}/>
        </div>
    )
}
}

//app render function
function App() {
    return (
        <div id="container">
        <Calculator />
        <p id="footer">Made by Valentin Wissler</p>
        </div>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
    );


// ReactDOM.render(<App />, document.getElementById('root'))