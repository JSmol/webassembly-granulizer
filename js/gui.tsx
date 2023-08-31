import React, { Component } from 'react';

import Slider from './components/slider';

import Oscilloscope from './components/oscilloscope';

type GUIProps = {
  ctx: AudioContext,
  sample: AudioBuffer,
  wasm_sampler_worklet: AudioWorkletNode,
}

export default class GUI extends Component<GUIProps> {

  toggle_context(btn: HTMLInputElement) {
    if (this.props.ctx.state === "running") {
      this.props.ctx.suspend().then(() => {
        btn.value = "Play"
      });
    } else
    if (this.props.ctx.state === "suspended") {
      this.props.ctx.resume().then(() => {
        btn.value = "Pause"
      });
    }
  }

  update_gain(value: number) {
    let param: AudioParam = this.props.wasm_sampler_worklet.parameters.get('gain')!;
    param.setValueAtTime(value, this.props.ctx.currentTime);
  }

  async componentDidMount(): Promise<void> {
    console.log("GUI component mount")
  }

  render() : React.ReactNode {
    return (<>

      <input type="button" 
        value="Play"
        onClick={(e: any) => this.toggle_context(e.target)}
      />
      <br/>

      <Slider ctx={this.props.ctx} 
        wasm_sampler_worklet={this.props.wasm_sampler_worklet}
        param_name='gain'
      />
      <Slider ctx={this.props.ctx} 
        wasm_sampler_worklet={this.props.wasm_sampler_worklet}
        param_name='grain_size'
      />
      <Slider ctx={this.props.ctx} 
        wasm_sampler_worklet={this.props.wasm_sampler_worklet}
        param_name='grain_spacing'
      />
      <Slider ctx={this.props.ctx} 
        wasm_sampler_worklet={this.props.wasm_sampler_worklet}
        param_name='attack'
      />
      <Slider ctx={this.props.ctx} 
        wasm_sampler_worklet={this.props.wasm_sampler_worklet}
        param_name='decay'
      />

      <Oscilloscope
        actx={this.props.ctx}
        source={this.props.wasm_sampler_worklet}
        N={256}
        skip={1}
      />
      <br/>

    </>)
  }

}
