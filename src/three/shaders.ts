import * as THREE from 'three'

/**
 * Particle body of the figure. Every point is sampled from the model's surface; `uMorph`
 * blends each one from its place on the body into a swirling flow field that fills the
 * background. Per-point delay (aSeed.w plus a height term) makes the change travel up the
 * body instead of switching all at once.
 */
const vertex = /* glsl */ `
  attribute vec3 aColor;
  attribute vec4 aSeed;
  uniform float uTime;
  uniform float uMorph;
  uniform float uSize;
  uniform float uPixel;
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 p = position;

    float ang = aSeed.x * 6.2831853 + uTime * (0.04 + aSeed.y * 0.10);
    float rad = 0.9 + aSeed.y * aSeed.y * 5.6;
    float h = (aSeed.z - 0.5) * 7.0 + sin(uTime * 0.35 + aSeed.x * 40.0) * 0.25;
    vec3 flow = vec3(cos(ang) * rad, h, sin(ang) * rad - 0.6);
    // streak the flow slightly along its tangent so it reads as motion, not noise
    flow += vec3(-sin(ang), 0.0, cos(ang)) * sin(uTime * 0.8 + aSeed.w * 30.0) * 0.12;

    float delay = aSeed.w * 0.35 + (1.0 - (p.y + 1.0) * 0.5) * 0.25;
    float m = clamp((uMorph * 1.6 - delay) / 0.6, 0.0, 1.0);
    m = m * m * (3.0 - 2.0 * m);

    vec3 pos = mix(p, flow, m);
    // micro-jitter on the body keeps it alive without losing the silhouette
    pos += (aSeed.xyz - 0.5) * 0.012 * (1.0 - m) * sin(uTime * 2.0 + aSeed.w * 50.0);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixel * (60.0 / -mv.z) * (0.7 + aSeed.w * 0.9);

    vec3 bright = aColor * 1.9 + 0.08;
    vColor = mix(bright, vec3(0.22, 0.94, 0.85), m * 0.55 + 0.1 * (1.0 - m));
    vAlpha = uOpacity * mix(0.95, 0.5 + 0.4 * aSeed.y, m);
  }
`

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.05, d) * vAlpha;
    gl_FragColor = vec4(vColor, a);
    #include <colorspace_fragment>
  }
`

export function createPointsMaterial(pixelRatio: number) {
  return new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uSize: { value: 0.24 },
      uPixel: { value: pixelRatio },
      uOpacity: { value: 0 },
    },
  })
}
