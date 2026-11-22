(function(){
var D=document,root=D.documentElement,RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
var $=function(s,c){return (c||D).querySelector(s)},$$=function(s,c){return [].slice.call((c||D).querySelectorAll(s))};


var checked=null;
function selfCheck(){try{var s=Q.stats();checked={ok:s.min>=17&&s.minC>=4.5&&!s.ital}}catch(e){checked=null}}
function showLive(){if(checked&&checked.ok)$('#h1tick').classList.add('on')}


var svg=$('#strand'),sp=$('#strand-p'),lastD='',total=0,table=[],drawn=0,target=0,tween=null,sigDone=false;
function build(){
  var W=root.clientWidth,H=D.body.offsetHeight,sx=scrollX,sy=scrollY,desk=W>=900;
  var g=desk?48:16,gL=desk?24:8,gR=W-gL,k=desk?1.5:1,P=[];
  svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.style.height=H+'px';
  function R(el){var r=el.getBoundingClientRect();return{l:r.left+sx,t:r.top+sy,r:r.right+sx,b:r.bottom+sy,w:r.width,h:r.height}}
  function run(x,y0,y1,ph){var n=Math.max(1,Math.round((y1-y0)/260));for(var i=1;i<n;i++){var y=y0+(y1-y0)*i/n;P.push([x+Math.sin(i*1.7+ph)*(desk?5:2.2),y])}}
  
  var w=R($('#wm svg')),x0=w.l+w.w*(1.5/22),y0=w.t+w.h*(39/40);
  P.push([x0,y0]);P.push([x0-4,y0+16]);
  var u=R($('#under')),uy=u.t+u.h*.5;
  P.push([gL+1,y0+52]);P.push([gL,y0+96]);run(gL,y0+96,uy-44,0);P.push([gL,uy-44]);P.push([gL+3*k,uy-18]);P.push([gL+16*k,uy-3]);P.push([g+34*k,uy+3]);
  P.push([W*.28,uy+5]);P.push([W*.52,uy-3]);P.push([W*.76,uy+4]);P.push([gR-34*k,uy]);P.push([gR-12*k,uy+7]);P.push([gR-2*k,uy+24]);P.push([gR,uy+50]);
  var side=1,y=uy+50,sw=$$('[data-sweep]');
  sw.forEach(function(el,i){var r=R(el),xa=side?gR:gL,xb=side?gL:gR,d=side?-1:1,last=el.hasAttribute('data-last');
    run(xa,y,r.t+4,i);P.push([xa,r.t+4]);
    if(last){ 
      var s=R($('#sig')),ex=s.l+s.w*(66/190),ey=s.t+s.h*(14/104);
      P.push([xa,r.t+r.h*.5]);P.push([xa+(ex-xa)*.25,r.b-10]);
      if(desk){var bk=R($('.block'));P.push([xa+(ex-xa)*.6,bk.t-30]);P.push([ex+44,bk.t-24]);P.push([ex+50,ey-6]);P.push([ex+34,ey+14]);P.push([ex+12,ey+10])}
      else{P.length-=2;run(xa,r.t+4,ey-70,3);P.push([xa,ey-70]);P.push([xa-1,ey-44]);P.push([xa-12,ey-22]);P.push([ex+90,ey-13]);P.push([ex+30,ey-11])}
      P.push([ex,ey]);y=ey;return}
    var cx=W*.5,cy=r.t+r.h*.5;
    P.push([xa+d*W*.07,r.t+r.h*.2]);
    if(i%2===0){ 
      P.push([cx-d*70*k,cy-6*k]);P.push([cx-d*12*k,cy+15*k]);P.push([cx+d*22*k,cy-1*k]);P.push([cx+d*5*k,cy-23*k]);
      P.push([cx-d*17*k,cy-5*k]);P.push([cx+d*8*k,cy+19*k]);P.push([cx+d*74*k,cy+14*k])}
    else{P.push([cx-d*W*.16,cy-12*k]);P.push([cx+d*W*.16,cy+12*k])}
    P.push([xb-d*W*.07,r.b-r.h*.2]);P.push([xb,r.b-2]);y=r.b-2;side=side?0:1});
  
  var dd='M'+P[0][0].toFixed(1)+' '+P[0][1].toFixed(1);
  function dir(i){var a=P[i-1]||P[i],b=P[i+1]||P[i],x=b[0]-a[0],y=b[1]-a[1],n=Math.hypot(x,y)||1;return[x/n,y/n]}
  for(var i=0;i<P.length-1;i++){var p1=P[i],p2=P[i+1],L=Math.hypot(p2[0]-p1[0],p2[1]-p1[1])/3,d1=dir(i),d2=dir(i+1);
    dd+=' C'+(p1[0]+d1[0]*L).toFixed(1)+' '+(p1[1]+d1[1]*L).toFixed(1)+','+(p2[0]-d2[0]*L).toFixed(1)+' '+(p2[1]-d2[1]*L).toFixed(1)+','+p2[0].toFixed(1)+' '+p2[1].toFixed(1)}
  if(dd===lastD)return;lastD=dd;
  sp.setAttribute('d',dd);total=sp.getTotalLength();sp.style.strokeDasharray=total+' '+total;
  table=[];for(var l=0;l<=total;l+=28){table.push([l,sp.getPointAtLength(l).y])}
  if(RM){drawn=total;sigOn()}paint()}
function lenAt(y){for(var i=0;i<table.length;i++){if(table[i][1]>y)return table[i][0]}return total}
function wanted(){var max=Math.max(1,root.scrollHeight-innerHeight),p=Math.min(1,scrollY/max);
  if(p>.995)return total;return lenAt(scrollY+innerHeight*(.52+.4*p))}
function paint(){sp.style.strokeDashoffset=Math.max(0,total-drawn)}
function sigOn(){if(sigDone)return;sigDone=true;$('#sig').classList.add('on')}
function frame(){
  if(tween){var t=Math.min(1,(performance.now()-tween.t0)/tween.d),e=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;drawn=tween.a+(tween.b-tween.a)*e;if(t>=1)tween=null}
  else if(!RM){target=wanted();var dl=target-drawn;drawn+=Math.abs(dl)<.6?dl:dl*.09}
  if(!RM&&total&&drawn>=total-1.5)sigOn();
  paint();requestAnimationFrame(frame)}


function reveals(){var els=$$('.reveal');
  if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('on')});return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}})},{rootMargin:'0px 0px -12% 0px'});
  els.forEach(function(e){io.observe(e)});
  var vo=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting){var SD=navigator.connection&&navigator.connection.saveData;if(SD&&!v.src)return;if(!v.src){v.preload='auto';v.src=v.dataset.src}if(!RM&&!v.dataset.user)v.play().catch(function(){})}else v.pause()})},{rootMargin:'250px'});
  $$('video[data-src]').forEach(function(v){vo.observe(v)})}
