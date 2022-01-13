use wasm_bindgen::prelude::*;
use web_sys::*;



 
#[wasm_bindgen]
pub struct FmOsc {
    ctx: AudioContext,
    /// analyser
    analyser: AnalyserNode,
    source: AudioBufferSourceNode,
    /// Overall gain (volume) control
    gain: GainNode,

}

impl Drop for FmOsc {
    fn drop(&mut self) {
        let _ = self.ctx.close();

    }
}

#[wasm_bindgen]
impl FmOsc {
    
    #[wasm_bindgen(constructor)]
    pub fn new(buff: Vec<f32>) -> Result<FmOsc, JsValue> {
        const fftize: u32  = 2048;
        let ctx = web_sys::AudioContext::new()?;
        let source = {
            let mut s = ctx.create_buffer_source()?;
            let options = AudioBufferOptions::new(buff.len() as u32, ctx.sample_rate());
            let abuff = AudioBuffer::new(&options)?;
            abuff.copy_to_channel(&buff, 0)?;
            s.set_buffer(Some(&abuff));
            s.set_loop(true);
            s
        };
        // set the analyser
        let analyser = {
            let mut a = ctx.create_analyser()?;
            a.set_fft_size(fftize);
            a
        };
        // Create our web audio objects.
        let gain = ctx.create_gain()?;
        
        source.connect_with_audio_node(&analyser)?;
        gain.connect_with_audio_node(&ctx.destination())?;
        
        Ok(FmOsc {
            ctx,
            analyser,
            source,
            gain,
        })
    }

    /// Sets the gain, between 0.0 and 1.0.
    #[wasm_bindgen]
    pub fn set_gain(&self, mut gain: f32) {
        if gain > 1.0 {
            gain = 1.0;
        }
        if gain < 0.0 {
            gain = 0.0;
        }
        self.gain.gain().set_value(gain);
    }

    
}

