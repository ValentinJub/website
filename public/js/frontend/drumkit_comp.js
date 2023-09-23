const bankOne = [{
  keyCode: 81,
  keyTrigger: 'Q',
  id: 'Heater-1',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3'
}, {
  keyCode: 87,
  keyTrigger: 'W',
  id: 'Heater-2',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3'
}, {
  keyCode: 69,
  keyTrigger: 'E',
  id: 'Heater-3',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3'
}, {
  keyCode: 65,
  keyTrigger: 'A',
  id: 'Heater-4',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3'
}, {
  keyCode: 83,
  keyTrigger: 'S',
  id: 'Clap',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'
}, {
  keyCode: 68,
  keyTrigger: 'D',
  id: 'Open-HH',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'
}, {
  keyCode: 90,
  keyTrigger: 'Z',
  id: "Kick-n-Hat",
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'
}, {
  keyCode: 88,
  keyTrigger: 'X',
  id: 'Kick',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'
}, {
  keyCode: 67,
  keyTrigger: 'C',
  id: 'Closed-HH',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'
}];
function DrumPad(props) {
  function playSound(i) {
    //retrieve which audio elem to play from by its unique ID
    const sound = document.getElementById(props.value);
    //set currentTime to 0 to allow for repeat key presses
    sound.currentTime = 0;
    sound.play();
  }
  return /*#__PURE__*/React.createElement("div", {
    id: props.id,
    className: "drum-pad",
    onClick: () => {
      //play music
      playSound(props.index);
      //refresh display
      props.track(props.index);
    }
  }, /*#__PURE__*/React.createElement("audio", {
    src: props.src,
    className: "clip",
    id: props.value
  }), props.value);
}
class Drumkit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentlyPlaying: ''
    };
    this.updateDisplay = this.updateDisplay.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }
  handleKeyDown(e) {
    let index = 0;
    let sound, id;
    switch (e.keyCode) {
      case bankOne[0].keyCode:
        index = 0;
        id = bankOne[index].keyTrigger;
        sound = document.getElementById(id);
        sound.currentTime = 0;
        sound.play();
        this.updateDisplay(index);
        break;
      case bankOne[1].keyCode:
        index = 1;
        id = bankOne[index].keyTrigger;
        sound = document.getElementById(id);
        sound.currentTime = 0;
        sound.play();
        this.updateDisplay(index);
        break;
      case bankOne[2].keyCode:
        index = 2;
        id = bankOne[index].keyTrigger;
        sound = document.getElementById(id);
        sound.currentTime = 0;
        sound.play();
        this.updateDisplay(index);
        break;
      case bankOne[3].keyCode:
        index = 3;
        id = bankOne[index].keyTrigger;
        sound = document.getElementById(id);
        sound.currentTime = 0;
        sound.play();
        this.updateDisplay(index);
        break;
      case bankOne[4].keyCode:
        index = 4;
        id = bankOne[index].keyTrigger;
        sound = document.getElementById(id);
        sound.currentTime = 0;
        sound.play();
        this.updateDisplay(index);
        break;
      case bankOne[5].keyCode:
        index = 5;
        id = bankOne[index].keyTrigger;
        sound = document.getElementById(id);
        sound.currentTime = 0;
        sound.play();
        this.updateDisplay(index);
        break;
      case bankOne[6].keyCode:
        index = 6;
        id = bankOne[index].keyTrigger;
        sound = document.getElementById(id);
        sound.currentTime = 0;
        sound.play();
        this.updateDisplay(index);
        break;
      case bankOne[7].keyCode:
        index = 7;
        id = bankOne[index].keyTrigger;
        sound = document.getElementById(id);
        sound.currentTime = 0;
        sound.play();
        this.updateDisplay(index);
        break;
      case bankOne[8].keyCode:
        index = 8;
        id = bankOne[index].keyTrigger;
        sound = document.getElementById(id);
        sound.currentTime = 0;
        sound.play();
        this.updateDisplay(index);
        break;
      default:
        break;
    }
  }
  updateDisplay(i) {
    this.setState({
      currentlyPlaying: bankOne[i].id.replace(/[-]/, ' ')
    });
  }
  layRows(i) {
    const value = bankOne[i].keyTrigger;
    const id = bankOne[i].id;
    const src = bankOne[i].url;
    return /*#__PURE__*/React.createElement(DrumPad, {
      index: i,
      value: value,
      id: id,
      src: src,
      track: this.updateDisplay
    });
  }
  render() {
    return /*#__PURE__*/React.createElement("div", {
      id: "container"
    }, /*#__PURE__*/React.createElement("div", {
      id: "drum-machine"
    }, /*#__PURE__*/React.createElement("div", {
      id: "display"
    }, this.state.currentlyPlaying), /*#__PURE__*/React.createElement("div", {
      id: "pad"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, this.layRows(0), this.layRows(1), this.layRows(2)), /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, this.layRows(3), this.layRows(4), this.layRows(5)), /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, this.layRows(6), this.layRows(7), this.layRows(8)))), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", {
      id: "footer"
    }, "Made by Valentin Wissler"));
  }
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( /*#__PURE__*/React.createElement(React.StrictMode, null, /*#__PURE__*/React.createElement(Drumkit, null)));
