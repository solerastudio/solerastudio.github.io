
const section=document.getElementById('job'),stage=document.getElementById('stage');
const pname=document.getElementById('pname'),pcount=document.getElementById('pcount'),pmeter=document.getElementById('pmeter');
const layers=[...stage.querySelectorAll('.layer')],cards=[...section.querySelectorAll('.step .card')];
const NAMES=['01 · A FILM','02 · AN APP','03 · A WEBSITE','04 · A GAME','05 · A PART','06 · A ROBOT'],LAMP=[false,false,false,true,true,true];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let pass=-1,visible=false,near=false,gl=null;
function vidOf(i){return layers[i].querySelector('video')}
let loaded=document.readyState==='complete';addEventListener('load',()=>{loaded=true;if(near){load(Math.max(pass,0));load(pass+1)}},{once:true});
function load(i){if(!loaded||i<0||i>=layers.length)return;const L=layers[i],v=vidOf(i);
  L.querySelectorAll('img[data-src]').forEach(m=>{m.src=m.dataset.src;m.removeAttribute('data-src')});
  if(v&&!v.src){const ph=v.dataset.lazyPhone&&matchMedia('(max-width:899px)').matches;if(v.dataset.poster)v.poster=ph?v.dataset.posterPhone:v.dataset.poster;v.preload='auto';v.src=ph?v.dataset.lazyPhone:v.dataset.lazy;if(i===pass&&visible&&!reduce)v.play().catch(()=>{})}}
function setPass(p){if(p===pass)return;pass=p;
  layers.forEach((l,i)=>{l.classList.toggle('on',i===p);const v=vidOf(i);if(v&&i!==p){v.pause();v.muted=true}});
  if(near){load(p);load(p+1)}const v=vidOf(p);if(v&&!reduce&&visible){if(v.dataset.sound&&window.SND&&SND.on&&v.src)SND.speak(v);else v.play().catch(()=>{})}
  pname.textContent=NAMES[p];pname.classList.toggle('lamp',LAMP[p]);pcount.textContent=(p+1)+' / 6';
  if(p===2)live();if(p>=3&&!gl)startGL();if(p===4)load(4)}

function live(){document.getElementById('w-vp').textContent=innerWidth+' × '+innerHeight;
  try{const s=Q.stats(),ok=s.min>=17&&s.minC>=4.5&&!s.ital;document.getElementById('w-mark').innerHTML=ok?'<svg class="tick" viewBox="0 0 22 20"><path d="M3 11 L8 16 L19 3"/></svg><b class="tag-checked">CHECKED</b>':'<i class="lampdot"></i><b class="tag-open">LAMP ON</b>';document.getElementById('w-live').textContent=(ok?'Counted on your screen just now: ':'Below our own bar on your screen just now: ')+'smallest text '+(Math.round(s.min*10)/10)+' px, lowest contrast on plain backgrounds '+s.minC.toFixed(1)+' to 1, '+(s.ital?s.ital+' italic':'no italic')+'.'}catch(e){}}
addEventListener('resize',()=>{if(pass===2)live()});
new IntersectionObserver(es=>{visible=es[0].isIntersecting;const v=pass>=0&&vidOf(pass);if(v){if(visible&&!reduce){if(v.dataset.sound&&window.SND&&SND.on&&v.src)SND.speak(v);else v.play().catch(()=>{})}else{v.pause();v.muted=true}}},{}).observe(stage);
function tick(){requestAnimationFrame(tick);if(!visible)return;
  const intro=section.querySelector('.intro').offsetHeight,r=section.getBoundingClientRect(),total=section.offsetHeight-innerHeight-intro;
  const prog=Math.min(1,Math.max(0,(-r.top-intro)/total));pmeter.style.width=(prog*100).toFixed(1)+'%';
  let cur=0;cards.forEach((c,i)=>{const cr=c.getBoundingClientRect();if(cr.top<innerHeight*(innerWidth<900?.8:.62))cur=i;
    c.style.opacity=Math.max(0,Math.min(1,(cr.top-70)/140)).toFixed(3)});
  setPass(cur);if(gl)gl(prog)}
new IntersectionObserver(es=>{near=es[0].isIntersecting;if(near){load(Math.max(pass,0));load(pass+1)}},{rootMargin:'400px 0px'}).observe(section);
setPass(0);tick();
async function startGL(){gl=()=>{};try{
  const THREE=await import('https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js');
  const buf=await (await fetch('media/comb.bin')).arrayBuffer();const [nv,nf]=new Uint32Array(buf,0,3);
  const q=new Int16Array(buf,12,nv*3),pos=new Float32Array(nv*3);for(let i=0;i<pos.length;i++)pos[i]=q[i]/32767;
  const idx=new Uint16Array(buf,12+nv*6,nf*3);
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setIndex(new THREE.BufferAttribute(idx,1));geo.computeVertexNormals();
  const canvas=document.getElementById('gl'),box=canvas.parentElement;
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0x000000,0);
  const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(30,1,.1,50);
  scene.add(new THREE.HemisphereLight(0xffffff,0x1a1020,1.1));const key=new THREE.DirectionalLight(0xffe2c4,2.2);key.position.set(2,3,2.5);scene.add(key);
  const rim=new THREE.DirectionalLight(0xA98FF3,1.6);rim.position.set(-3,1.5,-2);scene.add(rim);
  const mesh=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:0xB9C6E4,roughness:.55,metalness:0,flatShading:true}));
  const group=new THREE.Group();group.add(mesh);scene.add(group);
  function size(){const w=box.clientWidth,h=box.clientHeight;renderer.setSize(w,h,false);cam.aspect=w/h;
    const fit=1.05/Math.tan(15*Math.PI/180)/Math.min(1,cam.aspect);cam.position.set(0,fit*.85,fit*.75);cam.lookAt(0,0,0);cam.updateProjectionMatrix()}
  size();addEventListener('resize',size);
  const clock=new THREE.Clock();
  gl=prog=>{if(pass!==4)return;const t=clock.getElapsedTime();group.rotation.y=(reduce?0:t*.3)+prog*Math.PI;renderer.render(scene,cam)};
}catch(e){console.warn(e);section.classList.add('nogl');load(4)}}
