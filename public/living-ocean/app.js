const canvas = document.querySelector('#ocean');
const error = document.querySelector('#error');
const gl = canvas.getContext('webgl2', { antialias: false, alpha: false });

function showError(message) {
  error.hidden = false;
  error.textContent = message;
  throw new Error(message);
}

if (!gl) showError('WebGL2 is required to render this ocean.');

const vertexSource = `#version 300 es
precision highp float;
const vec2 POSITIONS[3] = vec2[3](vec2(-1.,-1.), vec2(3.,-1.), vec2(-1.,3.));
void main() { gl_Position = vec4(POSITIONS[gl_VertexID], 0., 1.); }
`;

const fragmentSource = `#version 300 es
precision highp float;

// afl_ext 2017-2024
// MIT License

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float uTimeOfDay;
uniform float uWind;
uniform float uWaveHeight;
uniform float uCloudCover;
uniform float uFog;
uniform float uRain;
uniform vec3 uWaterColor;
out vec4 outColor;

#define DRAG_MULT 0.38
#define WATER_DEPTH 1.0
#define CAMERA_HEIGHT 1.5
#define ITERATIONS_RAYMARCH 12
#define ITERATIONS_NORMAL 36
#define NormalizedMouse (iMouse.xy / iResolution.xy)

vec2 wavedx(vec2 position, vec2 direction, float frequency, float timeshift) {
  float x = dot(direction, position) * frequency + timeshift;
  float wave = exp(sin(x) - 1.0);
  float dx = wave * cos(x);
  return vec2(wave, -dx);
}

float getwaves(vec2 position, int iterations) {
  float wavePhaseShift = length(position) * 0.1;
  float iter = 0.0;
  float frequency = 1.0;
  float timeMultiplier = 2.0;
  float weight = 1.0;
  float sumOfValues = 0.0;
  float sumOfWeights = 0.0;
  for (int i = 0; i < iterations; i++) {
    vec2 p = vec2(sin(iter), cos(iter));
    vec2 res = wavedx(position, p, frequency, iTime * timeMultiplier * mix(0.35, 1.8, uWind) + wavePhaseShift);
    position += p * res.y * weight * DRAG_MULT;
    sumOfValues += res.x * weight;
    sumOfWeights += weight;
    weight = mix(weight, 0.0, 0.2);
    frequency *= 1.18;
    timeMultiplier *= 1.07;
    iter += 1232.399963;
  }
  return sumOfValues / sumOfWeights;
}

float raymarchwater(vec3 camera, vec3 start, vec3 end, float depth) {
  vec3 pos = start;
  vec3 dir = normalize(end - start);
  for (int i = 0; i < 64; i++) {
    float height = getwaves(pos.xz, ITERATIONS_RAYMARCH) * depth * uWaveHeight - depth;
    if (height + 0.01 > pos.y) return distance(pos, camera);
    pos += dir * (pos.y - height);
  }
  return distance(start, camera);
}

vec3 normal(vec2 pos, float e, float depth) {
  vec2 ex = vec2(e, 0.0);
  float H = getwaves(pos.xy, ITERATIONS_NORMAL) * depth * uWaveHeight;
  vec3 a = vec3(pos.x, H, pos.y);
  return normalize(cross(
    a - vec3(pos.x - e, getwaves(pos.xy - ex.xy, ITERATIONS_NORMAL) * depth * uWaveHeight, pos.y),
    a - vec3(pos.x, getwaves(pos.xy + ex.yx, ITERATIONS_NORMAL) * depth * uWaveHeight, pos.y + e)
  ));
}

mat3 createRotationMatrixAxisAngle(vec3 axis, float angle) {
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;
  return mat3(
    oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s,
    oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s,
    oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c
  );
}

vec3 getRay(vec2 fragCoord) {
  vec2 uv = (fragCoord / iResolution * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
  vec3 proj = normalize(vec3(uv.x, uv.y, 1.5));
  return createRotationMatrixAxisAngle(vec3(0.0, -1.0, 0.0), 3.14159265359 * (NormalizedMouse.x * 2.0 - 1.0))
    * createRotationMatrixAxisAngle(vec3(1.0, 0.0, 0.0), 0.5 + 1.5 * (NormalizedMouse.y * 2.0 - 1.0))
    * proj;
}

float intersectPlane(vec3 origin, vec3 direction, vec3 point, vec3 planeNormal) {
  return clamp(dot(point - origin, planeNormal) / dot(direction, planeNormal), -1.0, 9991999.0);
}

vec3 extra_cheap_atmosphere(vec3 raydir, vec3 sundir) {
  sundir.y = max(sundir.y, -0.07);
  float special_trick = 1.0 / (raydir.y + 0.1);
  float special_trick2 = 1.0 / (sundir.y * 11.0 + 1.0);
  float raysundt = pow(abs(dot(sundir, raydir)), 2.0);
  float sundt = pow(max(0.0, dot(sundir, raydir)), 8.0);
  float mymie = sundt * special_trick * 0.2;
  vec3 suncolor = mix(vec3(1.0), max(vec3(0.0), vec3(1.0) - vec3(5.5, 13.0, 22.4) / 22.4), special_trick2);
  vec3 bluesky = vec3(5.5, 13.0, 22.4) / 22.4 * suncolor;
  vec3 bluesky2 = max(vec3(0.0), bluesky - vec3(5.5, 13.0, 22.4) * 0.002 * (special_trick - 6.0 * sundir.y * sundir.y));
  bluesky2 *= special_trick * (0.24 + raysundt * 0.24);
  return bluesky2 * (1.0 + pow(1.0 - raydir.y, 3.0)) + mymie;
}

vec3 getSunDirection() {
  float angle = (uTimeOfDay - 6.0) / 12.0 * 3.14159265359;
  float elevation = sin(angle);
  float southBias = 0.001 + 0.22 * max(elevation, 0.0);
  return normalize(vec3(cos(angle), elevation, -southBias));
}

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

vec3 starLayer(vec3 dir, float scale, float threshold, float radius, float gain, float seedOffset) {
  vec2 spherical = vec2(
    atan(dir.z, dir.x) / 6.28318530718 + 0.5,
    asin(clamp(dir.y, -1.0, 1.0)) / 3.14159265359 + 0.5
  );
  vec2 p = spherical * vec2(scale * 2.0, scale);
  vec2 cell = floor(p);
  vec2 local = fract(p) - 0.5;
  float seed = hash21(cell + seedOffset);
  vec2 offset = vec2(
    hash21(cell + seedOffset + 19.1),
    hash21(cell + seedOffset + 47.7)
  ) - 0.5;
  float core = smoothstep(radius, 0.0, length(local - offset * 0.72));
  core *= step(threshold, seed);
  float twinkle = 0.82 + 0.18 * sin(iTime * (1.1 + seed * 2.7) + seed * 47.0);
  vec3 color = mix(vec3(0.62, 0.78, 1.0), vec3(1.0, 0.78, 0.58), hash21(cell + 83.2));
  return color * core * gain * twinkle;
}

vec3 getStars(vec3 dir) {
  if (dir.y <= 0.0) return vec3(0.0);
  float night = 1.0 - smoothstep(-0.25, -0.05, getSunDirection().y);
  float clearSky = 1.0 - smoothstep(0.08, 0.45, uCloudCover);
  float visibility = (1.0 - 0.92 * uFog) * (1.0 - uRain);
  float horizonFade = smoothstep(0.01, 0.12, dir.y);
  vec3 stars = starLayer(dir, 150.0, 0.982, 0.055, 1.35, 11.0);
  stars += starLayer(dir, 82.0, 0.994, 0.075, 3.20, 71.0);
  return stars * night * clearSky * visibility * horizonFade;
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
             mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0)), f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += valueNoise(p) * amplitude;
    p = mat2(1.6, 1.2, -1.2, 1.6) * p;
    amplitude *= 0.5;
  }
  return value;
}

vec3 getAtmosphere(vec3 dir) {
  vec3 sunDir = getSunDirection();
  float sunHeight = sunDir.y;
  float daylight = smoothstep(0.015, 0.42, sunHeight);
  float twilight = exp(-abs(sunHeight) * 6.0);
  float sunsetSide = step(12.0, uTimeOfDay);
  float elevation = clamp(dir.y, 0.0, 1.0);
  vec3 nightSky = mix(vec3(0.002, 0.005, 0.018), vec3(0.018, 0.025, 0.060), max(dir.y, 0.0));
  vec3 daySky = mix(vec3(0.50, 0.68, 0.80), vec3(0.055, 0.22, 0.52), pow(elevation, 0.55));
  vec3 sky = mix(nightSky, daySky, daylight);
  float facingSun = pow(max(dot(normalize(vec3(dir.x, 0.0, dir.z)), normalize(vec3(sunDir.x, 0.0, sunDir.z))), 0.0), 4.0);
  float horizonGlow = exp(-elevation * 5.0) * (0.18 + 0.82 * facingSun);
  vec3 sunriseColor = vec3(0.95, 0.34, 0.24);
  vec3 sunsetColor = vec3(1.00, 0.18, 0.035);
  sky += mix(sunriseColor, sunsetColor, sunsetSide) * twilight * horizonGlow;
  sky += vec3(0.24, 0.07, 0.32) * twilight * (1.0 - daylight) * pow(elevation, 0.45) * 0.38;
  vec2 samplePoint = dir.xz / max(0.08, dir.y + 0.18) + vec2(iTime * (0.01 + uWind * 0.04), 0.0);
  float cloud = smoothstep(0.55, 0.82, fbm(samplePoint) + uCloudCover * 0.55) * uCloudCover;
  vec3 cloudDay = mix(vec3(0.38, 0.42, 0.46), mix(sunriseColor, sunsetColor, sunsetSide) * 0.72, twilight * facingSun);
  vec3 cloudColor = mix(vec3(0.025, 0.030, 0.050), cloudDay, daylight);
  return mix(sky, cloudColor, cloud * 0.78);
}

vec3 getSun(vec3 dir) {
  vec3 sunDir = getSunDirection();
  float visibility = smoothstep(-0.005, 0.060, sunDir.y);
  float warmth = smoothstep(0.0, 0.34, sunDir.y);
  float sunsetSide = step(12.0, uTimeOfDay);
  vec3 lowSunColor = mix(vec3(1.0, 0.42, 0.20), vec3(1.0, 0.20, 0.045), sunsetSide);
  vec3 sunColor = mix(lowSunColor, vec3(1.0, 0.92, 0.74), warmth);
  float intensity = mix(3.0, 90.0, smoothstep(0.08, 0.45, sunDir.y));
  float disc = pow(max(0.0, dot(dir, sunDir)), 720.0) * intensity;
  return sunColor * disc * visibility * (1.0 - 0.85 * uCloudCover);
}

vec3 aces_tonemap(vec3 color) {
  mat3 m1 = mat3(
    0.59719, 0.07600, 0.02840,
    0.35458, 0.90834, 0.13383,
    0.04823, 0.01566, 0.83777
  );
  mat3 m2 = mat3(
    1.60475, -0.10208, -0.00327,
    -0.53108, 1.10813, -0.07276,
    -0.07367, -0.00605, 1.07602
  );
  vec3 v = m1 * color;
  vec3 a = v * (v + 0.0245786) - 0.000090537;
  vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
  return pow(clamp(m2 * (a / b), 0.0, 1.0), vec3(1.0 / 2.2));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec3 ray = getRay(fragCoord);
  vec3 C;
  if (ray.y >= 0.0) {
    C = getAtmosphere(ray) + getSun(ray) + getStars(ray);
  } else {
    vec3 waterPlaneHigh = vec3(0.0);
    vec3 waterPlaneLow = vec3(0.0, -WATER_DEPTH, 0.0);
    vec3 origin = vec3(iTime * 0.2, CAMERA_HEIGHT, 1.0);
    float highPlaneHit = intersectPlane(origin, ray, waterPlaneHigh, vec3(0.0, 1.0, 0.0));
    float lowPlaneHit = intersectPlane(origin, ray, waterPlaneLow, vec3(0.0, 1.0, 0.0));
    vec3 highHitPos = origin + ray * highPlaneHit;
    vec3 lowHitPos = origin + ray * lowPlaneHit;
    float dist = raymarchwater(origin, highHitPos, lowHitPos, WATER_DEPTH);
    vec3 waterHitPos = origin + ray * dist;
    vec3 N = normal(waterHitPos.xz, 0.01, WATER_DEPTH);
    N = mix(N, vec3(0.0, 1.0, 0.0), 0.8 * min(1.0, sqrt(dist * 0.01) * 1.1));
    float fresnel = 0.04 + 0.96 * pow(1.0 - max(0.0, dot(-N, ray)), 5.0);
    vec3 R = normalize(reflect(ray, N));
    R.y = abs(R.y);
    vec3 reflection = getAtmosphere(R) + getSun(R) + getStars(R) * 0.16;
    vec3 scattering = uWaterColor * 0.1 * (0.2 + (waterHitPos.y + WATER_DEPTH) / WATER_DEPTH);
    C = fresnel * reflection + scattering;
    vec3 horizon = getAtmosphere(normalize(vec3(ray.x, 0.05, ray.z)));
    C = mix(C, horizon, 1.0 - exp(-dist * 0.012 * uFog));
  }

  vec2 rainUv = fragCoord / iResolution;
  float rainX = (rainUv.x + rainUv.y * 0.08 * uWind) * iResolution.x / 6.0;
  float lane = floor(rainX);
  float seed = hash21(vec2(lane, floor(iTime * 0.7)));
  float drop = fract(rainUv.y * (2.0 + seed * 2.0) + iTime * (1.5 + uWind * 2.0) + seed);
  float line = 1.0 - smoothstep(0.10, 0.28, abs(fract(rainX) - 0.5));
  float streak = line * (1.0 - smoothstep(0.0, 0.12, drop)) * step(0.58, seed);
  C += vec3(0.55, 0.65, 0.72) * streak * uRain * 0.12;
  fragColor = vec4(aces_tonemap(C * 2.0), 1.0);
}

void main() { mainImage(outColor, gl_FragCoord.xy); }
`;