function clock(){var t0=performance.now(),tc=$('#tc');function f(n){return String(n).padStart(2,'0')}
  if(RM){tc.textContent='00:00:00';return}
  (function tick(){var s=(performance.now()-t0)/1000;tc.textContent=f(Math.floor(s/60))+':'+f(Math.floor(s)%60)+':'+f(Math.floor(s*24)%24);requestAnimationFrame(tick)})()}


var started=false;
function start(){if(started)return;started=true;
  build();selfCheck();
  root.classList.remove('pre');
  if(RM){showLive()}
  else{tween={t0:performance.now()+120,d:1500,a:0,b:wanted()};tween.t0=performance.now();
    setTimeout(showLive,1350)}
  
  requestAnimationFrame(frame)}
function skip(){if(!started||performance.now()>2600)return;root.classList.add('skip');tween=null;drawn=wanted();showLive();
  setTimeout(function(){root.classList.remove('skip')},60)}
['wheel','touchstart','keydown','pointerdown'].forEach(function(ev){addEventListener(ev,skip,{passive:true,once:true})});
var fr=D.fonts&&D.fonts.ready?D.fonts.ready:Promise.resolve();
fr.then(start);setTimeout(start,900);             
fr.then(function(){if(started){build();selfCheck();if(performance.now()>1500)showLive()}});
reveals();clock();
var rt;function relayout(){clearTimeout(rt);rt=setTimeout(function(){if(!started)return;build();if(!tween&&RM)drawn=total},120)}
addEventListener('resize',relayout);
if('ResizeObserver' in window)new ResizeObserver(relayout).observe(D.body);
addEventListener('load',function(){setTimeout(function(){selfCheck();if(started&&performance.now()>1500)showLive()},80)});
})();
