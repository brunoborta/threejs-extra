import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "stats.js";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";

// https://discoverthreejs.com/tips-and-tricks/ might help

/**
 * Stats
 */
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const displacementTexture = textureLoader.load("/textures/displacementMap.png");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(2, 2, 6);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  powerPreference: "high-performance",
  antialias: true,
});
renderer.useLegacyLights = false;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

/**
 * Test meshes
 */
// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(2, 2, 2),
//   new THREE.MeshStandardMaterial()
// );
// cube.castShadow = true;
// cube.receiveShadow = true;
// cube.position.set(-5, 0, 0);
// scene.add(cube);

// const torusKnot = new THREE.Mesh(
//   new THREE.TorusKnotGeometry(1, 0.4, 128, 32),
//   new THREE.MeshStandardMaterial()
// );
// torusKnot.castShadow = true;
// torusKnot.receiveShadow = true;
// scene.add(torusKnot);

// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(1, 32, 32),
//   new THREE.MeshStandardMaterial()
// );
// sphere.position.set(5, 0, 0);
// sphere.castShadow = true;
// sphere.receiveShadow = true;
// scene.add(sphere);

// const floor = new THREE.Mesh(
//   new THREE.PlaneGeometry(10, 10),
//   new THREE.MeshStandardMaterial()
// );
// floor.position.set(0, -2, 0);
// floor.rotation.x = -Math.PI * 0.5;
// floor.castShadow = true;
// floor.receiveShadow = true;
// scene.add(floor);

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, 2.25);
scene.add(directionalLight);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  stats.begin();

  const elapsedTime = clock.getElapsedTime();

  // Update test mesh
  //   torusKnot.rotation.y = elapsedTime * 0.1;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);

  stats.end();
};

tick();

/**
 * Tips
 */

/**
 * General
 */

// Tip 1
// Use Stats to see the FPS

// Tip 2
// Disable the chrome limit of fps
// This gist on terminal:
// open -a "Google Chrome" --args --disable-gpu-vsync --disable-frame-rate-limit
// If your thing is close to 60fps, you have a problem. It should be
//way more than this

// Tip 3
// Spector.js Chrome extension
// This can give good infos about the scene and how it has been
//rendered

// Tip 4
// The renderer.info has some useful infos
// console.log(renderer.info);

// Tip 5
// The tick function is precious. Be careful on what you have inside
// If the JS is not optimized, probably you'll have a huge drop
//on FPS on your website

// Tip 6
// Dispose stuff you are not using anymore
// scene.remove(cube)
// cube.geometry.dispose()
// cube.material.dispose()

/**
 * Lights and Shadows
 */

// Tip 7
// Avoid using lights. Use baked lights or use cheap lights
//as Ambient Lights, Directional Lights or Hemisphere Lights

// Tip 8
// If you have to use lights, avoid adding new lights
//or removing lights in a scene (Their materials have to
//be recompiled everytime).
// Moving them is better for performances

// Tip 9
// Avoid using shadows. Baked shadows are way better

// Tip 10
// If you have to use shadows, optimize shadow maps.
// Add a camera helper for every light you have (after the optimization)

// Be sure you can have all the shadows inside your scene and
//not way more than the necessary
directionalLight.shadow.camera.top = 3;
directionalLight.shadow.camera.right = 6;
directionalLight.shadow.camera.left = -6;
directionalLight.shadow.camera.bottom = -3;
directionalLight.shadow.camera.far = 10;

// Try to have the mapSize only with the necessary
directionalLight.shadow.mapSize.set(1024, 1024);

// const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(cameraHelper);

// Tip 11
// Use castShadow and receiveShadow wisely.
// Not every object need to receive or cast shadows
// Remember: Cast is if the object can cast shadow on other objects
// Receive is if that object can have shadows casted by other objects

// cube.castShadow = true;
// cube.receiveShadow = false;

// torusKnot.castShadow = true;
// torusKnot.receiveShadow = false;

// sphere.castShadow = true;
// sphere.receiveShadow = false;

// floor.castShadow = false;
// floor.receiveShadow = true;

// Tip 12
// Disable shadowMap autoUpdate, if possible
// Let's say you have a scene that doesn't change that much
// Like a city with the sun as the light
// You don't need to update the shadows on every frame

// In this scene, of course, this will freeze the shadow of
//the Torus knot
renderer.shadowMap.autoUpdate = false;
renderer.shadowMap.needsUpdate = true;

/**
 * Textures
 */

// Tip 13
// Resize textures
// Textures can use a lot of GPU memory with the mipmaping
// Try to reduce the resolution to a minimum

