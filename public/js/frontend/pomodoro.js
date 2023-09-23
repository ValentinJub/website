function Clock(props) {
            
    let time = props.timer;
    let seconds = time % 60;
    seconds = seconds > 9 ? seconds : String('0' + seconds);
    let minutes = seconds > 0 ? (time - seconds) / 60 : time / 60;
    minutes = minutes > 9 ? minutes : String('0' + minutes)
    let clock = minutes + ':' + seconds;
    
    let sesh = props.session ? 'Work hard' : 'Rest';
    
    return (
        <div id="clock">
        <div id="timer-label">{sesh}</div>
        <br/>
        <div id="time-left">{clock}</div>
        <br/>
        <div id="buttons-row">
            <button 
            id="start_stop"
            className="btn"
            type="button"
            onClick={props.handlePlay}
            >
            <svg viewBox="0 0 448 512" width="40" title="play" fill="#e8636e">
            <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
            </svg>
            </button>
            <button 
            id="reset"
            className="btn"
            type="button"
            onClick={props.handleReset}
            >
            <svg viewBox="0 0 512 512" width="45" title="sync" fill="#e8636e">
            <path d="M440.65 12.57l4 82.77A247.16 247.16 0 0 0 255.83 8C134.73 8 33.91 94.92 12.29 209.82A12 12 0 0 0 24.09 224h49.05a12 12 0 0 0 11.67-9.26 175.91 175.91 0 0 1 317-56.94l-101.46-4.86a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12H500a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12h-47.37a12 12 0 0 0-11.98 12.57zM255.83 432a175.61 175.61 0 0 1-146-77.8l101.8 4.87a12 12 0 0 0 12.57-12v-47.4a12 12 0 0 0-12-12H12a12 12 0 0 0-12 12V500a12 12 0 0 0 12 12h47.35a12 12 0 0 0 12-12.6l-4.15-82.57A247.17 247.17 0 0 0 255.83 504c121.11 0 221.93-86.92 243.55-201.82a12 12 0 0 0-11.8-14.18h-49.05a12 12 0 0 0-11.67 9.26A175.86 175.86 0 0 1 255.83 432z" />
            </svg>
            </button>
        </div>
        </div>
    )
    }

    function SessionDial(props) {
    let seshTime = props.sessionTime / 60;
    return (
        <div id="session">
        <div id="session-label">Session length</div>
        <button 
            className="btn"
            type="button"
            id="session-increment"
            onClick={() => props.handleClick('session','+')}
        >
        <svg viewBox="0 0 320 512" width="40" title="angle-up" fill="#e8636e">
        <path d="M177 159.7l136 136c9.4 9.4 9.4 24.6 0 33.9l-22.6 22.6c-9.4 9.4-24.6 9.4-33.9 0L160 255.9l-96.4 96.4c-9.4 9.4-24.6 9.4-33.9 0L7 329.7c-9.4-9.4-9.4-24.6 0-33.9l136-136c9.4-9.5 24.6-9.5 34-.1z" />
        </svg>
        </button>
        <div id="session-length">{seshTime}</div>
        <button
            className="btn"
            id="session-decrement"
            type="button"
            onClick={() => props.handleClick('session','-')}
        >
        <svg viewBox="0 0 320 512" width="40" title="angle-down" fill="#e8636e">
        <path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z" />
        </svg>
        </button>
        </div>
    )
    }

    function BreakDial(props) {

    return (
        <div id="break">
        <div id="break-label">Break length</div>
        <button
        className="btn"
        id="break-increment"
        type="button"
        onClick={() => props.handleClick('break','+')}
        >
        <svg viewBox="0 0 320 512" width="40" title="angle-up" fill="#e8636e">
        <path d="M177 159.7l136 136c9.4 9.4 9.4 24.6 0 33.9l-22.6 22.6c-9.4 9.4-24.6 9.4-33.9 0L160 255.9l-96.4 96.4c-9.4 9.4-24.6 9.4-33.9 0L7 329.7c-9.4-9.4-9.4-24.6 0-33.9l136-136c9.4-9.5 24.6-9.5 34-.1z" />
        </svg>
        </button>
        <div id="break-length">{props.breakTime / 60}</div>
        <button 
        className="btn"
        id="break-decrement"
        type="button"
        onClick={() => props.handleClick('break','-')}
        >
        <svg viewBox="0 0 320 512" width="40" title="angle-down" fill="#e8636e">
        <path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z" />
        </svg>
        </button>
        </div>
    )
    }

    class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        timerRunning: false,
        timer: 1500,
        break: 300,
        session: 1500,
        inSession: true,
        intervalId: null
        }
        this.playButton = this.playButton.bind(this);
        this.resetButton = this.resetButton.bind(this);
        this.countdown = this.countdown.bind(this);
        this.tweakTime = this.tweakTime.bind(this);
        this.beep = this.beep.bind(this);
        this.switchSesh = this.switchSesh.bind(this);
        this.setInterval = this.setInterval.bind(this);
        this.clearInterval = this.clearInterval.bind(this);

    }
    
    beep() {
        //retrieve which audio elem to play from by its unique ID
        const sound = document.getElementById("beep");
        //set currentTime to 0 to allow for repeat key presses
        sound.currentTime = 0;
        sound.play();
    }
    
    tweakTime(context,action) {
        let rest = this.state.break;
        let session = this.state.session;
        if(this.state.timerRunning) return;
        switch(context) {
        case 'session':
            switch(action) {
            case '+':
                session = session >= 3600 ? 3600 : session + 60;
                break;
            case '-':
                session = session <= 60 ? 60 : session - 60;
                break;
            }
            break;
        case 'break':
            switch(action) {
            case '+':
                rest = rest >= 3600 ? 3600 : rest + 60;
                break;
            case '-':
                rest = rest <= 60 ? 60 : rest - 60;
                break;
            }
            break;
        default:break;
        }
        this.setState({break:rest,session:session,timer:session});
    }

    switchSesh() {
        if(this.state.inSession){  
        this.setState({timer:this.state.break, inSession:false});        
        }
        else {
        this.setState({timer:this.state.session, inSession:true});
        }
    }

    setInterval() {
        //define timeLimit according to inSession or inBreak
        const timeLimit = this.state.inSession ? this.state.session : this.state.break
        this.setState({intervalId: setInterval(this.countdown,1000),timerRunning:true});
    }
    
    clearInterval() {
        clearInterval(this.state.intervalId);
        this.setState({intervalId: null,timerRunning:false});
    }
    
    countdown() {
        let c = this.state.timer;  
        if(c === 0) {
        this.beep();
        this.switchSesh();
        }
        else {
        c--;
        this.setState({timer:c < 0 ? 0 : c}); 
        }
    }


    playButton() {
        if(!this.state.timerRunning) {
        //Start timer
        this.setInterval();
        }
        else {
        //pause timer
        this.clearInterval();
        }
    }
    
    resetButton() {
        const sound = document.getElementById("beep");
        sound.pause();
        sound.currentTime = 0;
        
        if(this.state.timerRunning) {
        this.clearInterval();
        }
        
        this.setState({timer:1500,session:1500,break:300,inSession:true});
    }
    
    render() {
        return (
        <div id="timer">
            <audio 
            src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
            className="clip"
            id="beep"
            />
            <SessionDial 
            sessionTime={this.state.session}
            handleClick={this.tweakTime}/>
            <Clock 
            handleReset={this.resetButton}
            handlePlay={this.playButton}
            timer={this.state.timer}
            session={this.state.inSession}
            />
            <BreakDial 
            breakTime={this.state.break}
            handleClick={this.tweakTime}/>
        </div>
        )
    }
    }

    function App() {
    return (
        <div className="App">
        <Timer />
        </div>
    );
    }

    ReactDOM.render(<App />, document.getElementById('root'));