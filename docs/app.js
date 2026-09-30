const $ = s => document.querySelector(s);
const projects = [
 {title:'Orbit',category:'空间视觉 / 概念探索',discipline:'光影、材质与空间',description:'一个圆环，几种关于空间的想象。镜面折射天空与地面，熟悉的形状在悬浮中获得另一种尺度。这是为作品集制作的概念视觉示例。',credit:'图像：为本网站生成的 AI 概念图。'},
 {title:'Bloom study',category:'视觉研究 / 摄影编排',discipline:'色彩、纹理与构图',description:'从花瓣的秩序中寻找画面的节奏。用裁切与留白重新组织观看路径，让微观纹理成为画面的主角。这是基于图库摄影的视觉编排示例。',credit:'摄影：<a href="https://unsplash.com/photos/L0_lpxyLS0s" target="_blank" rel="noreferrer">Abhijit Sinha / Unsplash</a>。'},
 {title:'Type in motion',category:'字体编排 / 动态设计',discipline:'字体、对比与节奏',description:'让文字的形状参与表达。紧凑的无衬线字体与舒展的斜体形成节奏，把一句话变成可以观看的画面。悬停和滚动，让版式发生细微变化。',credit:'本网站原创字体编排示例，无真实客户关联。'},
 {title:'A little out of line',category:'节奏研究 / 交互实验',discipline:'旋转、重复与停顿',description:'播放、暂停，再来一次。围绕旋转与重复做一次轻盈的动态练习，让一个简单符号在不同节奏里呈现不同的性格。',credit:'本网站原创动态实验示例，无真实客户关联。'}
];
let reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let motionPaused = reduced;
let activeProject = 0, lastFocus, modalScrollY = 0;
const dlg = $('#project-dialog');
document.addEventListener('portfolio:language',()=>{if(dlg.open)populateProject(activeProject);});
function populateProject(i){
 activeProject=i;const p=window.portfolioI18n.project(i,projects[i]);$('#detail-title').textContent=p.title;$('#detail-category').textContent=p.category;$('#detail-description').textContent=p.description;$('#detail-discipline').textContent=p.discipline;$('#detail-credit').innerHTML=p.credit;
 const cover=document.querySelectorAll('.project-cover')[i].cloneNode(true);cover.removeAttribute('data-project');cover.removeAttribute('aria-label');cover.setAttribute('tabindex','-1');cover.querySelector('.cover-action')?.remove();
 const visual=$('#detail-visual');visual.replaceChildren(...(i<2?[cover.querySelector('img')]:[cover]));
}
function openProject(i,source){
 lastFocus=document.activeElement;populateProject(i);const rect=source.getBoundingClientRect();modalScrollY=window.scrollY;dlg.showModal();document.body.style.position='fixed';document.body.style.top=`-${modalScrollY}px`;document.body.style.width='100%';document.body.style.overflow='hidden';
 if(window.gsap&&!reduced){const target=$('#detail-visual').getBoundingClientRect();gsap.fromTo('#detail-visual',{x:rect.left-target.left,y:rect.top-target.top,scaleX:rect.width/target.width,scaleY:rect.height/target.height,transformOrigin:'0 0',opacity:.5},{x:0,y:0,scaleX:1,scaleY:1,opacity:1,duration:.7,ease:'power3.inOut',clearProps:'transform,opacity'});gsap.fromTo('.detail-copy',{y:30,opacity:0},{y:0,opacity:1,duration:.55,delay:.2,clearProps:'transform,opacity'});}
 $('#close-detail').focus({preventScroll:true});
}
function closeProject(){dlg.close();document.body.style.position='';document.body.style.top='';document.body.style.width='';document.body.style.overflow='';window.scrollTo({top:modalScrollY,behavior:'instant'});lastFocus?.focus({preventScroll:true});}
$('#close-detail').addEventListener('click',closeProject);dlg.addEventListener('cancel',e=>{e.preventDefault();closeProject()});dlg.addEventListener('click',e=>{if(e.target===dlg)closeProject()});
$('#next-project').addEventListener('click',()=>{populateProject((activeProject+1)%4);dlg.scrollTop=0;if(window.gsap&&!reduced)gsap.fromTo('#detail-visual',{opacity:.2},{opacity:1,duration:.5});});
$('#credits-button').onclick=()=>$('#credits-dialog').showModal();

