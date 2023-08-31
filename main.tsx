import React from 'react';
import * as ReactDOM from 'react-dom/client';

let ctx = new AudioContext();
ctx.suspend();

// build app and link up wasm to the react GUI
import App from './js/app';
const root_element = document.getElementById("root")!;
const root = ReactDOM.createRoot(root_element);
root.render(<App ctx={ctx} />);

