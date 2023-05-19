import './style.css'

if (!navigator.gpu) {
    throw new Error("WebGPU not supported");
}
