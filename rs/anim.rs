use wasm_bindgen::prelude::*;
use limelight::{
    Buffer,
    BufferUsageHint,
    DrawMode,
    Program,
    Renderer,
    Uniform,
    attribute
};

use std::rc::Rc;
use std::cell::RefCell;

use crate::utils::{
    log,
    request_animation_frame
};

#[attribute]
struct VertexDescription {
    position: [f32; 2],
}

impl VertexDescription {
    pub fn new(x: f32, y: f32) -> Self {
        VertexDescription { position: [x, y] }
    }
}

struct Animation {
    program: Program<VertexDescription, ()>,
    buffer: Buffer<VertexDescription>,
    u_color: Uniform<[f32; 3]>,
    u_time: Uniform<f32>,
}

impl Animation {
    pub fn new(gl: &web_sys::WebGl2RenderingContext) -> Self {

        // vertex buffer
        let buffer = Buffer::new(vec![], BufferUsageHint::DynamicDraw);

        // uniforms
        let u_color = Uniform::new([0., 0., 0.]);
        // let u_reso = Uniform::new([0., 0.]);
        let u_time = Uniform::new(0.);

        // Note that we clone uniform, so that we can retain a handle to it.
        // Cloning a `Uniform` results in a reference-counted pointer to the same uniform.
        let program = Program::new(
            include_str!("shaders/shader.vert"),
            include_str!("shaders/shader.frag"),
            DrawMode::Triangles,
        );
        // let program = program.with_uniform("u_color", u_color.clone());
        // let program = program.with_uniform("u_time", u_time.clone());
        
        Animation {
            buffer,
            program,
            u_color,
            u_time
        }
    }

    pub fn render(&mut self, time: f64, renderer: &mut Renderer) {
        let theta1 = time as f32 / 800.;
        let theta2 = theta1 + (std::f32::consts::TAU / 3.);
        let theta3 = theta2 + (std::f32::consts::TAU / 3.);
        
        // vertex positions
        self.buffer.set_data(vec![
            VertexDescription::new(theta1.cos(), theta1.sin()),
            VertexDescription::new(theta2.cos(), theta2.sin()),
            VertexDescription::new(theta3.cos(), theta3.sin()),
        ]);

        // uniform color
        let r = (time as f32 / 300.).sin() / 2. + 0.5;
        let g = (time as f32 / 500.).sin() / 2. + 0.5;
        let b = (time as f32 / 700.).sin() / 2. + 0.5;
        self.u_color.set_value([r, g, b]);
        self.u_time.set_value(time as f32);

        renderer.render(&mut self.program, &self.buffer).unwrap();
    }
}

#[wasm_bindgen]
pub fn start_animation(ctx: web_sys::WebGl2RenderingContext) {
    log("RUST: test function ran");
    let mut anim = Animation::new(&ctx);
    let mut renderer = Renderer::new(ctx);

    let f = Rc::new(RefCell::new(None));
    let g = f.clone();

    *g.borrow_mut() = Some(Closure::new(move |t| {
        anim.render(t, &mut renderer);
        request_animation_frame(f.borrow().as_ref().unwrap());
    }));

    request_animation_frame(g.borrow().as_ref().unwrap());
}

