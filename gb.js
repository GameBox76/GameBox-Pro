/* Game Box Pro shared helper */
(function(){
  // Public API. Games report scores explicitly: GB.best('Snake', 120)  (higher is better)
  // For lower-is-better scores:  GB.best('Reaction Test', 245, {lower:true, unit:' ms'})
  window.GB={
    best:function(t,n,o){o=o||{};n=+n;if(!isFinite(n))return false;
      try{var k='gbp_best_'+t,old=localStorage.getItem(k),cur=old===null?null:+JSON.parse(old);
        if(o.lower||o.unit)localStorage.setItem('gbp_meta_'+t,JSON.stringify({lower:!!o.lower,unit:o.unit||''}));
        var better=cur===null||isNaN(cur)||(o.lower?n<cur:n>cur);
        if(better){localStorage.setItem(k,JSON.stringify(n));return true}}catch(e){}return false},
    home:function(){location.href='index.html'},
    haptic:function(ms){try{navigator.vibrate&&navigator.vibrate(ms||10)}catch(e){}}
  };
  var f=document.createElement('link');f.rel='stylesheet';f.href='https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap';document.head.appendChild(f);
  try{document.documentElement.dataset.theme=JSON.parse(localStorage.getItem('gbp_theme')||'"blue"')}catch(e){}
  // Audio: resume every AudioContext on first touch (mobile autoplay rules)
  var AC=window.AudioContext||window.webkitAudioContext,ctxs=[];
  if(AC){var Wr=function(o){var c=new AC(o);ctxs.push(c);return c};Wr.prototype=AC.prototype;window.AudioContext=Wr;if(window.webkitAudioContext)window.webkitAudioContext=Wr;
    var wake=function(){ctxs.forEach(function(c){if(c.state==='suspended')c.resume().catch(function(){})})};
    ['pointerdown','touchstart','keydown','click'].forEach(function(ev){addEventListener(ev,wake,{passive:true})});
    document.addEventListener('visibilitychange',function(){if(!document.hidden)wake()})}
  // Pause sheet: phone Back button or Esc. A game can handle it itself by defining window.GBPause.
  function sheet(){
    if(window.GBPause&&window.GBPause()!==false)return;
    var o=document.getElementById('gb-sheet');if(o){o.remove();return}
    var d=document.createElement('div');d.id='gb-sheet';d.innerHTML='<div><h2>Paused</h2><button class="gb-primary" data-a="r">Resume</button><button data-a="x">Restart</button><button data-a="h">Home</button></div>';
    d.onclick=function(e){var a=e.target.getAttribute&&e.target.getAttribute('data-a');if(a==='h')GB.home();else if(a==='x')location.reload();else if(a==='r'||e.target===d)d.remove()};
    document.body.appendChild(d)}
  document.addEventListener('backbutton',sheet,false);
  addEventListener('keydown',function(e){if(e.key==='Escape')sheet()});
  // Start screens: style the main button and add a Home link under it
  function inject(){
    if(document.documentElement.hasAttribute('data-gb-own'))return;
    var bs=document.querySelectorAll('button,.btn');
    for(var i=0;i<bs.length;i++){var b=bs[i];
      if(b.closest('#gb-sheet')||!b.offsetParent||!/^\s*(start|play|take flight|enter game|begin)/i.test(b.textContent))continue;
      b.classList.add('gb-primary');
      var a=document.createElement('a');a.href='index.html';a.className='gb-menu-home';a.textContent='‹ Home';b.insertAdjacentElement('afterend',a);return}}
  addEventListener('load',function(){setTimeout(inject,400)});
})();
/* Shared game helpers: overlay card, best score, sound */
GB.show=function(t,s,bs){var o=document.getElementById('gb-ov');if(!o){o=document.createElement('div');o.id='gb-ov';document.body.appendChild(o)}o.innerHTML='<div class="gb-card"><h1>'+t+'</h1><p>'+s+'</p></div>';var c=o.firstChild;bs.forEach(function(b){var e=document.createElement('button');e.textContent=b[0];if(b[2])e.className='p';e.onclick=b[1];c.appendChild(e)});o.style.display='grid'};
GB.hide=function(){var o=document.getElementById('gb-ov');if(o)o.style.display='none'};
GB.get=function(t){try{return +JSON.parse(localStorage.getItem('gbp_best_'+t))||0}catch(e){return 0}};
GB.snd=function(f,d,ty){try{var A=window.AudioContext||window.webkitAudioContext;GB._a=GB._a||new A();var a=GB._a,o=a.createOscillator(),v=a.createGain(),t=a.currentTime;o.type=ty||'sine';o.frequency.setValueAtTime(f,t);v.gain.setValueAtTime(.08,t);v.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(v);v.connect(a.destination);o.start();o.stop(t+d)}catch(e){}};
