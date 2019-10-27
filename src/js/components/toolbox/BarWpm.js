import React from 'react';
import PropTypes from 'prop-types';

const maxWpm = 2000;
const widthBar = '1.1cm';

const styleBar = {
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  width: widthBar,
  border: '0.1cm solid black',
  background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5))',
  transition: "width 0.2s linear",
};

const styleMark = {
  position: "absolute",
  left: "0",
  width: widthBar,
  textAlign: "center",
  fontSize: "0.7em",
  fontWeight: "900",
  color: "white",
  marginTop: "0.2cm",
};

const styleStep = {
  position: "absolute",
  left: widthBar,
  background: "black",
  color: "white",
  fontSize: "0.8em",
  padding: "0.4em",
};

const styleCursor = {
  position: "absolute",
  height: widthBar,
  width: widthBar,
  color: "white",
  backgroundColor: "black",
  boxShadow: "0 0 0 0.35cm rgba(0, 0, 0, 0.3)",
  borderRadius: "50%",
  zIndex: "2",
};

function BarWpm({ wpm }) {

  // Calculate the vertical position of the cursor inside the bar
  let position = 50;
  let text = wpm;

  // Support the default WPM (0)
  if (wpm > 0) {
    position = 100 - (wpm * 100 / maxWpm);
  } else {
    text = '?';
  }

  // Adjust to make sure the cursor is always visible
  if (position < 0) {
    position = 0;
  } else if (position > 90) {
    position = 90;
  }

  return (
    <div style={styleBar}>

      {/* Position the cursor */}
      <span style={{...styleCursor, top: `${position}%`}} className="Centered">{text}</span>

      {/* Add markers for comparison */}
      <span style={{...styleMark, top: "10%"}}>{maxWpm}+</span>
      <span style={{...styleStep, top: "10%"}}>Champion</span>

      <span style={{...styleMark, top: "30%"}}>800</span>
      <span style={{...styleStep, top: "30%"}}>Speed Reader</span>

      <span style={{...styleMark, top: "80%"}}>400</span>
      <span style={{...styleStep, top: "80%"}}>Fast Reader</span>

      <span style={{...styleMark, top: "90%"}}>200</span>
      <span style={{...styleStep, top: "90%"}}>Average Reader</span>

    </div>
  );
}

BarWpm.propTypes = {
  // User current WPM
  wpm: PropTypes.number,
}

BarWpm.defaultProps = {
  wpm: 200,
};

export default BarWpm;