// Tip 14
// Always keep a power of 2 resolutions
// Mipmaping uses power of 2 to cover the geometries. Keep
//that in mind and always use power of 2 resolutions.
// If this is not done, three.js will try to fix it, resizing
//to the closest power of 2 resolution.
// You don't need to have a square like 1024x1024. But both
//the width and height should be a power of 2. 2x512 is usable

// Tip 15
// Use the right format (.jpg, .png)
// If you need to use alpha, you can use a .png, or you can use
// a .jpg as a alpha map. See what's better

// Use a software like Optimage or TinyPNG
// A smaller sized image is way better than a bigger sized one ;D

// Another alternative is using basis format
// It's hard to generate and it's very lossy, but if the result
//is good, it has a small size and GPU can read it easily

/**
 * Geometry
 */

// Tip 16 (forget it)
// Always use BufferGeometries
// But this is the default one.

// Tip 17
// Avoid updating vertices
// Update vertices of a geometry is terrible for performances.
// Avoid doing this in the tick function.
// If animation with vertices is necessary, use the vertex shader.

// Tip 18
// Mutualize geometries, if possible
// Let's say you have a for like this. The geometry
//should be outside of it

// const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
// for (let i = 0; i < 50; i++) {
//     const material = new THREE.MeshNormalMaterial();
//   const mesh = new THREE.Mesh(geometry, material);
//   mesh.position.x = (Math.random() - 0.5) * 10;
//   mesh.position.y = (Math.random() - 0.5) * 10;
//   mesh.position.z = (Math.random() - 0.5) * 10;
//   mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2;
//   mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2;

//   scene.add(mesh);
// }

// Tip 19
// Merge geometries
// If you run a for that creates meshes and add the scene,
//you will create a draw call for each box, which is bad.
// It would be better if you draw them together with just 1
//call
// We can use the BufferGeometryUtils of three.js for that

// ACHTUNG - If you merge geometries together, you cannot move
//each geometry individually

// In this example, we can create an array outside the for
// const geometries = [];

// for (let i = 0; i < 50; i++) {

// So we now are creating 50 geometries that have different positions
//   const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

//   geometry.translate(
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10
//   );
//   geometry.rotateX((Math.random() - 0.5) * Math.PI * 2);
//   geometry.rotateY((Math.random() - 0.5) * Math.PI * 2);

// Instead of adding to the scene, we are adding to the array
//   geometries.push(geometry);
// }

// Merging all the array on one material
// const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
// const material = new THREE.MeshNormalMaterial();
// const mesh = new THREE.Mesh(mergedGeometry, material);

// Only one Draw call!
// scene.add(mesh);

/**
 * Materials
 */

// Tip 20
// Mutualize materials
// Exactly like geometries, we need to mutualize materials

// const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
// const material = new THREE.MeshNormalMaterial()

// for(let i = 0; i < 50; i++) {
//     const mesh = new THREE.Mesh(geometry, material)
//     mesh.position.x = (Math.random() - 0.5) * 10
//     mesh.position.y = (Math.random() - 0.5) * 10
//     mesh.position.z = (Math.random() - 0.5) * 10
//     mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2
//     mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2

//     scene.add(mesh)
// }

// Tip 21
// Use cheap materials
// Some materials like MeshStandardMaterial or MeshPhysicalMaterial
//are great, but they are heavy. If possible, try to use
//MeshBasicMaterial, MeshLambertMaterial or MeshPhongMaterial

/**
 * Meshes
 */

// Tip 22
// InstancedMesh give you more control than MergeGeometries

// Merge Geometries is great if you don't need to move them. If
//so, you can use InstancedMeshes, which creates a matrix for each
//instance of that mesh. This allows the meshes to be moved
//individually. Of course, we are using this if you have the
//same geometry and material for all meshes

// const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
// const material = new THREE.MeshNormalMaterial();

// Passing the geometry, the material and how many meshes you want
//to create
// const mesh = new THREE.InstancedMesh(geometry, material, 50);

// If you want to change the matrices in the tick function,
//add the dynamic draw usage to the matrix
// mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

// scene.add(mesh);

// for (let i = 0; i < 50; i++) {
//   // Rotation
//   const quaternion = new THREE.Quaternion();
//   quaternion.setFromEuler(
//     new THREE.Euler(
//       (Math.random() - 0.5) * Math.PI * 2,
//       (Math.random() - 0.5) * Math.PI * 2,
//       0
//     )
//   );
//   // Position
//   const position = new THREE.Vector3(
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10
//   );

//   // Create the matrix that will allow the changes
//   const matrix = new THREE.Matrix4();
//   matrix.makeRotationFromQuaternion(quaternion);
//   matrix.setPosition(position);
//   mesh.setMatrixAt(i, matrix);
// }

/**
 * Models
 */

// Tip 23
// Low Poly
// It's good to use Low Poly models. If you need details, you can
//use normal maps

