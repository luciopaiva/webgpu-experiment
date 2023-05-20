
struct Params {
  texWidth: u32,
  rngSeed: u32,
}

@group(0) @binding(0) var<uniform> params : Params;
@group(0) @binding(1) var tex : texture_storage_2d<rgba8unorm, write>;

var<private> rngState : u32;

fn rand_pcg() -> f32 {
    rngState = rngState * 747796405u + 2891336453u;
    var state = rngState;
    var word: u32 = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
    return f32((word >> 22u) ^ word) / f32(0xFFFFFFFFu);
}

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) id : vec3<u32>) {
    rngState = params.rngSeed + id.y * params.texWidth + id.x;
    textureStore(tex, id.xy, vec4<f32>(rand_pcg(),rand_pcg(),rand_pcg(),0));
}
