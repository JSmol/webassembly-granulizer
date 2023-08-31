// FIX: https://github.com/rustwasm/wasm-bindgen/issues/2367
import '../TextEncoder.js';

// TODO: wasm component
import { initSync, process } from "./wasm";

registerProcessor('Oscilloscope', class Oscilloscope extends AudioWorkletProcessor {

  constructor({
    numberOfInputs,
    numberOfOutputs,
    outputChannelCount,
    processorOptions: {
      buffer_size,
      buffer_skip,
      n_channels,
    }
  }) {

    console.log("CONSTRUCTING OSCILLOSCOPE WORKLET")
    super();

    if (numberOfInputs != 1 || numberOfOutputs != 1) {
      console.log(numberOfInputs, numberOfOutputs);
      throw new Error("incorrect arguments passed to Sampler worklet")
    }

    this.buffer = new SharedArrayBuffer(4*n_channels*buffer_size);
    this.buffer_size = buffer_size;
    this.buffer_skip = buffer_skip;
    this.n_channels = n_channels;

    this.port.postMessage(this.buffer);

    // TODO: maybe save compute by counting how many samples are processed and only posting msg sometimes...
    // samples processed since last message
    this.samples_processed = 0;
  }

  process(input, _output, _parameters) {
    let shared = new Float32Array(this.buffer);
    let new_buffer = new Float32Array(this.n_channels * this.buffer_size);
    for (let ch = 0; ch < this.n_channels; ch++) {
      let input_length = 128; // input[0][ch].length;
      let n_new_samples = input_length / this.buffer_skip;

      // shift the samples in the buffer
      for (let i = 0; i < this.buffer_size - n_new_samples; i++) {
        new_buffer[
          ch*this.buffer_size +
          i
        ] = shared[
          ch*this.buffer_size +
          i + n_new_samples
        ];
      }

      // add the new samples
      for (let i = 0; i < n_new_samples; i++) {
        new_buffer[
          ch*this.buffer_size + 
          this.buffer_size - n_new_samples + i
        ] = input[0][ch][this.buffer_skip * i];
      }

      this.samples_processed += input_length;
    }

    shared.set(new_buffer);
    return true;
  }

})
