import React, { Component } from 'react';

type Props = {
  ctx: AudioContext,
  wasm_sampler_worklet: AudioWorkletNode,
  param_name: string,
}

export default class Slider extends Component<Props> {
  render() : React.ReactNode {
    let param: AudioParam = this.props.wasm_sampler_worklet.parameters.get(this.props.param_name)!;
    return (<div>
      <span className='knob-label'>{this.props.param_name}: </span>
      <input type="range"
        className='knob'
        name={this.props.param_name}
        defaultValue={param.value}
        min={param.minValue}
        max={param.maxValue}
        step="0.01"
        onChange={(e: any) => param.setValueAtTime(e.target.value, this.props.ctx.currentTime)}
      />
    </div>)
  }
}
