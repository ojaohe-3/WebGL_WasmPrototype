import React, { useEffect, useState } from 'react'
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
  return (
    <div className="App">
      <header className="App-header">
        <canvas className='canvas'/>
        <audio src="./audio.mp3" className='audio'/>

        <button onClick={handleMute}>
          mute
        </button>

      </header>
    </div>
  )
}

export default App
