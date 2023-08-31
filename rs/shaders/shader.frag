#version 300 es
 
precision highp float;
const float PI = 3.141592653589793238;

in vec3 v_position;

out vec4 color;

uniform vec2 u_mouse;
uniform vec3 u_color;
uniform float u_time;

void main() {
  // color = vec4(u_color, sin(u_time / 10000.0));
  // color = vec4((v_position.x + 1.0) / 2.0, (v_position.y + 1.0) / 2.0, (v_position.z + 1.0) / 2.0, 1.0);
  color = vec4(v_position, 1.0);
  // color = vec4(0.0, 1.0, 0.0, 1.0);
}
