use wasm_bindgen::prelude::*;

mod utils;

pub mod anim;
pub mod oscilloscope;

#[wasm_bindgen(start)]
fn run() -> Result<(), JsValue> {
    use std::panic; // setup panic in web console
    panic::set_hook(Box::new(console_error_panic_hook::hook));
    Ok(())
}

