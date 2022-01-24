import React, { useCallback, useEffect, useRef, useState } from "react";
// import FaVolumeUp from 'react-icons'
// import FaVolumeMute from 'react-icons'
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
// import logo from './logo.svg'
import "./App.css";
import init, { FmAn } from "../wasm-audio/pkg";

function App() {
  const [mute, setMute] = useState(true);
  const [volume, setVomlume] = useState(0.0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [analyzer, setAnalyzer] = useState<FmAn | null>(null);
  const [moduleLoaded, setModule] = useState<boolean>(false);
  const onAudioLoaded = useCallback(
    (node) => {
      setAudio(node);
      if (moduleLoaded) {
        const a = new FmAn(audio!);
        a.set_gain(volume);
        setAnalyzer(a);
      }
    },
    [moduleLoaded]
  );

  useEffect(() => {
    const loadModule = async () => {
      await init();
      setModule(true);
    };
    loadModule();
  }, []);

  // this will talk to the wasm front controlling the audio context
  function handleMute() {
    setMute(!mute);
    audio!.muted = mute;
  }
  function handleChangeVolume(event: React.FormEvent<HTMLInputElement>) {
    const v: number = +event.currentTarget.value;
    setVomlume(v);
    analyzer?.set_gain(v);
  }

  // function handleData (e: any) {
  //   console.log(e)
  // }
  return (
    <div className="App">
      <header className="App-header">
        <audio
          src="./audio.mp3"
          className="audio"
          ref={onAudioLoaded}
          loop
          autoPlay
          controls
        />
        <div className="canvas-container">
          <canvas className="canvas" />
        </div>
        <div className="mute_icon">
          {mute ? <FaVolumeUp /> : <FaVolumeMute />}
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