document.querySelectorAll('[data-project]').forEach(el=>el.addEventListener('click',e=>{openProject(Number(el.dataset.project),el);}));
if(window.gsap&&window.ScrollTrigger){
 gsap.registerPlugin(ScrollTrigger);
 const orbit=$('#orbit'),stage=$('.orbit-stage');
 const state={auto:0,scroll:0,drag:0,tilt:0};let down=false;
 const render=()=>gsap.set(orbit,{rotationY:-25+state.auto+state.scroll+state.drag,rotationX:-15+state.tilt});
 const motionButton=$('#motion-toggle');function syncMotion(){motionButton.textContent=window.portfolioI18n.text(motionPaused?'play':'pause');motionButton.setAttribute('aria-pressed',String(motionPaused));}syncMotion();
 document.addEventListener('portfolio:language',syncMotion);
 motionButton.onclick=()=>{motionPaused=!motionPaused;syncMotion();};
 gsap.ticker.add((time,delta)=>{if(!motionPaused&&!reduced&&!down&&!dlg.open&&window.scrollY<window.innerHeight*1.4&&!document.hidden){state.auto+=Math.min(delta,40)*.002;render();}});
 function rotate(amount){gsap.to(state,{drag:state.drag+amount,duration:reduced?0:.9,ease:'power3.out',onUpdate:render});}
 $('#rotate-prev').onclick=()=>rotate(-60);$('#rotate-next').onclick=()=>rotate(60);
 bindGalleryGestures(stage, {
  getAngle:()=>state.drag,
  start:()=>{down=true;gsap.killTweensOf(state,'drag');},
  change:angle=>{state.drag=angle;render();},
  finish:momentum=>{down=false;if(momentum&&!reduced)rotate(momentum);}
 });
 stage.addEventListener('dragstart',e=>e.preventDefault());
 const mm=gsap.matchMedia();mm.add('(prefers-reduced-motion: no-preference)',()=>{
  gsap.from('.hero-heading h1',{opacity:0,y:35,duration:1.1,ease:'power3.out'});
  const isDesktop=window.innerWidth>700;
  const heroTl=gsap.timeline({paused:true});
  heroTl.fromTo(state,{scroll:0,tilt:0},{scroll:220,tilt:24,duration:1,ease:'none',onUpdate:render},0).fromTo('.hero-heading',{y:0,opacity:1},{y:-90,opacity:0,duration:.6,ease:'none'},0).fromTo('.orbit-stage',{scale:1,y:0,rotation:0},{scale:isDesktop?1.22:1.05,y:isDesktop?-60:-35,rotation:-8,duration:1,ease:'none'},0);
  const updateHero=()=>{const distance=window.innerWidth>700?950:450;const progress=Math.max(0,Math.min(1,window.scrollY/distance));heroTl.progress(progress);};
  window.addEventListener('scroll',updateHero,{passive:true});window.addEventListener('resize',updateHero);updateHero();
  document.querySelectorAll('.project').forEach((p,i)=>{gsap.fromTo(p.querySelector('.project-cover'),{y:35,rotation:i%2?3:-3},{y:0,rotation:0,ease:'none',scrollTrigger:{trigger:p,start:'top 95%',end:'top 35%',scrub:1}});});
  gsap.to('.about-star',{rotation:150,ease:'none',scrollTrigger:{trigger:'.about',start:'top bottom',end:'bottom top',scrub:1}});
  gsap.to('.play-symbol',{rotation:120,ease:'none',scrollTrigger:{trigger:'.project-d',start:'top bottom',end:'bottom top',scrub:1}});
  return ()=>{window.removeEventListener('scroll',updateHero);window.removeEventListener('resize',updateHero);};
 });
 matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{reduced=e.matches;motionPaused=reduced;syncMotion();render();});
 document.fonts.ready.then(()=>ScrollTrigger.refresh());window.addEventListener('load',()=>ScrollTrigger.refresh());
 // Navigate around pinned sections using their final document position.
 document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=document.querySelector(a.getAttribute('href'));if(!target)return;e.preventDefault();const y=target.id==='top'?0:target.getBoundingClientRect().top+window.scrollY-40;window.scrollTo({top:Math.max(0,y),behavior:reduced?'instant':'smooth'});history.replaceState(null,'',a.getAttribute('href'));}));
}
