import React, { useEffect, useRef, useState } from "react";
// import FaVolumeUp from 'react-icons';
// import FaVolumeMute from 'react-icons';
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import init, { FmAn } from "../wasm-audio/pkg";
// import logo from './logo.svg'
import "./App.css";
function App() {
  const [audio, setMute] = useState(true)
  const [volume, setVomlume] = useState(0.0)
  const audioRef = useRef(null)
  let a_ctx : FmAn;
  useEffect(() => {
    const data = audioRef.current as unknown as  HTMLAudioElement
    console.log(data)
    a_ctx = new FmAn()
  }, []);

  // this will talk to the wasm front controlling the audio context
  function handleMute() {
    setMute(!audio);
  }
  function handleChangeVolume(event: React.FormEvent<HTMLInputElement>) {
    setVomlume(+event.currentTarget.value)

  }
  return (
    <div className="App">
      <header className="App-header">
        <audio src="./audio.mp3" className="audio" ref={audioRef}/>
        <div className="canvas-container">
          <canvas className="canvas" />
        </div>
        <div className="mute_icon">
          {audio ? <FaVolumeUp /> : <FaVolumeMute />}
        </div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleChangeVolume}
        />
        <button onClick={handleMute}>mute</button>
      </header>
    </div>
  );
}

export default App;
