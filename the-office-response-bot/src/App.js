import React, { useEffect, useState, useRef } from "react";
import logo from './prison-mike.jpeg';
import on_mic from './mic.svg';
import off_mic from './muted_mic.svg'
import './App.css';
import data from './office-lines.js';
import FuzzySet from "fuzzyset.js";
import { flushSync } from "react-dom";

function App() {

  const [userText, setUserText] = useState('');
  const [lines, setLines] = useState([]);
  let michaelLine = 'Sometimes I’ll start a sentence and I don’t even know where it’s going. I just hope I find it along the way.';
  const [botResponse, setBotResponse] = useState(michaelLine);

  const [mute, setMute] = useState(false);
  
  // gets all lines from the office.
  useEffect(() => {
    const getLines = () => {
      let arr = [];
      for (let i=0; i<data.length; i++) {
        arr.push(data[i].toString());
      }
      let fz = FuzzySet(arr);
      setLines(fz);
      console.log('done');
    }
    getLines();
  }, []);
  
  // find closest matching line to user text
  // respond to user w/ next line in the show. 
  const handleSubmit = (e) => {
    e.preventDefault();
    let scores = lines.get(userText);
    let best_score = scores[0][1];
    let index = data.indexOf(best_score);
    let response = data[index+1];
    setBotResponse(response);

    if (!mute) {
      let message = new SpeechSynthesisUtterance();
      message.text = response;
      window.speechSynthesis.speak(message);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h3>The Office Response Bot</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" name="userLine" onChange={(e) => setUserText(e.target.value)}/>
          <button type="submit">Submit</button>
          <span 
            onClick={() => setMute(!mute)}
            style={{width:'50px', height: '50px', backgroundColor: 'white'}}
          >
            {mute && 
              <img 
              src={off_mic}
              alt="toggle text to speech" 
              style={{width: '30px', height: '30px'}}/>
            }
            {!mute &&
              <img
              src={on_mic}
              alt="toggle text to speech" 
              style={{width: '30px', height: '30px'}}
              />
            }

          </span>
        </form>
        {botResponse}
      </header>
    </div>
  );
}

export default App;
