/* Game Box Pro v8 — themed start-screen scenes. Builds one scene per game and shows it only while that game's start screen is visible. */
(function(){
  var K=(location.pathname.split('/').pop()||'').replace('.html','');
  var HOST={'2048':['#home'],candy:['#home'],car:['#s-home'],card:['#ovHome'],chess:['#home'],fruit:['#home'],ludo:['#lhome','#setup'],reaction:['#home'],ship:['#home'],snake:['#menu'],brick:['#home'],stack:['#home'],runner:['#home'],bubble:['#home'],tic:['#home']};
  if(!HOST[K])return;

  function fl(txt,x,y,sz,t,d,extra){return '<i class="fl'+(extra?' '+extra:'')+'" style="left:'+x+'%;top:'+y+'%;font-size:'+sz+'px;--t:'+t+'s;--d:-'+d+'s">'+txt+'</i>'}
  function many(list){return list.map(function(a){return fl.apply(null,a)}).join('')}

  var S={
    snake:function(){var seg='';for(var i=0;i<9;i++)seg+='<b style="animation-delay:-'+(i*.14).toFixed(2)+'s"></b>';
      return '<s class="gx"></s><i class="sk">'+seg+'</i><i class="sk sk2">'+seg+'</i><u class="ap fl">🍎</u>'},
    ship:function(){var al='';[['👾',14,16],['👽',72,10],['👾',40,28],['🛸',82,30]].forEach(function(a,i){al+='<u class="al" style="left:'+a[1]+'%;top:'+a[2]+'%;animation-delay:-'+i*.7+'s">'+a[0]+'</u>'});
      return '<s class="st"></s><s class="st st2"></s><s class="pl"></s>'+al+'<u class="ls"></u><u class="ls" style="animation-delay:-.55s"></u><u class="sp">🚀</u>'},
    car:function(){return '<s class="sun"></s><s class="gl"></s><s class="rd"></s><s class="ln"></s>'},
    candy:function(){return '<s class="dt"></s>'+many([['🍬',8,12,46,6,0],['🍭',74,8,56,7,2],['🍩',82,44,44,8,1],['🍒',6,50,40,6.5,3],['🧁',60,72,48,7.5,4],['🍫',14,78,42,9,2],['🍓',44,6,36,6,5]])},
    card:function(){var c='';[[-16,-9,8,10],[-2,2,34,16],[12,10,60,22]].forEach(function(a,i){c+='<s class="cd" style="left:'+a[2]+'%;top:'+a[3]+'%;--a0:'+(a[0]-4)+'deg;--a1:'+(a[1]+6)+'deg;animation-delay:-'+i*1.4+'s;margin-left:-37px"></s>'});
      var sp='';for(var i=0;i<14;i++)sp+='<s class="sp" style="left:'+(5+i*7%90)+'%;top:'+(8+i*13%80)+'%;--d:-'+(i*.37).toFixed(2)+'s"></s>';return c+sp},
    chess:function(){return '<s class="bd"></s>'+many([['♞',-4,10,150,9,0,'pc'],['♛',64,6,130,11,3,'pc'],['♜',70,52,110,10,5,'pc'],['♝',4,52,100,12,2,'pc']])},
    fruit:function(){return '<s class="sl" style="top:22%;--d:0s"></s><s class="sl" style="top:52%;--r:20deg;--d:-1.8s"></s><s class="sl" style="top:78%;--r:-14deg;--d:-3s"></s>'+many([['🍉',6,10,60,6,0],['🍊',76,14,52,7,1],['🍍',70,66,58,8,2],['🍓',8,66,46,6.5,3],['🥝',46,86,40,7,4],['🍋',40,4,42,6,2]])},
    ludo:function(){return '<s class="q q1"></s><s class="q q2"></s><s class="q q3"></s><s class="q q4"></s>'+
      [['#ff4d5a',10,10,0],['#3ddc84',80,12,1.2],['#3b82ff',12,80,2.1],['#ffd23f',78,78,.6]].map(function(a){return '<i class="tk" style="left:'+a[1]+'%;top:'+a[2]+'%;--c:'+a[0]+';--d:-'+a[3]+'s"></i>'}).join('')+many([['🎲',74,14,56,6,0],['🎲',6,82,40,7,3]])},
    reaction:function(){return '<s class="rg"></s><s class="rg" style="--d:-1s"></s><s class="rg" style="--d:-2s"></s>'+many([['⚡',10,70,56,3,0],['⚡',78,80,44,4,2],['⏱️',74,8,48,6,1]])},
    tic:function(){return '<s class="hs"></s>'+'<i class="xo fl" style="left:4%;top:6%;color:#ff4f8c;text-shadow:0 0 24px #ff4f8c;--t:8s">X</i><i class="xo fl" style="right:6%;top:58%;color:#22e1ff;text-shadow:0 0 24px #22e1ff;--t:9s;--d:-3s">O</i><i class="xo fl" style="left:8%;bottom:4%;font-size:70px;color:#ff4f8c;opacity:.5;text-shadow:0 0 18px #ff4f8c;--t:7s;--d:-1s">X</i><i class="xo fl" style="right:8%;top:2%;font-size:76px;color:#22e1ff;opacity:.5;text-shadow:0 0 18px #22e1ff;--t:6s;--d:-4s">O</i>'},
    brick:function(){var b='',cols=['#ff5f6d','#ff9a3d','#ffd23f','#34e6a0','#22e1ff','#6c8cff'];for(var r=0;r<5;r++)for(var c=0;c<8;c++){if((r*7+c*3)%5===0)continue;b+='<s class="bk" style="left:'+(2+c*12.2)+'%;top:'+(4+r*4.4)+'%;background:'+cols[(r+c)%6]+';animation-delay:-'+((r+c)*.25).toFixed(2)+'s"></s>'}
      return b+'<s class="bl"></s><s class="pd2"></s>'},
    stack:function(){var o='<s class="stg"></s>',w=[62,54,58,46,50];for(var i=0;i<w.length;i++)o+='<s class="sb" style="bottom:'+(i*26)+'px;width:'+w[i]+'%;left:'+(50-w[i]/2+((i%2)?3:-3))+'%;background:'+['#ff9ebb','#9b6a47','#ffe8a3','#a6ecd0','#c3adff'][i]+';animation-delay:-'+(i*.5)+'s"></s>';return o},
    runner:function(){return '<s class="sun"></s><s class="rd"></s><s class="ln"></s><s class="gl"></s>'+many([['🌆',-6,8,0,0,0]]).replace(/.*/,'')+'<i class="rn">🏃</i>'},
    bubble:function(){var o='',cs=['#ff5f6d','#ffd23f','#34e6a0','#22a7ff','#c04bff','#ff9a3d'];for(var i=0;i<16;i++){var sz=30+(i*17)%44;o+='<s class="bb" style="left:'+((i*37)%92)+'%;width:'+sz+'px;height:'+sz+'px;--c:'+cs[i%6]+';animation-duration:'+(9+(i%5)*2)+'s;animation-delay:-'+(i*1.3)+'s"></s>'}return o},
    '2048':function(){var C={2:'#6c8cff',4:'#22e1ff',8:'#ff4f8c',16:'#ff9a3d',32:'#ff5f6d',64:'#c04bff',128:'#ffd23f',256:'#34e6a0'},o='',p=[[6,10],[70,6],[82,40],[4,46],[48,84],[16,74],[72,76],[38,4]],k=Object.keys(C);
      p.forEach(function(a,i){o+='<s class="tl" style="left:'+a[0]+'%;top:'+a[1]+'%;--c:'+C[k[i]]+';--t:'+(6+i%4)+'s;--d:-'+i*.9+'s">'+k[i]+'</s>'});return o}
  };

  var sc;
  function hostVisible(sel){var h=document.querySelector(sel);if(!h||h.hidden)return false;var c=getComputedStyle(h);if(c.display==='none'||c.visibility==='hidden'||+c.opacity<.05)return false;var r=h.getBoundingClientRect();return r.width>0&&r.height>0}
  function sync(){if(!sc)return;var v=HOST[K].some(hostVisible);sc.classList.toggle('on',v);document.body.classList.toggle('gbh-on',v)}
  function mount(){
    if(sc||!document.body)return;
    sc=document.createElement('div');sc.className='gbh-scene gbh-'+K;sc.setAttribute('aria-hidden','true');sc.innerHTML=S[K]();
    document.body.insertBefore(sc,document.body.firstChild);document.body.classList.add('gbh-b');
    document.documentElement.classList.add('gbh-has');document.documentElement.setAttribute('data-gbh',K);
    try{new MutationObserver(function(){requestAnimationFrame(sync)}).observe(document.body,{attributes:true,subtree:true,attributeFilter:['class','style','hidden']})}catch(e){}
    setInterval(sync,500);sync();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
