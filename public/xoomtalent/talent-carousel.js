(()=>{
  const showcase=document.querySelector('.talent-showcase');
  if(!showcase)return;
  const cards=[...showcase.querySelectorAll('[data-portrait]')];
  const dots=[...showcase.querySelectorAll('[data-role]')];
  const abilities=[...showcase.querySelectorAll('[data-ability]')];
  const motion=document.querySelector('.motion-toggle');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const roles=[
    {name:'AI engineer',skills:['Workflow automation','Systems integration','AI assistants']},
    {name:'AI solutions specialist',skills:['AI agents','Knowledge systems','Custom integrations']},
    {name:'AI enablement specialist',skills:['Team training','Practical AI adoption','Prompt coaching']}
  ];
  let step=0,index=0,paused=reduced.matches,focused=false,visible=true,timer=null;
  function sync(){
    clearInterval(timer);
    const suspended=paused||reduced.matches||focused||!visible||document.hidden;
    showcase.dataset.suspended=String(suspended);
    document.body.classList.toggle('motion-paused',paused);
    motion.setAttribute('aria-pressed',String(paused));
    motion.setAttribute('aria-label',paused?'Resume specialist carousel':'Pause specialist carousel');
    motion.textContent=paused?'▶':'Ⅱ';
    if(!suspended)timer=setInterval(()=>select(index+1,false),5000);
  }
  function select(target,manual){
    const next=(target+roles.length)%roles.length;
    if(next===index)return;
    let distance=(next-index+roles.length)%roles.length;
    if(distance>1)distance-=roles.length;
    step+=distance;index=next;
    showcase.style.setProperty('--rotation',`${-step*120}deg`);
    showcase.dataset.activeRole=String(index);
    cards.forEach((card,i)=>{card.dataset.active=String(i===index);card.setAttribute('aria-hidden',String(i!==index))});
    dots.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===index)));
    abilities.forEach((label,i)=>label.textContent=roles[index].skills[i]);
    if(manual)showcase.querySelector('#talent-announcement').textContent=roles[index].name+'. '+roles[index].skills.join(', ');
    sync();
  }
  showcase.dataset.activeRole='0';
  dots.forEach(dot=>dot.addEventListener('click',()=>select(Number(dot.dataset.role),true)));
  showcase.querySelectorAll('[data-direction]').forEach(b=>b.addEventListener('click',()=>select(index+Number(b.dataset.direction),true)));
  showcase.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();select(index+(e.key==='ArrowRight'?1:-1),true)}});
  showcase.addEventListener('pointerdown',()=>{focused=false;sync()});
  showcase.addEventListener('focusin',e=>{focused=e.target.matches(':focus-visible');sync()});
  showcase.addEventListener('focusout',e=>{if(!showcase.contains(e.relatedTarget)){focused=false;sync()}});
  motion.addEventListener('click',()=>{paused=!paused;sync()});
  reduced.addEventListener('change',()=>{paused=reduced.matches;sync()});
  document.addEventListener('visibilitychange',sync);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:.15}).observe(showcase);
  sync();
})();
