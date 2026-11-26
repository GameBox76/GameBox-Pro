/* Game Box Pro — shared shell for canvas arcade games.
   GK.start({name,title,icon,sub,hint,a,b, init(), update(dt), draw(g,W,H), down/move/up(x,y,e), key(e), resize(W,H)})
   Helpers: GK.W GK.H GK.top GK.score GK.setScore(n) GK.info(text) GK.end() GK.snd(f,d,type) GK.haptic(ms) */
(function(){
  var $=function(i){return document.getElementById(i)};
  var GK=window.GK={W:0,H:0,top:70,score:0,running:false,paused:false,over:false,dpr:1};
  var cfg,cv,g,last=0,muted=false,hbest;
  try{muted=localStorage.getItem('gbp_muted')==='1'}catch(e){}

  GK.snd=function(f,d,t){if(muted)return;try{GB.snd(f,d||.08,t||'sine')}catch(e){}};
  GK.haptic=function(ms){if(!muted)try{GB.haptic(ms||10)}catch(e){}};
  GK.setScore=function(n){GK.score=n;$('ksc').textContent=n};
  GK.info=function(t){$('kinfo').textContent=t||''};
  GK.best=function(){return GB.get(cfg.name)};

  function sndLabel(){return muted?'🔇 Sound off':'🔊 Sound on'}
  function toggleSound(){muted=!muted;try{localStorage.setItem('gbp_muted',muted?'1':'0')}catch(e){}$('bsnd').textContent=sndLabel();$('kmute').textContent=muted?'🔇':'🔊';GK.snd(660,.08)}

  function fit(){
    GK.dpr=Math.min(2,window.devicePixelRatio||1);GK.W=innerWidth;GK.H=innerHeight;
    cv.width=Math.round(GK.W*GK.dpr);cv.height=Math.round(GK.H*GK.dpr);
    g.setTransform(GK.dpr,0,0,GK.dpr,0,0);
    var pr=document.getElementById('kprobe');if(!pr){pr=document.createElement('div');pr.id='kprobe';pr.style.cssText='position:fixed;visibility:hidden;padding-top:env(safe-area-inset-top,0px)';document.body.appendChild(pr)}GK.top=Math.round(64+(parseFloat(getComputedStyle(pr).paddingTop)||0));
    if(cfg.resize)cfg.resize(GK.W,GK.H);
  }
  function pt(e){var r=cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]}

  function showHome(){
    GK.running=false;GK.paused=false;GK.over=false;GB.hide();
    $('hud').style.display='none';document.body.classList.add('k-home');
    hbest.textContent=GK.best().toLocaleString();$('home').classList.add('on');
  }
  GK.begin=function(){
    GB.hide();$('home').classList.remove('on');document.body.classList.remove('k-home');
    $('hud').style.display='flex';$('kbs').textContent='Best '+GK.best().toLocaleString();
    GK.over=false;GK.paused=false;GK.setScore(0);GK.info('');cfg.init();GK.running=true;last=performance.now();GK.snd(520,.1,'triangle');
  };
  GK.end=function(msg){
    if(GK.over)return;GK.over=true;GK.running=false;
    var nb=GB.best(cfg.name,GK.score);GK.haptic(40);GK.snd(180,.4,'sawtooth');
    $('kbs').textContent='Best '+GK.best().toLocaleString();
    GB.show(nb&&GK.score>0?'New best!':'Game over',(msg?msg+'<br>':'')+'Score <b>'+GK.score.toLocaleString()+'</b> · Best <b>'+GK.best().toLocaleString()+'</b>',
      [['Play again',GK.begin,1],['Home screen',showHome],['Game Box',GB.home]]);
  };
  GK.pause=function(){
    if(!GK.running||GK.over)return;
    if(GK.paused){GK.paused=false;GB.hide();last=performance.now();return}
    GK.paused=true;
    GB.show('Paused','Score <b>'+GK.score.toLocaleString()+'</b>',[['Resume',GK.pause,1],['Restart',GK.begin],['Home screen',showHome]]);
  };

  GK.start=function(c){
    cfg=c;
    document.documentElement.style.setProperty('--k-a',c.a);document.documentElement.style.setProperty('--k-b',c.b);
    document.title=c.title;
    cv=$('c');g=cv.getContext('2d');
    // build UI
    var d=document.createElement('div');
    d.innerHTML=
      '<div id="hud"><div class="kp" id="ksc">0</div><div class="kp" id="kbs">Best 0</div><div class="kp" id="kinfo"></div><div class="sp"></div><button class="kb" id="kmute" aria-label="Sound">'+(muted?'🔇':'🔊')+'</button><button class="kb" id="kpz" aria-label="Pause">❚❚</button></div>'+
      '<section id="home" class="on"><div class="hm"><div class="hm-ico" aria-hidden="true">'+c.icon+'</div><h1 class="hm-title">'+c.title+'</h1><p class="hm-sub">'+c.sub+'</p>'+
      '<div class="hm-best">🏆 Best<b id="hb">0</b></div><button class="hm-play" id="bplay">▶ Play</button>'+
      '<div class="hm-row"><button class="hm-btn" id="bsnd">'+sndLabel()+'</button><a class="hm-btn" href="index.html">‹ Home</a></div><p class="hm-hint">'+c.hint+'</p></div></section>';
    while(d.firstChild)document.body.appendChild(d.firstChild);
    hbest=$('hb');
    $('bplay').onclick=GK.begin;$('bsnd').onclick=toggleSound;$('kmute').onclick=toggleSound;$('kpz').onclick=GK.pause;
    document.body.classList.add('k-home');hbest.textContent=GK.best().toLocaleString();
    fit();addEventListener('resize',fit);addEventListener('orientationchange',function(){setTimeout(fit,200)});
    // input
    var act=function(n){return function(e){if(!GK.running||GK.paused)return;e.preventDefault();var p=pt(e);if(cfg[n])cfg[n](p[0],p[1],e)}};
    cv.addEventListener('pointerdown',function(e){try{cv.setPointerCapture(e.pointerId)}catch(x){}act('down')(e)});
    cv.addEventListener('pointermove',act('move'));cv.addEventListener('pointerup',act('up'));cv.addEventListener('pointercancel',act('up'));
    addEventListener('keydown',function(e){
      if(e.key==='p'||e.key==='P'){GK.pause();return}
      if(e.key===' '&&!GK.running&&$('home').classList.contains('on')){e.preventDefault();GK.begin();return}
      if(GK.running&&!GK.paused&&cfg.onkey)cfg.onkey(e)});
    document.addEventListener('visibilitychange',function(){if(document.hidden&&GK.running&&!GK.paused)GK.pause()});
    window.GBPause=function(){if(GK.running&&!GK.over){GK.pause();return true}if($('home').classList.contains('on'))GB.home();else showHome();return true};
    function frame(t){
      requestAnimationFrame(frame);
      if(!GK.running||GK.paused)return;
      var dt=Math.min(.033,(t-last)/1000);last=t;
      g.setTransform(GK.dpr,0,0,GK.dpr,0,0);
      cfg.update(dt);g.setTransform(GK.dpr,0,0,GK.dpr,0,0);cfg.draw(g,GK.W,GK.H);
    }
    requestAnimationFrame(frame);
  };
})();