function compile(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    showError(`Shader compilation failed:\n${gl.getShaderInfoLog(shader)}`);
  }
  return shader;
}

function createProgram() {
  const program = gl.createProgram();
  gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    showError(`Shader linking failed:\n${gl.getProgramInfoLog(program)}`);
  }
  return program;
}

const program = createProgram();
const uniformNames = ['iResolution', 'iTime', 'iMouse', 'uTimeOfDay', 'uWind', 'uWaveHeight', 'uCloudCover', 'uFog', 'uRain', 'uWaterColor'];
const uniforms = Object.fromEntries(uniformNames.map(name => [name, gl.getUniformLocation(program, name)]));
gl.useProgram(program);
gl.bindVertexArray(gl.createVertexArray());

let yaw = 0.5;
let pitch = 0.27;
let dragging = false;
let previousX = 0;
let previousY = 0;

const PRESETS = {
  clear:  { time: 15, wind: .35, waveHeight: .65, cloudCover: .08, fog: .04, rain: 0,   waterColor: [.029, .070, .172] },
  cloudy: { time: 14, wind: .52, waveHeight: .82, cloudCover: .68, fog: .16, rain: 0,   waterColor: [.026, .058, .110] },
  fog:    { time: 8,  wind: .20, waveHeight: .38, cloudCover: .82, fog: .82, rain: .04, waterColor: [.035, .055, .065] },
  storm:  { time: 17, wind: 1,   waveHeight: 1.38, cloudCover: 1,  fog: .48, rain: .90, waterColor: [.015, .030, .045] },
};

