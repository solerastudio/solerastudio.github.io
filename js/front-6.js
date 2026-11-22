
(function(){
var layer=document.getElementById('insp'),ro=document.getElementById('readout'),on=false;
var LABEL='h1,h2,h3,p,.btn,.subtitle>span,.make b,.make .d,.timecode,.kicker,.mono-label,nav a,.wordmark,.fig';
function fam(f){f=f.split(',')[0].replace(/["']/g,'');return /Mono/.test(f)?'Mono':/Atkinson/.test(f)?'Atkinson':f}
function draw(){layer.innerHTML='';layer.style.height=document.documentElement.scrollHeight+'px';
  var s=Q.stats(),items=s.items,sx=scrollX,sy=scrollY,placed=[],styled={},vw=document.documentElement.clientWidth,words=[];
  items.forEach(function(i){var rg=document.createRange();rg.selectNodeContents(i.el);
    [].forEach.call(rg.getClientRects(),function(q){if(q.width>1)words.push({x:q.left+sx,y:q.top+sy,w:q.width,h:q.height})})});
  items.forEach(function(i){var el=i.el.closest(LABEL);if(!el||el.__done===draw.gen)return;el.__done=draw.gen;
    var r=el.getBoundingClientRect(),fail=i.size<17||i.italic||(i.cr!=null&&i.cr<4.5),cs=getComputedStyle(i.el);
    var b=document.createElement('div');b.className='box'+(fail?' fail':'');b.style.cssText='left:'+(r.left+sx)+'px;top:'+(r.top+sy)+'px;width:'+r.width+'px;height:'+r.height+'px';layer.appendChild(b);
    var key=fam(cs.fontFamily)+' '+Math.round(i.size)+' '+cs.fontWeight+' '+cs.color;if(styled[key]&&!fail)return;
    var l=document.createElement('div');l.className='lab'+(fail?' fail':'');
    l.textContent=fam(cs.fontFamily)+' '+Math.round(i.size)+'px'+(i.cr!=null?' · '+i.cr.toFixed(1)+':1':'');
    layer.appendChild(l);var lw=l.offsetWidth,spots=[[r.left,r.top-25],[r.right-lw,r.top-25],[r.left,r.bottom+2]],ok=null;
    for(var yy=r.top+2;yy<r.bottom-25;yy+=12)spots.push([r.right-lw-4,yy]);
    for(var k=0;k<spots.length&&!ok;k++){var x=Math.max(2,Math.min(spots[k][0]+sx,vw-lw-2)),y=Math.max(0,spots[k][1]+sy);
      var clash=function(p){return x<p.x+p.w+4&&x+lw+4>p.x&&y<p.y+p.h&&y+25>p.y};if(!placed.some(clash)&&!words.some(clash))ok=[x,y]}
    if(!ok){layer.removeChild(l);return}
    l.style.left=ok[0]+'px';l.style.top=ok[1]+'px';placed.push({x:ok[0],y:ok[1],w:lw,h:25});styled[key]=1});
  var w=document.getElementById('films'),wr=w.getBoundingClientRect(),cs=getComputedStyle(w),pl=parseFloat(cs.paddingLeft),pr=parseFloat(cs.paddingRight),mn=document.querySelector('main').getBoundingClientRect();
  [wr.left+pl,wr.right-pr].forEach(function(x){var g=document.createElement('div');g.className='guide';g.style.cssText='left:'+(x+sx)+'px;top:'+(mn.top+sy)+'px;height:'+mn.height+'px';layer.appendChild(g)});
  var gl=document.createElement('div');gl.className='webgl-layer';gl.textContent='column '+Math.round(wr.width-pl-pr)+'px · gutter '+pl+'px';var so=document.querySelector('#films .films').getBoundingClientRect();gl.style.left=(wr.left+pl+sx+6)+'px';gl.style.top=(so.bottom+sy+20)+'px';layer.appendChild(gl);
  ro.innerHTML='<div class="row"><span class="mono-label">'+s.n+' TEXT BLOCKS</span>'+
    '<span class="'+(s.min>=17?'ok':'bad')+'">smallest '+(Math.round(s.min*10)/10)+'px</span>'+
    '<span class="'+(s.minC>=4.5?'ok':'bad')+'">contrast &ge; '+s.minC.toFixed(1)+':1</span>'+
    '<span class="'+(s.ital?'bad':'ok')+'">'+(s.ital?s.ital+' italic':'no italic')+'</span>'+
    (s.n-s.scored?'<span class="mono-label">'+(s.n-s.scored)+' over pictures, not scored</span>':'')+
    '<button type="button">Close</button></div>';
  ro.querySelector('button').addEventListener('click',toggle)}
draw.gen=0;
function toggle(){on=!on;document.documentElement.classList.toggle('inspecting',on);
  document.querySelectorAll('.js-inspect').forEach(function(b){b.setAttribute('aria-pressed',on);b.textContent=on?'Inspect is on':'Inspect this page'});
  if(on){draw.gen++;draw();setTimeout(function(){if(on){draw.gen++;draw()}},120)}}
document.querySelectorAll('.js-inspect').forEach(function(b){b.addEventListener('click',toggle)});
var t;addEventListener('resize',function(){clearTimeout(t);t=setTimeout(function(){if(on){draw.gen++;draw()}},150)});
addEventListener('keydown',function(e){if(on&&e.key==='Escape')toggle()});
})();
/* studio cut: tap = from the start, sound on, the player's own controls from then on */
(function(){var v=document.getElementById('cutv'),b=document.querySelector('.cut-play');if(!v||!b)return;
b.addEventListener('click',function(){if(!v.src){v.preload='auto';v.src=v.dataset.src}v.dataset.user='1';v.currentTime=0;v.muted=false;v.controls=true;b.hidden=true;v.play().catch(function(){})})})();
/* bug: reduced motion now stops the bench film too, on its first frame */
(function(){var v=document.getElementById('askv');if(!v||!('IntersectionObserver' in window))return;var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;new IntersectionObserver(function(es){if(es[0].isIntersecting){if(window.SND&&SND.on)SND.speak(v);else if(!rm&&!v.dataset.held)v.play().catch(function(){})}else{v.pause();v.muted=true}},{threshold:.5}).observe(v)})();
if(matchMedia('(prefers-reduced-motion: reduce)').matches){var bv=document.querySelector('.bench video');if(bv){bv.autoplay=false;bv.pause();bv.addEventListener('play',function(){if(!(window.SND&&SND.on))bv.pause()})}}
