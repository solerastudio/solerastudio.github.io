
(function(){var v=document.querySelector('video[data-src]');if(!v)return;
if(!('IntersectionObserver' in window)){v.src=v.dataset.src;v.play&&v.play();return;}
new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){if(!v.src){v.src=v.dataset.src;}v.play().catch(function(){});}else{v.pause();}});},{rootMargin:'200px'}).observe(v);})();
