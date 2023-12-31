// FIX: https://github.com/rustwasm/wasm-bindgen/issues/2367
import '../TextEncoder.js';

// this is js so webpack will pack it up
// the file is generated by rust wasm build
import { initSync, WasmSampler } from "./wasm";

registerProcessor('Sampler', class Sampler extends AudioWorkletProcessor {

  constructor({
    numberOfInputs,
    numberOfOutputs,
    // parameterData,
    processorOptions: {
      // sample_rate, not sure if needed
      n_channels,
      n_samples,
      samples,
      wasm
    }
  }) {

    console.log("CONSTRUCTING WORKLET");
    super();

    if (numberOfInputs != 0 || numberOfOutputs != 1)
      throw new Error("incorrect arguments passed to Sampler worklet")

    // put the samples into one big Float32Array
    let flat_samples = new Float32Array(n_samples * n_channels);
    for (let ch = 0; ch < n_channels; ch++) {
      for (let i = 0; i < n_samples; i++) {
        flat_samples[ch*n_samples + i] = samples[ch][i];
      }
    }

    // setup wasm and construct the sampler
    this.wasm = new WebAssembly.Module(wasm);
    initSync(this.wasm)

    this.wasm_sampler = new WasmSampler(
      n_channels,
      n_samples,
      flat_samples
    );

    this.samples_processed = 0;
  }

  static get parameterDescriptors() {
    return [
      {
        name: 'gain',
        defaultValue: 1,
        minValue: 0,
        maxValue: 1,
        automationRate: "k-rate",
      },
      {
        name: 'grain_size',
        defaultValue: 128,
        minValue: 128,
        maxValue: 16384,
        automationRate: "k-rate",
      },
      {
        name: 'grain_spacing',
        defaultValue: 128,
        minValue: 128,
        maxValue: 16384,
        automationRate: "k-rate",
      },
      {
        name: 'attack',
        defaultValue: 1,
        minValue: 1,
        maxValue: 16384,
        automationRate: "k-rate",
      },
      {
        name: 'decay',
        defaultValue: 16384,
        minValue: 1,
        maxValue: 16384,
        automationRate: "k-rate",
      },
    ]
  }

  process(_input, output, parameters) {
    for (let ch = 0; ch < output[0].length; ch++) {
      this.wasm_sampler.process(
        ch,
        output[0][ch],
        parameters['gain'][0],
        parameters['grain_size'][0],
        parameters['grain_spacing'][0],
        parameters['attack'][0],
        parameters['decay'][0]
      );
    }
 
    // moves the internal cursor
    this.wasm_sampler.prepare_for_next_buffer(output[0][0].length);

    // if (this.samples_processed > 1000) {
    //   this.port.postMessage({
    //     cursor: this.wasm_sampler.cursor
    //   });
    // }
    
    // console.log(output);
    // console.log(parameters);
    return true;
  }

})
