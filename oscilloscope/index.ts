export default async function init_oscilloscope(
  ctx: AudioContext,
  buffer_size: number,
  buffer_skip: number,
  n_channels: number
) : Promise<AudioWorkletNode> {

  // WARN: hard coded paths for worklets and wasm after webpack (I don't know any better way to do this)
  await ctx.audioWorklet.addModule('./public/worklets/oscilloscope.js');

  // let response = await fetch('./public/wasm/sampler.wasm');
  return new AudioWorkletNode(ctx, 'Oscilloscope', {
    numberOfInputs: 1,
    numberOfOutputs: 1,
    outputChannelCount: [2], // FIX: DONT HARD CODE THIS
    parameterData: {
      // TODO: parameters
    },
    processorOptions: {
      buffer_size,
      buffer_skip,
      n_channels,
    }
  });

}
