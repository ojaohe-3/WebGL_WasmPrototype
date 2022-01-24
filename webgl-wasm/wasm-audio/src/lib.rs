use wasm_bindgen::prelude::*;
use web_sys::*;

 
#[wasm_bindgen]
pub struct FmAn {
    ctx: AudioContext,
    /// analyser
    analyser: AnalyserNode,
    source: MediaElementAudioSourceNode,
    /// Overall gain (volume) control
    gain: GainNode,

}

impl Drop for FmAn {
    fn drop(&mut self) {
        let _ = self.ctx.close();

    }
}

#[wasm_bindgen]
impl FmAn {
    
    #[wasm_bindgen(constructor)]
    pub fn new(media: &HtmlMediaElement) -> Result<FmAn, JsValue> {
        const FFTSIZE: u32  = 2048;
        let ctx = web_sys::AudioContext::new()?;
        let source =  ctx.create_media_element_source(media)?;

        // set the analyser
        let analyser = {
            let mut a = ctx.create_analyser()?;
            a.set_fft_size(FFTSIZE);
            a
        };
        // Create our web audio objects.
        let gain = ctx.create_gain()?;
        gain.gain().set_value(0.0);

        source.connect_with_audio_node(&gain)?;
        analyser.connect_with_audio_node(&gain)?;
        gain.connect_with_audio_node(&ctx.destination())?;

        Ok(FmAn {
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

    #[wasm_bindgen]
    pub fn get_freq_bytes(&self, data: &mut [u8] ){
        self.analyser.get_byte_frequency_data(data);
    }

    #[wasm_bindgen]
    pub fn get_freq_data(&self,  data: &mut [f32]){
        self.analyser.get_float_frequency_data(data);
    }


    #[wasm_bindgen]
    pub fn get_bit_count(&self) -> u32{
        self.analyser.frequency_bin_count()
    }

    
}

