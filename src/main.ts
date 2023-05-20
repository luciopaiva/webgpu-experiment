import './style.css'
import fetchTextFile from "./fetch-text-file.ts";
import {
    Camera,
    CreatePlane,
    Scene,
    UniversalCamera,
    Vector3,
    WebGPUEngine,
    RawTexture,
    BackgroundMaterial, ComputeShader, UniformBuffer
} from "@babylonjs/core";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const engine = new WebGPUEngine(canvas, {
    setMaximumLimits: true,
    enableAllFeatures: true,
});
await engine.initAsync();

if (!engine.getCaps().supportComputeShaders) {
    document.body.innerHTML = "WebGPU is not supported on this browser.";
    throw new Error("WebGPU not supported");
}

const scene = new Scene(engine);
const camera = new UniversalCamera("camera", new Vector3(0, 0, -10), scene);
const aspectRatio = canvas.width / canvas.height;
camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
camera.orthoBottom = -.5;
camera.orthoTop = .5;
camera.orthoLeft = -.5 * aspectRatio;
camera.orthoRight = .5 * aspectRatio;

const screenWidth = canvas.width;
const screenHeight = canvas.height;

const quad = CreatePlane("quad");
quad.scaling = new Vector3(aspectRatio, 1, 1);

const tex = RawTexture.CreateRGBAStorageTexture(null, screenWidth, screenHeight, scene, false, false, 1);

const quadMat = new BackgroundMaterial("quadMat", scene);
quadMat.diffuseTexture = tex;
quad.material = quadMat;

const shader = await fetchTextFile("./random.wgsl");


const computeShader = new ComputeShader("compute", engine, {
    computeSource: shader,
}, {
    bindingsMapping: {
        params: { group: 0, binding: 0 },
        tex: { group: 0, binding: 1 },
    },
});

const params = new UniformBuffer(engine);
params.addUniform("texWidth", 1);
params.addUniform("rngSeed", 1);
params.updateUInt("texWidth", screenWidth);
params.update();

computeShader.setUniformBuffer("params", params);
computeShader.setStorageTexture("tex", tex);

async function generateGPU() {
    const start = performance.now();
    params.updateUInt("rngSeed", Math.random() * 1_000_000_000);
    params.update();
    await computeShader.dispatchWhenReady(Math.ceil(screenWidth / 8), Math.ceil(screenHeight / 8), 1);
    scene.render();
    const duration = performance.now() - start;
    console.info(`${duration.toFixed(1)}ms`);
}

engine.runRenderLoop(() => {});

await generateGPU();

document.addEventListener("keydown", async (event: KeyboardEvent) => {
    if (event.key === "r") {
        await generateGPU();
    }
});