// Tip 24
// Draco Compression
// If your model has a lot of details with very complex geometries,
//use Draco Compression
// Remember that the uncompression of the geometry and load the libs
//can be expensive, but it's better than load a huge file without
//compression

// Tip 25
// GZIP
// The gzip server compression for .glb, .gltf or .obj. This can
//help a lot on performances. The lower the size, the better for
//loading <3
// Check the "content-encoding: gzip" on the Headers of the file

/**
 * Camera
 */

// Tip 26
// Field of View
// Reducing the FOV makes the renderer render less objects. Sounds
//like a stupid solution, but a lot of games do that. It works lol

// Tip 27
// Near and Far
// Adjust the near and far values of the camera so you don't have to
//render unecessary objects
// If you are in a big city and you have mountains very far away,
//maybe changing the far attribute would work. You don't have to
//render mountains when you are surronded by buildings ;D

/**
 * Renderer
 */

// Tip 28
// Blank lol

// Tip 29
// ALWAYS adjust the pixelRatio of the renderer to be at maximum of
//2. More than that, is completely useless
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Tip 30
// Power preferences
// Some devices may be able to switch between different GPUs.
// By adding a powerPreference to 'high-performance', you can
//make it use the best GPU available
// renderer.powerPreference

// Tip 31
// Antialias
// The antialias on the renderer is performant but not as performant
//as if it had no antialias at all. Use it only if necessary

/**
 * Post Processing
 */

// Tip 32
// Limit Passes
// Passes are great, but you each pass takes the amount of pixels
//of the renderer resolution (times the pixel ratio) to render.
// In this scenario, if you have a resolution of 1920x1080 in a
//pixel ratio of 2 with 4 passes, the amount of pixels to be
//renderer will be:
// window width pixel ratio window height pixel ratio passes
//     1920    *     2     *    1080     *     2     *  4
// The result is 33177600 pixels to render. If you regroup the
//pass in a single pass, it will be better for performances

/**
 * Shaders
 */

// Tip 33
// Specific Precision
// You can specify the precision directly in the precision of the
//shaderMaterial like precision: "lowp". This will not work on
//rawShaderMaterial because you have to set the precision directly
//on the fragment shader

// const shaderGeometry = new THREE.PlaneGeometry(10, 10, 256, 256);

// const shaderMaterial = new THREE.ShaderMaterial({
//   precision: "lowp",
//   uniforms: {
//     uDisplacementTexture: { value: displacementTexture },
//     uDisplacementStrength: { value: 1.5 },
//   },
// });

// const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial);
// shaderMesh.rotation.x = -Math.PI * 0.5;
// scene.add(shaderMesh);

// Tip 34
// Shader codes should be simple
// Try to avoid if statements. It's way better to use swizzles and
//built-in functions
// In this example, we use the clamp function to avoid an if statement
//It could be used max as well in this specific example

// const shaderGeometry = new THREE.PlaneGeometry(10, 10, 256, 256);

// const shaderMaterial = new THREE.ShaderMaterial({
//   uniforms: {
//     uDisplacementTexture: { value: displacementTexture },
//     uDisplacementStrength: { value: 1.5 },
//   },
//   vertexShader: `
//         uniform sampler2D uDisplacementTexture;
//         uniform float uDisplacementStrength;

//         varying vec2 vUv;

//         void main()
//         {
//             vec4 modelPosition = modelMatrix * vec4(position, 1.0);

//             float elevation = texture2D(uDisplacementTexture, uv).r;

//             // if(elevation < 0.5) {
//             //     elevation = 0.5;
//             // }

//             // Using built-in clamp function to avoid ifs
//             elevation = clamp(elevation, 0.5, 1.0);
//             // elevation = max(elevation, 0.5);

//             modelPosition.y += elevation * uDisplacementStrength;

//             gl_Position = projectionMatrix * viewMatrix * modelPosition;

//             vUv = uv;
//         }
//     `,
//   fragmentShader: `
//         uniform sampler2D uDisplacementTexture;

//         varying vec2 vUv;

//         void main()
//         {
//             float elevation = texture2D(uDisplacementTexture, vUv).r;

//             // if(elevation < 0.25) {
//             //     elevation = 0.25;
//             // }

//             elevation = max(elevation, 0.25);

//             vec3 depthColor = vec3(1.0, 0.1, 0.1);
//             vec3 surfaceColor = vec3(0.1, 0.0, 0.5);
//             // vec3 finalColor = vec3(0.0);
//             // This is a mix
//             // finalColor.r += depthColor.r + (surfaceColor.r - depthColor.r) * elevation;
//             // finalColor.g += depthColor.g + (surfaceColor.g - depthColor.g) * elevation;
//             // finalColor.b += depthColor.b + (surfaceColor.b - depthColor.b) * elevation;
//             vec3 finalColor = mix(depthColor, surfaceColor, elevation);

