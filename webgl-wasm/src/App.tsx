import React, { useEffect, useState } from 'react'
import init, {}
// import logo from './logo.svg'
import './App.css'
function App() {
  const [audio, setMute] = useState(true);
  const [volume, setVomlume] = useState(0.0);
  
  useEffect(() => {
    
  }, [])
  
  // this will talk to the wasm front controlling the audio context
  const handleMute = async () => {
    setMute(!audio);
    
  }
  const handleChangeVolume = () => {

    setVomlume(volume);
  } 
  return (
    <div className="App">
      <header className="App-header">
        <canvas className='canvas'/>
        <audio src="./audio.mp3" className='audio'/>

        <input  type="range" min="0" max="1" step="0.01" value={volume}  onChange={handleChangeVolume}/>
        <button onClick={handleMute}>
          mute
        </button>

      </header>
    </div>
  )
}

export default App
