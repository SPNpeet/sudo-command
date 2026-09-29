import { useEffect, useRef, useState } from 'react'

// Decorative only. Content, navigation and images do not depend on WebGL.
export default function SignalField({ paused }) {
  const canvas = useRef(null)
  const [available, setAvailable] = useState(false)
  useEffect(() => {
    const el = canvas.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduced.matches) return
    const gl = el.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false, powerPreference: 'low-power' })
    if (!gl) return
    const shaders = []
    const compile = (type, source) => {
      const shader = gl.createShader(type)
      gl.shaderSource(shader, source); gl.compileShader(shader)
      shaders.push(shader)
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null
    }
    const vertex = compile(gl.VERTEX_SHADER, 'attribute vec2 p; void main(){gl_Position=vec4(p,0.,1.);}')
    const fragment = compile(gl.FRAGMENT_SHADER, `precision mediump float;
      uniform vec2 resolution; uniform vec2 pointer; uniform float time;
      void main(){
        vec2 uv=gl_FragCoord.xy/resolution; vec2 p=uv*2.-1.;
        p.x*=resolution.x/resolution.y;
        float light=0.;
        for(int i=0;i<18;i++){
          float f=float(i); float wave=sin(p.x*.85+time*.2+f*.11)*.22;
          wave+=sin(p.x*1.5-time*.13+f*.08)*.08;
          wave+=(pointer.y-.5)*.12 + (f-8.5)*.045;
          float d=abs(p.y-wave);
          light+=.0018/(d+.009);
        }
        float fade=smoothstep(0.,.2,uv.x)*(1.-smoothstep(.82,1.,uv.x));
        vec3 color=mix(vec3(.78,.22,.03),vec3(1.,.66,.38),clamp(light*.25,0.,1.));
        gl_FragColor=vec4(mix(vec3(.09,.094,.098),color,clamp(light*.35,0.,.7)*fade),1.);
      }`)
    if (!vertex || !fragment) { shaders.forEach(s=>gl.deleteShader(s)); return }
    const program=gl.createProgram();gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program)
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)){gl.deleteProgram(program);shaders.forEach(s=>gl.deleteShader(s));return}
    gl.useProgram(program)
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW)
    const attr=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,2,gl.FLOAT,false,0,0)
    const res=gl.getUniformLocation(program,'resolution'),pos=gl.getUniformLocation(program,'pointer'),time=gl.getUniformLocation(program,'time')
    let frame=0, visible=true, lost=false, last=0, tick=0, target=.5, current=.5
    const resize=()=>{const r=el.getBoundingClientRect();const ratio=Math.min(window.devicePixelRatio||1,1.25);el.width=Math.max(1,Math.round(r.width*ratio));el.height=Math.max(1,Math.round(r.height*ratio));gl.viewport(0,0,el.width,el.height)}
    const draw=now=>{frame=0;if(lost)return;if(now-last>32){tick+=Math.min(now-last,50);last=now;current+=(target-current)*.04;gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform2f(res,el.width,el.height);gl.uniform2f(pos,.5,current);gl.uniform1f(time,tick*.001);gl.drawArrays(gl.TRIANGLES,0,6)}if(visible&&!document.hidden&&!paused&&!reduced.matches)frame=requestAnimationFrame(draw)}
    const resume=()=>{cancelAnimationFrame(frame);frame=0;if(!lost)draw(performance.now())}
    const move=e=>{const r=el.parentElement.getBoundingClientRect();target=1-(e.clientY-r.top)/r.height}
    const loss=e=>{e.preventDefault();lost=true;cancelAnimationFrame(frame);setAvailable(false)}
    const observer='IntersectionObserver' in window?new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;resume()}):null
    const sizeObserver='ResizeObserver' in window?new ResizeObserver(()=>{resize();resume()}):null
    resize();setAvailable(true);resume();observer?.observe(el);sizeObserver?.observe(el)
    el.parentElement.addEventListener('pointermove',move);el.addEventListener('webglcontextlost',loss);document.addEventListener('visibilitychange',resume);window.addEventListener('resize',resize);reduced.addEventListener('change',resume)
    return()=>{cancelAnimationFrame(frame);observer?.disconnect();sizeObserver?.disconnect();el.parentElement?.removeEventListener('pointermove',move);el.removeEventListener('webglcontextlost',loss);document.removeEventListener('visibilitychange',resume);window.removeEventListener('resize',resize);reduced.removeEventListener('change',resume);gl.deleteBuffer(buffer);gl.deleteProgram(program);shaders.forEach(s=>gl.deleteShader(s))}
  },[paused])
  return <canvas ref={canvas} className={`s-signal-field ${available?'is-ready':''}`} aria-hidden="true"/>
}
