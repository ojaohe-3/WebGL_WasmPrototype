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
  const canvas = useRef<HTMLCanvasElement | null>(null);
  let dataArray: Uint8Array= new Uint8Array(2048);

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
    let d = new Uint8Array(analyzer!.get_bit_count());
    analyzer?.get_freq_bytes(d);
    console.log(d);
  }
  function handleChangeVolume(event: React.FormEvent<HTMLInputElement>) {
    const v: number = +event.currentTarget.value;
    setVomlume(v);
    analyzer?.set_gain(v);
    
  }
  function draw() {
    if (canvas.current) {
      requestAnimationFrame(draw);

      const canvasCtx = canvas.current!.getContext("2d")!;
      const _canvas = canvas.current!;
      const WIDTH = _canvas.width;
      const HEIGHT = _canvas.height
      analyzer?.get_freq_bytes(dataArray!);

      canvasCtx.fillStyle = 'rgb(0, 0, 0)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      var barWidth = (WIDTH / 2048) * 2.5;
      var barHeight;
      var x = 0;
      for(var i = 0; i < 2048; i++) {
        barHeight = dataArray[i]/2;

        canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
        canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);

        x += barWidth + 1;
      }


    }
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
        <canvas className="canvas" ref={canvas} />
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
        <button onClick={draw}>draw</button>
      </header>
    </div>
  );
}

export default App;
