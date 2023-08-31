use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen(start)]
fn run() -> Result<(), JsValue> {
    log("RUST: sampler wasm module started");

    // setup panic in web console
    use std::panic;
    panic::set_hook(Box::new(console_error_panic_hook::hook));

    Ok(())
}

#[wasm_bindgen]
pub struct WasmSampler {
    /*  @n_channels: number of channels of the audio sample
     *  @n_sampler: number of samples per channel of given audio sample
     *  @samples: buffer of individual samples:
     *      first `n_samples` entry corresponds to first channel
     *      second `n_samples` entry corresponds to second channel
     *      etc.
     *  @cursor: play head of current sample
     */
    n_channels: usize,
    n_samples: usize,
    samples: Box<[f32]>,
    pub cursor: usize,
    grain_start: Vec<usize>,
    grain_idx: Vec<usize>
}

#[wasm_bindgen]
impl WasmSampler {

    #[wasm_bindgen(constructor)]
    pub fn new(
        n_channels: usize,
        n_samples: usize,
        samples: Box<[f32]>
    ) -> WasmSampler {
        log("RUST: creating sampler");
        WasmSampler { 
            n_channels,
            n_samples,
            samples,
            cursor: 0,
            grain_idx: vec![0; n_channels],
            grain_start: vec![0; n_channels]
        }
    }

    #[wasm_bindgen]
    pub fn process(
        &mut self,
        ch: usize,
        output: &mut [f32],
        gain: f32,
        grain_size: f32,
        grain_spacing: f32,
        attack: f32,
        decay: f32,
    ) {
        for i in 0..output.len() {
            output[i] = self.samples[
                ch*self.n_samples + // chunk
                ((self.grain_start[ch] + self.grain_idx[ch]) % self.n_samples) // sample idx
            ];
            output[i] *= gain;
            output[i] *= ((1.0 + self.grain_idx[ch] as f32) / attack).clamp(0.0, 1.0);
            output[i] *= (1.0 - (self.grain_idx[ch] as f32 / decay)).clamp(0.0, 1.0);
            
            self.grain_idx[ch] += 1;
            if self.grain_idx[ch] > grain_size as usize {
                self.grain_start[ch] += grain_spacing as usize;
                self.grain_start[ch] %= self.n_samples;
                self.grain_idx[ch] = 0;
            }
        }
    }

    #[wasm_bindgen]
    pub fn prepare_for_next_buffer(
        &mut self,
        buffer_size: usize
    ) {
        self.cursor = (self.cursor + buffer_size) % self.n_samples;
    }

}