//             gl_FragColor = vec4(finalColor, 1.0);
//         }
//     `,
// });

// const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial);
// shaderMesh.rotation.x = -Math.PI * 0.5;
// scene.add(shaderMesh);

// Tip 35
// Use Textures
// Perlin Noise is awesome, but it's not performant. By creating
//a texture, you render it way way faster than applying Perlin Noise.
// Perlin Noise has tons of calculations that the CPU has to do, if
//it is avoidable, awesome.
// Of course, using a texture will not be able to animate the
//uv individually, but sometimes, you don't need it

// Tip 36
// Use Defines (constants inside GLSL)
// Uniforms are great, specially if you are trying to get the correct
// value. But it's a global thing, so it is not that good. What
//we can do is define a constant and use it inside the shader
//#define DISPLACEMENT_STRENGTH 1.5;

// Another way to do it, is set the defines object the same way
//we defined the uniforms object

// const shaderGeometry = new THREE.PlaneGeometry(10, 10, 256, 256);

// const shaderMaterial = new THREE.ShaderMaterial({
//   uniforms: {
//     uDisplacementTexture: { value: displacementTexture },
//     // Remove this uniform
//     // uDisplacementStrength: { value: 1.5 },
//   },
//   defines: {
//     DISPLACEMENT_STRENGTH: 1.5,
//   },
//   vertexShader: `
//         // Add the define
//         //#define DISPLACEMENT_STRENGTH 1.5;
//         uniform sampler2D uDisplacementTexture;

//         varying vec2 vUv;

//         void main()
//         {
//             vec4 modelPosition = modelMatrix * vec4(position, 1.0);

//             float elevation = texture2D(uDisplacementTexture, uv).r;
//             if(elevation < 0.5)
//             {
//                 elevation = 0.5;
//             }

//             modelPosition.y += elevation * DISPLACEMENT_STRENGTH;

//             gl_Position = projectionMatrix * viewMatrix * modelPosition;

//             vUv = uv;
//         }
//     `,
//   fragmentShader: `
//         uniform sampler2D uDisplacementTexture;

//         varying vec2 vUv;

//         void main()
//         {
//             float elevation = texture2D(uDisplacementTexture, vUv).r;
//             if(elevation < 0.25)
//             {
//                 elevation = 0.25;
//             }

//             vec3 depthColor = vec3(1.0, 0.1, 0.1);
//             vec3 surfaceColor = vec3(0.1, 0.0, 0.5);
//             vec3 finalColor = vec3(0.0);
//             finalColor.r += depthColor.r + (surfaceColor.r - depthColor.r) * elevation;
//             finalColor.g += depthColor.g + (surfaceColor.g - depthColor.g) * elevation;
//             finalColor.b += depthColor.b + (surfaceColor.b - depthColor.b) * elevation;

//             gl_FragColor = vec4(finalColor, 1.0);
//         }
//     `,
// });

// const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial);
// shaderMesh.rotation.x = -Math.PI * 0.5;
// scene.add(shaderMesh);

// Tip 37
// Do the calculations inside the Vertex Shader
// If possible, it is better to do all the calculations in the vertex
//shader and just send the result using varyings to the fragment shader
// It is better because usually, we have less vertices than fragments
//hence, you have less stuff to take in consideration

const shaderGeometry = new THREE.PlaneGeometry(10, 10, 256, 256);

const shaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uDisplacementTexture: { value: displacementTexture },
  },
  defines: {
    DISPLACEMENT_STRENGTH: 1.5,
  },
  vertexShader: `
        uniform sampler2D uDisplacementTexture;
        varying vec3 vColor;

        void main()
        {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);

            // Position
            float elevation = texture2D(uDisplacementTexture, uv).r;
            elevation = max(elevation, 0.5);
            modelPosition.y += elevation * DISPLACEMENT_STRENGTH;
            gl_Position = projectionMatrix * viewMatrix * modelPosition;
            
            // Color
            float elevationColor = max(elevation, 0.25);

            vec3 depthColor = vec3(1.0, 0.1, 0.1);
            vec3 surfaceColor = vec3(0.1, 0.0, 0.5);
            vec3 finalColor = mix(depthColor, surfaceColor, elevationColor);
            
            vColor = finalColor;
        }
    `,
  fragmentShader: `
        varying vec3 vColor;
        void main()
        {
            gl_FragColor = vec4(vColor, 1.0);
        }
    `,
});

const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial);
shaderMesh.rotation.x = -Math.PI * 0.5;
scene.add(shaderMesh);
