import React, { Component, ReactNode } from 'react';

// main wasm module
import { start_animation } from '../wasm';

import init_sampler from '../sampler';

import GUI from './gui';

type AppProps = {
  ctx: AudioContext
}

type AppState = {
  wasm_sampler_worklet: AudioWorkletNode | null
  sample: AudioBuffer | null
}

export default class App extends Component<AppProps, AppState> {

  state = {
    wasm_sampler_worklet: null,
    sample: null
  }

  componentDidMount(): void {
    let c = document.getElementById('meme') as HTMLCanvasElement;
    let ctx: WebGL2RenderingContext = c.getContext("webgl2")!;
    console.log(ctx);
    start_animation(ctx);
  }

  /*  WASM SAMPLER
   */
  async setup_sampler(sample: AudioBuffer) {
    console.log("SETUP START")

    let sampler: AudioWorkletNode = await init_sampler(this.props.ctx, sample)
    console.log("SAMPLER MADE:", sampler);

    // update state
    this.setState(() => {
      return {
        wasm_sampler_worklet: sampler,
        sample: sample
      }
    });

    sampler.connect(this.props.ctx.destination);
  }

  /*  READ FILE
   */
  read_file(file: File) {
    file.arrayBuffer().then((buffer: ArrayBuffer) => {
      this.props.ctx.decodeAudioData(buffer).then((sample: AudioBuffer) => {
        this.setup_sampler(sample);
      }).catch((err) => {
        console.log("error decoding file", err);;
      });
    }).catch((err) => {
      console.log("error reading file", err);
    });
  }

  render(): ReactNode {
    return (<>
      <h1>⚙️ RUST/Webassembly Sample Granulizer 🍚</h1>
      <h2>Upload an audio file! ⬆️ 🎵</h2>
      <input type="file"
        accept="audio/*" 
        onChange={(e: any) => {
          let files = e.target.files;
          if (files.length >= 1) {
            this.read_file(files[0]);
          } else {
            console.log("no files uploaded");
          }
        }}
      />
      <br/> <br/>

      <div>
      { 
        (this.state.wasm_sampler_worklet && this.state.sample) &&
        <GUI 
          ctx={this.props.ctx}
          sample={this.state.sample}
          wasm_sampler_worklet={this.state.wasm_sampler_worklet} 
        /> 
      }
      </div>

      <h2>Animation using webgl!</h2>
      <canvas id="meme"
        width={600}
        height={600}
      />

    </>); 
  } 

} 
