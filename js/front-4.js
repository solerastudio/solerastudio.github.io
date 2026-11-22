
var Q=(function(){
function rgba(s){var m=s.match(/rgba?\(([^)]+)\)/);if(!m)return null;var p=m[1].split(/[ ,\/]+/).filter(Boolean).map(parseFloat);return{r:p[0],g:p[1],b:p[2],a:p.length>3?p[3]:1}}
function lum(c){function ch(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)}return .2126*ch(c.r)+.7152*ch(c.g)+.0722*ch(c.b)}
function over(t,b){var a=t.a;return{r:t.r*a+b.r*(1-a),g:t.g*a+b.g*(1-a),b:t.b*a+b.b*(1-a),a:1}}
function bgOf(el){var st=[];for(var e=el;e&&e.nodeType===1;e=e.parentElement){var cs=getComputedStyle(e),c=rgba(cs.backgroundColor);
  if(c&&c.a>0){st.push(c);if(c.a>=1)break}
  if(e.classList.contains('frame')||e.classList.contains('hero')||e.classList.contains('stage'))return null}
  var base=st.length&&st[st.length-1].a>=1?st.pop():rgba(getComputedStyle(document.body).backgroundColor);
  while(st.length)base=over(st.pop(),base);return base}
function ratio(a,b){var x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
function scan(){var out=[],seen=new Set(),w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  while(w.nextNode()){var n=w.currentNode;if(!n.nodeValue.trim())continue;var el=n.parentElement;
    if(!el||seen.has(el)||el.closest('#insp,#readout,#boot,script,style'))continue;seen.add(el);
    var cs=getComputedStyle(el);if(cs.visibility==='hidden'||cs.display==='none')continue;
    var r=el.getBoundingClientRect();if(!r.width||!r.height)continue;
    var fg=rgba(cs.color),bg=bgOf(el),cr=bg&&fg?ratio(over(fg,bg),bg):null;
    out.push({el:el,size:parseFloat(cs.fontSize),italic:cs.fontStyle!=='normal',cr:cr})}
  return out}
function stats(){var items=scan(),min=Infinity,minC=Infinity,ital=0,scored=0;
  items.forEach(function(i){if(i.size<min)min=i.size;if(i.italic)ital++;if(i.cr!=null){scored++;if(i.cr<minC)minC=i.cr}});
  var nav=performance.getEntriesByType('navigation')[0];
  return{items:items,n:items.length,min:min,minC:minC,ital:ital,scored:scored,load:nav&&nav.loadEventEnd?nav.loadEventEnd:null}}
return{scan:scan,stats:stats}})();


window.SND=(function(){var on=false,btn=document.getElementById('snd');
function speak(v){if(!on||!v)return;v.muted=false;try{v.currentTime=0}catch(e){}var last=0;
  function t(){if(v.currentTime<last-0.5||v.paused){v.muted=true;v.removeEventListener('timeupdate',t)}last=v.currentTime}
  v.addEventListener('timeupdate',t);v.play().catch(function(){v.muted=true;v.removeEventListener('timeupdate',t);v.play().catch(function(){});set(false)})}
function set(x){on=x;btn.setAttribute('aria-pressed',x);btn.querySelector('span').textContent=x?'Sound on':'Sound off';
  document.querySelectorAll('video').forEach(function(v){if(!x)v.muted=true});
  if(x){var b=document.querySelector('.bench video'),r=b.getBoundingClientRect();if(r.bottom>0)speak(b);
    var st=document.getElementById('stage').getBoundingClientRect(),a=document.querySelector('#stage .layer.on video');if(a&&a.src&&a.dataset.sound&&st.top<innerHeight&&st.bottom>0)speak(a)}}
btn.addEventListener('click',function(){set(!on)});
var benchIn=true;new IntersectionObserver(function(es){var v=es[0].target.querySelector('video');if(!es[0].isIntersecting){benchIn=false;v.muted=true}else{if(!benchIn&&on)speak(v);benchIn=true}},{threshold:0.25}).observe(document.querySelector('.bench'));
return{get on(){return on},speak:speak}})();


document.querySelectorAll('video[data-hold]').forEach(function(v){var h=+v.dataset.hold;
  function chk(){if(v.currentTime>=h&&!v.paused){v.pause();v.dataset.held='1'}}
  if('requestVideoFrameCallback' in v){var f=function(){chk();v.requestVideoFrameCallback(f)};v.requestVideoFrameCallback(f)}else v.addEventListener('timeupdate',chk);
  v.addEventListener('ended',function(){v.dataset.held='1'});
  v.style.cursor='pointer';v.addEventListener('click',function(){try{v.currentTime=0}catch(e){}if(window.SND&&SND.on)SND.speak(v);else v.play().catch(function(){})})});


(function(){
var boot=document.getElementById('boot'),body=document.body,done=false,t0=performance.now();
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function finish(){if(done)return;done=true;boot.classList.add('gone');body.classList.remove('booting');document.documentElement.classList.remove('booting');document.documentElement.classList.add('ready');
  var s=[['s1',700]];s.forEach(function(x){setTimeout(function(){document.getElementById(x[0]).classList.add('on')},reduce?0:x[1])});
  setTimeout(function(){boot.style.display='none'},800)}
if(reduce){boot.style.display='none';finish();return}
boot.querySelector('.skip').addEventListener('click',finish);boot.addEventListener('click',finish);
var lines=[].slice.call(boot.querySelectorAll('.boot-line'));
function set(k,txt,lamp){var v=boot.querySelector('[data-k="'+k+'"] .mono-value');v.textContent=txt;v.classList.toggle('lamp',!!lamp)}
var vid=document.querySelector('.bench video');
var filmReady=new Promise(function(r){if(vid.readyState>=3)r();else{vid.addEventListener('canplay',r,{once:true});setTimeout(r,1300)}});
var gf=document.getElementById('gf'),fonts=new Promise(function(r){if(gf.media==='all')r();else{gf.addEventListener('load',r,{once:true});gf.addEventListener('error',r,{once:true})}setTimeout(r,2000)}).then(function(){return document.fonts?document.fonts.ready:null});
lines.forEach(function(l,i){setTimeout(function(){l.classList.add('on')},120+i*260)});
fonts.then(function(){set('type','CHECKED');var s=Q.stats();set('min',s.min+' px  '+(s.min<17?'LAMP ON':'CHECKED'),s.min<17);set('contrast',s.minC.toFixed(1)+':1  '+(s.minC<4.5?'LAMP ON':'CHECKED'),s.minC<4.5)});
filmReady.then(function(){set('film',vid.readyState>=3?'CHECKED':'LOADING',vid.readyState<3)});
Promise.all([fonts,filmReady]).then(function(){var wait=Math.max(0,1700-(performance.now()-t0));setTimeout(finish,wait)});
setTimeout(finish,2500);
})();
