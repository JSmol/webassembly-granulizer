use wasm_bindgen::prelude::*;
use js_sys::{self, SharedArrayBuffer};

use limelight::{
    Renderer, renderer::Drawable,
};
use limelight_primitives::{
    Line,
    LineLayer
};
use palette;

#[wasm_bindgen]
pub struct OscilloscopeRenderer {
    renderer: Renderer,
    lines: LineLayer
}

#[wasm_bindgen]
impl OscilloscopeRenderer {

    #[wasm_bindgen(constructor)]
    pub fn new(gl: web_sys::WebGl2RenderingContext) -> Self {
        let renderer = Renderer::new(gl);
        OscilloscopeRenderer {
            renderer,
            lines: LineLayer::new()
        }
    }

    #[wasm_bindgen]
    pub fn render(
        &mut self,
        n_channels: usize,
        buffer_size: usize,
        samples: SharedArrayBuffer
    ) {
        let samples = js_sys::Float32Array::new(&samples).to_vec();
        let x: Vec<Vec<Line>> = (0..n_channels).map(|ch| {
            return (0..buffer_size-1).map(|i| Line {
                start: [
                    2.0 * (i as f32) / (buffer_size as f32) - 1.0,
                    samples[ch*buffer_size + i]
                ],
                end: [
                    2.0 * (i as f32 + 1.0) / (buffer_size as f32) - 1.0,
                    samples[ch*buffer_size + i+1]
                ],
                width: 0.002,
                color: palette::named::RED.into()
            }).collect();
        }).collect();
        self.lines.buffer().set_data(x.concat());
        self.lines.draw(&mut self.renderer)
            .expect("error rendering lines to osc canvas");
    }

}

