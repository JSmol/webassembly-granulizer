import React, { Component } from 'react';

type Props = {
  // audio context containing the source audio
  actx: AudioContext,
  // audio sample buffer
  sample: AudioBuffer,
  // audio worklet for the wasm_sampler
  wasm_sampler_worklet: AudioWorkletNode
}

export default class Waveform extends Component<Props> {

  cursor: number;

  setup() {
    let c = document.getElementById('waveform') as HTMLCanvasElement;
    let ctx = c.getContext("2d") as CanvasRenderingContext2D;

    // assuming all channels have the same number of samples...
    let N = this.props.sample.getChannelData(0).length;

    let MAX = 1500;
    let draw_wave = () => {
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'red';
      for (let ch = 0; ch < this.props.sample.numberOfChannels; ch++) {
        // move to left center
        ctx.moveTo(0, c.height/2)
        let samples = this.props.sample.getChannelData(ch);
        if (N != samples.length) throw("ERR: sample has different length channel data");
        let skip = Math.floor(N / MAX);
        for (let i = 0; i < N; i += skip) {
          ctx.lineTo(
            (i/N) * c.width,
            (samples[i]/2 + 1/2) * c.height
          );
        }
      }
      ctx.stroke();
    }

    let mouse_x = 0;
    c.addEventListener('mousemove', (e) => mouse_x = e.x)
    let draw_mouse_indicator = () => {
      ctx.beginPath();
      ctx.strokeStyle = `rgb(0, 255, 255)`;
      ctx.lineWidth = 2;
      ctx.moveTo(mouse_x, 0);
      ctx.lineTo(mouse_x, c.height);
      ctx.stroke();
    }

    this.cursor = 0;
    this.props.wasm_sampler_worklet.port.onmessage = (e: MessageEvent<any>) => {
      this.cursor = e.data; 
    };
    let draw_play_cursor = () => {
      ctx.beginPath();
      ctx.strokeStyle = `rgb(0, 255, 255)`;
      ctx.lineWidth = 2;
      ctx.moveTo((this.cursor / N) * c.width, 0);
      ctx.lineTo((this.cursor / N) * c.width, c.height);
      ctx.stroke();
    }

    /*  setup animation loop
     */
    let draw = () => {
      requestAnimationFrame(draw);
      draw_wave();
      draw_mouse_indicator();
      draw_play_cursor();
    }

    draw();
  }

  componentDidMount() {
    console.log("Waveform component mount")
    this.setup();
  }

  render() : React.ReactNode {
    return (<>
      <canvas id="waveform"
        width={800}
        height={200}
      />
    </>)
  }

}
