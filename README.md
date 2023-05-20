
# WebGPU experiment

My first experiment with WebGPU.

I am doing my studies based on:

1. [Jason Tsorlinis' projects](https://github.com/jtsorlinis?tab=repositories), namely [BoidsWebGPU](https://github.com/jtsorlinis/BoidsWebGPU), [nBodyWebGPU](https://github.com/jtsorlinis/nBodyWebGPU) and [WebGPUvsCPU](https://github.com/jtsorlinis/WebGPUvsCPU)
2. I also followed the tutorial [here](https://surma.dev/things/webgpu/index.html) ([offline version](surma%20-%20all%20of%20the%20cores%20none%20of%20the%20canvas.pdf))
3. I am interested in reading the Babylon.js examples, specially [this one](https://webgpu.github.io/webgpu-samples/samples/gameOfLife)

I initially thought reference 1 was the best one to start with, and I think it still is, but the problem I saw was that Babylon.js is apparently not really helping a lot. There's still a lot of code to write to be able to get the compute shader running.

Reference 2 is interesting because it covers the raw use of the WebGPU API, but in the end it disappoints because it renders the data to a 2D canvas, which is very slow and becomes a bottleneck to the experiment. Strangely, though, the author says that even when they turn off the part that renders to the canvas, they still only get 14k entities per frame. Well, the article is from early 2022, so probably WebGPU was not that fast back then (let's have in mind that the first official release only came last month!).

Reference 3 may be interesting to understand how we can directly write to the screen using render shaders. So far the [only example]([WebGPUvsCPU](https://github.com/jtsorlinis/WebGPUvsCPU)) I saw computes the data using a compute shader, stores it into a texture buffer and then applies the texture to a quad, finally displaying it via an orthographic camera in Babylon.js. If you're just going to paint pixels on the screen like that example does, you could just use a fragment shader for that, I believe.

## Setup

    nvm i
    npm i
    npm run dev
