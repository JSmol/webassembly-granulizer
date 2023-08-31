import React, { Component } from 'react';
import init_oscilloscope from '../../oscilloscope';

// main wasm module
import { OscilloscopeRenderer } from '../../wasm';

type Props = {
  // audio context containing the source audio
  actx: AudioContext,
  // audio source to visualize
  source: AudioNode,
  // number of samples in one frame of the oscilloscope
  N?: number;
  // number of samples to skip when loading buffers (resolution of sample buffer)
  skip?: number;
}

export default class Oscilloscope extends Component<Props> {

  // buffer containing sample data
  buffer: SharedArrayBuffer | null;
  // audio worklet and wasm render function
  oscilloscope: any; // AudioWorkletNode;
  renderer: OscilloscopeRenderer;

  async componentDidMount(): Promise<void> {
    console.log("Oscilloscope component mount")
    
    let N = this.props.N ? this.props.N : 256;
    let skip = this.props.skip ? this.props.skip : 1;
    let n_channels = this.props.source.channelCount;

    // build oscilloscope worker and connect to audio source
    this.oscilloscope = await init_oscilloscope(
      this.props.actx,
      N,
      skip,
      n_channels
    );
    this.oscilloscope.port.onmessage = (e: MessageEvent<any>) => {
      this.buffer = e.data as SharedArrayBuffer; 
    };
    this.props.source.connect(this.oscilloscope as AudioWorkletNode);

    let c = document.getElementById('osc') as HTMLCanvasElement;
    let ctx = c.getContext("webgl2") as WebGL2RenderingContext;
    this.renderer = new OscilloscopeRenderer(ctx);

    let animate = () => {
      requestAnimationFrame(animate);
      if (this.buffer) {
        this.renderer.render(n_channels, N, this.buffer);
      }
    }
    animate();
  }

  render() : React.ReactNode {
    return (<>
      <canvas id="osc"
        width={800}
        height={200}
      />
    </>)
  }

}
