const book=document.querySelector('#book'),answer=document.querySelector('#answer'),again=document.querySelector('#again'),hint=document.querySelector('#hint'),page=document.querySelector('#page');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let opened=false,running=false,index=-1,nextFlip=0,loop=0;
function showPage(){answer.textContent=answers[index];page.textContent=String(index+1).padStart(3,'0')+' / '+answers.length;}
function clearLeaves(){book.querySelectorAll('.leaf').forEach(leaf=>{leaf.getAnimations().forEach(a=>a.cancel());leaf.remove()});}
function turnPage(){index=(index+1)%answers.length;showPage();if(reduced)return;const leaf=document.createElement('div');leaf.className='leaf';leaf.innerHTML='<div class="leaf-face">✧</div><div class="leaf-face leaf-back">✧</div>';book.append(leaf);const anim=leaf.animate([{transform:'rotateY(0deg)'},{transform:'rotateY(-180deg)'}],{duration:900,easing:'cubic-bezier(.3,.1,.25,1)',fill:'forwards'});anim.finished.then(()=>leaf.remove()).catch(()=>leaf.remove());}
function tick(now){loop=0;if(!opened||!running)return;if(now>=nextFlip){book.classList.add('flipping');turnPage();nextFlip=now+650;}loop=requestAnimationFrame(tick);}
function resume(initial=false){running=true;nextFlip=performance.now();book.classList.add('flipping');hint.textContent='书页自动流转 · 轻点书本，留住这一页';book.setAttribute('aria-label','正在自动循环翻页，点击或按空格暂停');answer.setAttribute('aria-live','off');if(!loop)loop=requestAnimationFrame(tick);}
function pause(){running=false;cancelAnimationFrame(loop);loop=0;clearLeaves();if(index<0)index=0;book.classList.remove('flipping');answer.setAttribute('aria-live','polite');showPage();hint.textContent='这一页，为你停留 · 再点一下，继续翻页';book.setAttribute('aria-label','翻页已暂停，点击或按空格继续');}
function openBook(){if(opened)return;opened=true;index=-1;answer.textContent='请翻开你的答案';page.textContent='在心中默念问题 · 再点一下开始翻页';book.classList.add('open');book.style.setProperty('--angle','-180deg');book.setAttribute('aria-expanded','true');again.hidden=false;running=false;book.classList.remove('flipping');hint.textContent='在心中默念问题 · 再点一下，开始翻页';book.setAttribute('aria-label','书已打开，点击或按空格开始翻页');}
function toggle(){if(!opened)openBook();else if(running)pause();else resume();}
book.addEventListener('click',toggle);
book.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();if(!e.repeat)toggle();}});
again.addEventListener('click',()=>{running=false;opened=false;index=-1;cancelAnimationFrame(loop);loop=0;clearLeaves();book.classList.remove('open','flipping');book.style.setProperty('--angle','0deg');book.setAttribute('aria-expanded','false');book.setAttribute('aria-label','点击打开此页有回音');again.hidden=true;answer.setAttribute('aria-live','polite');hint.textContent='轻点书本，翻开你的答案';document.querySelector('#question').focus();});
document.querySelector('#question').addEventListener('keydown',e=>{if(e.key==='Enter'&&!opened)openBook();});


