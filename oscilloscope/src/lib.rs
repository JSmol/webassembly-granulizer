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

// #[wasm_bindgen]
// pub fn process(input: &[f32], buffer: &mut [f32]) {
//        
// }