const controls = {
  time: document.querySelector('#time'),
  timeValue: document.querySelector('#time-value'),
  timeRunning: document.querySelector('#time-running'),
  wind: document.querySelector('#wind'),
  waveHeight: document.querySelector('#wave-height'),
  cloudCover: document.querySelector('#cloud-cover'),
  fog: document.querySelector('#fog'),
  rain: document.querySelector('#rain'),
  waterColor: document.querySelector('#water-color'),
};
const compass = document.querySelector('#compass');
const compassDial = document.querySelector('.compass-dial');
const compassRose = document.querySelector('#compass-rose');
const headingValue = document.querySelector('#heading-value');

const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value)));
const cloneWeather = value => ({ ...value, waterColor: [...value.waterColor] });
let current = cloneWeather(PRESETS.clear);
let target = cloneWeather(PRESETS.clear);

function rgbToHex(rgb) {
  return `#${rgb.map(value => Math.round(clamp(value, 0, 1) * 255).toString(16).padStart(2, '0')).join('')}`;
}

function hexToRgb(hex) {
  return [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16) / 255);
}

function formatTime(value) {
  const minutes = Math.round((value % 24) * 60) % 1440;
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

function syncControls() {
  for (const key of ['time', 'wind', 'waveHeight', 'cloudCover', 'fog', 'rain']) controls[key].value = target[key];
  controls.waterColor.value = rgbToHex(target.waterColor);
  controls.timeValue.value = formatTime(target.time);
}

function getHeading() {
  return (180 * (yaw * 2 - 1) + 360) % 360;
}

function setHeading(degrees) {
  const signed = ((degrees + 180) % 360 + 360) % 360 - 180;
  yaw = (signed / 180 + 1) / 2;
  updateCompass();
}

function updateCompass() {
  const heading = getHeading();
  const rounded = Math.round(heading) % 360;
  const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
  const direction = directions[Math.round(heading / 45) % directions.length];
  compassRose.style.transform = `rotate(${-heading}deg)`;
  headingValue.value = `${String(rounded).padStart(3, '0')}°`;
  compass.setAttribute('aria-valuenow', String(rounded));
  compass.setAttribute('aria-valuetext', `${direction}，${rounded} 度`);
}

function pointCompass(event) {
  const bounds = compassDial.getBoundingClientRect();
  const dx = event.clientX - (bounds.left + bounds.width / 2);
  const dy = bounds.top + bounds.height / 2 - event.clientY;
  if (Math.hypot(dx, dy) < 5) return;
  setHeading((Math.atan2(dx, dy) * 180 / Math.PI + 360) % 360);
}

let compassDragging = false;
compassDial.addEventListener('pointerdown', event => {
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  compassDragging = true;
  compassDial.setPointerCapture(event.pointerId);
  pointCompass(event);
});
compassDial.addEventListener('pointermove', event => {
  if (compassDragging) pointCompass(event);
});
compassDial.addEventListener('pointerup', event => {
  compassDragging = false;
  if (compassDial.hasPointerCapture(event.pointerId)) compassDial.releasePointerCapture(event.pointerId);
});
compassDial.addEventListener('pointercancel', () => { compassDragging = false; });
compass.addEventListener('keydown', event => {
  const step = event.shiftKey ? 15 : 5;
  const next = event.key === 'ArrowLeft' ? getHeading() - step
    : event.key === 'ArrowRight' ? getHeading() + step
    : event.key === 'Home' ? 0
    : event.key === 'End' ? 180
    : null;
  if (next === null) return;
  event.preventDefault();
  setHeading(next);
});

function applyPreset(name) {
  if (!PRESETS[name]) return;
  target = cloneWeather(PRESETS[name]);
  document.querySelectorAll('[data-weather]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.weather === name));
  });
  document.body.dataset.weather = name;
  syncControls();
}

