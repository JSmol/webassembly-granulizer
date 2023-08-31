#version 300 es

const float PI = 3.141592653589793238;

in vec2 position;
out vec3 v_position;
 
void main() {
  if (gl_VertexID == 0) { v_position = vec3(1.0, 0.0, 0.0); }
  if (gl_VertexID == 1) { v_position = vec3(0.0, 1.0, 0.0); }
  if (gl_VertexID == 2) { v_position = vec3(0.0, 0.0, 1.0); }
  gl_Position = vec4(position, 0., 1.);
}
