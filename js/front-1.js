
(function(){var d=document.documentElement;d.classList.add('js','booting');

setTimeout(function(){if(d.classList.contains('ready'))return;d.classList.add('ready');d.classList.remove('booting');if(document.body)document.body.classList.remove('booting');var b=document.getElementById('boot');if(b)b.style.display='none';['s1','s2'].forEach(function(i){var e=document.getElementById(i);if(e)e.classList.add('on')})},4500);
if(!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('pre');})();
