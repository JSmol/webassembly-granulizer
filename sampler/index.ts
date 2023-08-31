export default async function init_sampler(ctx: AudioContext, sample: AudioBuffer) : Promise<AudioWorkletNode> {
  // WARN: hard coded paths for worklets and wasm after webpack (I don't know any better way to do this)
  await ctx.audioWorklet.addModule('./public/worklets/sampler.js');
  let response = await fetch('./public/wasm/sampler.wasm');
  let wasm: ArrayBuffer = await response.arrayBuffer();
  let sample_rate = sample.sampleRate;
  let n_channels = sample.numberOfChannels;
  let n_samples = sample.length;
  let samples = Array.from({ length: n_channels }, (_, i) => sample.getChannelData(i));
  return new AudioWorkletNode(ctx, 'Sampler', {
    numberOfInputs: 0,
    numberOfOutputs: 1,
    outputChannelCount: [n_channels],
    parameterData: {
      // TODO: parameters
    },
    processorOptions: {
      sample_rate: sample_rate,
      n_channels: n_channels,
      n_samples: n_samples,
      samples: samples,
      wasm: wasm
    }
  });
}