document.querySelectorAll('[data-weather]').forEach(button => {
  button.addEventListener('click', () => applyPreset(button.dataset.weather));
});

for (const key of ['time', 'wind', 'waveHeight', 'cloudCover', 'fog', 'rain']) {
  controls[key].addEventListener('input', event => {
    target[key] = clamp(event.currentTarget.value, event.currentTarget.min, event.currentTarget.max);
    if (key === 'time') controls.timeValue.value = formatTime(target.time);
  });
}

controls.waterColor.addEventListener('input', event => {
  target.waterColor = hexToRgb(event.currentTarget.value);
});

function resize() {
  const dpr = Math.min(devicePixelRatio, 2);
  const width = Math.round(canvas.clientWidth * dpr);
  const height = Math.round(canvas.clientHeight * dpr);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
  }
}

canvas.addEventListener('pointerdown', event => {
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  dragging = true;
  previousX = event.clientX;
  previousY = event.clientY;
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener('pointermove', event => {
  if (!dragging) return;
  yaw = (yaw + (event.clientX - previousX) / canvas.clientWidth * 0.45 + 1) % 1;
  pitch = clamp(pitch - (event.clientY - previousY) / canvas.clientHeight * 0.55, 0.08, 0.82);
  updateCompass();
  previousX = event.clientX;
  previousY = event.clientY;
});

canvas.addEventListener('pointerup', event => {
  dragging = false;
  if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
});

canvas.addEventListener('pointercancel', () => { dragging = false; });

document.querySelector('#reset-view').addEventListener('click', () => {
  yaw = 0.5;
  pitch = 0.27;
  updateCompass();
});

document.querySelector('#panel-toggle').addEventListener('click', event => {
  const closed = document.body.classList.toggle('panel-closed');
  event.currentTarget.setAttribute('aria-expanded', String(!closed));
});

syncControls();
updateCompass();

const startedAt = performance.now();
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let previousFrame = startedAt;
function render(now) {
  const deltaSeconds = Math.min((now - previousFrame) / 1000, 0.1);
  previousFrame = now;
  if (controls.timeRunning.checked) {
    target.time = (target.time + deltaSeconds * 0.05) % 24;
    controls.time.value = target.time;
    controls.timeValue.value = formatTime(target.time);
  }

  const blend = reducedMotion ? 1 : 1 - Math.exp(-3 * deltaSeconds);
  const timeDistance = ((target.time - current.time + 36) % 24) - 12;
  current.time = (current.time + timeDistance * blend + 24) % 24;
  for (const key of ['wind', 'waveHeight', 'cloudCover', 'fog', 'rain']) {
    current[key] += (target[key] - current[key]) * blend;
  }
  current.waterColor = current.waterColor.map((value, index) =>
    value + (target.waterColor[index] - value) * blend
  );

  resize();
  gl.uniform2f(uniforms.iResolution, canvas.width, canvas.height);
  gl.uniform1f(uniforms.iTime, (now - startedAt) / 1000);
  gl.uniform2f(uniforms.iMouse, yaw * canvas.width, pitch * canvas.height);
  gl.uniform1f(uniforms.uTimeOfDay, current.time);
  gl.uniform1f(uniforms.uWind, current.wind);
  gl.uniform1f(uniforms.uWaveHeight, current.waveHeight);
  gl.uniform1f(uniforms.uCloudCover, current.cloudCover);
  gl.uniform1f(uniforms.uFog, current.fog);
  gl.uniform1f(uniforms.uRain, current.rain);
  gl.uniform3fv(uniforms.uWaterColor, current.waterColor);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  if (!canvas.dataset.ready) canvas.dataset.ready = 'true';
  requestAnimationFrame(render);
}

window.__oceanDebug = { gl, program, applyPreset, getState: () => ({ yaw, pitch, weather: structuredClone(current) }) };
requestAnimationFrame(render);
