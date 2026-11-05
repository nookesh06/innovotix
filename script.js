(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // The rover is one rigid SVG character. Animate only its outer wrapper;
  // never rotate or translate arms, wheels, head, or other body parts separately.
  const gsapReady = () => typeof window.gsap !== 'undefined';
  if (gsapReady()) document.documentElement.classList.add('has-gsap');

  function setupRover(stageSelector, roverSelector) {
    const stage = $(stageSelector), rover = $(roverSelector);
    if (!stage || !rover) return;
    const svg = $('svg.rover-svg', rover);
    let active = false;
    let moveToX = null, moveToY = null;

    const maxTravel = () => {
      const bounds = stage.getBoundingClientRect();
      const bot = rover.getBoundingClientRect();
      return {
        x: Math.max(0, (bounds.width - bot.width) / 2 - 14),
        y: Math.max(0, (bounds.height - bot.height) / 2 - 20)
      };
    };

    const resetPosition = () => {
      if (gsapReady()) {
        gsap.to(rover, { x: 0, y: 0, duration: .65, ease: 'power3.out', overwrite: true });
      } else {
        rover.style.setProperty('--rover-x', '0px');
        rover.style.setProperty('--rover-y', '0px');
      }
    };

    const toggle = () => {
      active = !active;
      stage.classList.toggle('rover-active', active);
      rover.setAttribute('aria-pressed', String(active));
      rover.setAttribute('aria-label', active
        ? 'Rover cursor-follow mode is active. Click to stop.'
        : 'Click to activate rover cursor-follow mode.');
      if (gsapReady() && svg) {
        gsap.to(svg, {
          scale: active ? 1.035 : 1,
          rotate: active ? 1.5 : 0,
          duration: .38,
          ease: 'power2.out',
          transformOrigin: '50% 55%',
          overwrite: true
        });
      }
      if (!active) resetPosition();
    };

    rover.addEventListener('click', toggle);
    rover.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle();
      }
    });

    if (gsapReady()) {
      moveToX = gsap.quickTo(rover, 'x', { duration: .48, ease: 'power3.out' });
      moveToY = gsap.quickTo(rover, 'y', { duration: .48, ease: 'power3.out' });
    }

    stage.addEventListener('pointermove', event => {
      if (!active || event.pointerType === 'touch') return;
      const rect = stage.getBoundingClientRect();
      const limit = maxTravel();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const x = Math.max(-limit.x, Math.min(limit.x, dx * .30));
      const y = Math.max(-limit.y, Math.min(limit.y, dy * .22));
      if (moveToX && moveToY) {
        moveToX(x);
        moveToY(y);
      } else {
        rover.style.setProperty('--rover-x', `${x}px`);
        rover.style.setProperty('--rover-y', `${y}px`);
      }
    });

    stage.addEventListener('pointerleave', () => {
      if (active) resetPosition();
    });

    // Gentle whole-character float; no individual SVG part is transformed.
    if (!reduced && gsapReady() && svg) {
      gsap.to(svg, {
        y: -7, duration: 2.8, repeat: -1, yoyo: true,
        ease: 'sine.inOut', transformOrigin: '50% 55%'
      });
    }
  }

  if (gsapReady() && !reduced) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.hero-copy > *',{y:24,opacity:0,duration:.75,stagger:.09,ease:'power3.out',delay:.12});
    gsap.from('.hero-stage',{y:25,opacity:0,duration:1,ease:'power3.out',delay:.2});
    $$('.section-heading,.about-copy,.experience-copy,.service-list article,.kit-card,.system-grid article,.process-grid article,.partner-feature').forEach(el=>{
      gsap.from(el,{y:24,opacity:0,duration:.7,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}});
    });
    // Robot motifs animate into view throughout the homepage, not only in the hero.
    $$('.service-robot-icon,.about-bot-signal,.gallery-bot-orbit,.contact-bot-icon').forEach((el,i)=>{
      gsap.from(el,{scale:.55,opacity:0,rotate:i%2? -18:18,duration:.8,ease:'back.out(1.8)',
        scrollTrigger:{trigger:el,start:'top 92%',once:true}});
    });
    $$('.about-visual,.event-image,.experience-gallery figure').forEach(el=>{
      gsap.from(el,{y:32,opacity:0,duration:.85,ease:'power2.out',
        scrollTrigger:{trigger:el,start:'top 90%',once:true}});
    });
  }
  if (gsapReady() && !reduced && $('#roboticsRover')) { gsap.to('#roboticsRover', { y:-8, duration:3.2, repeat:-1, yoyo:true, ease:'sine.inOut' }); }

  // Mobile navigation.
  const menu = $('.menu-toggle'), nav = $('.main-nav');
  if(menu && nav) menu.addEventListener('click',()=>nav.classList.toggle('is-open'));
  $$('.main-nav a').forEach(a=>a.addEventListener('click',()=>nav?.classList.remove('is-open')));
  $$('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

  // Lighting room scene and physical-light mock controls.
  const room = $('#roomScene');
  if (room) {
    const state = {ceiling:72,lamp:48,accent:true,ceilingOn:true,lampOn:true,scene:'evening'};
    const scenes = {
      daylight:{name:'DAYLIGHT / CLEAR & BRIGHT',ceiling:95,lamp:0,accent:false,overlay:'rgba(255,248,218,.24)'},
      evening:{name:'EVENING / WIND DOWN',ceiling:72,lamp:48,accent:true,overlay:'rgba(242,177,102,.16)'},
      movie:{name:'MOVIE / IMMERSIVE',ceiling:12,lamp:18,accent:true,overlay:'rgba(53,73,160,.25)'},
      night:{name:'NIGHT / LOW GLOW',ceiling:0,lamp:12,accent:false,overlay:'rgba(33,55,105,.34)'}
    };
    function applyLighting(){
      const c = state.ceilingOn ? state.ceiling/100 : 0, l = state.lampOn ? state.lamp/100 : 0;
      room.style.setProperty('--ceiling-intensity',c);
      room.style.setProperty('--lamp-intensity',l);
      room.style.setProperty('--accent-intensity',state.accent?1:0);
      $$('.ceiling-fixture i',room).forEach(el=>{el.style.opacity=String(c);el.style.filter=`brightness(${.35+c*1.5})`;el.style.boxShadow=`0 0 ${8+c*34}px ${3+c*14}px rgba(255,230,170,${c*.68})`;});
      const shade=$('.lamp-shade',room); if(shade){shade.style.opacity=String(Math.max(.22,l));shade.style.filter=`brightness(${.45+l*1.7}) drop-shadow(0 0 ${l*28}px rgba(255,216,143,${l}))`;}
      $$('.room-light-pool',room).forEach((el,i)=>{const v=[c,l,state.accent?c*.7:0][i];el.style.opacity=String(v);});
      room.style.setProperty('--scene-overlay',scenes[state.scene].overlay || 'rgba(0,0,0,0)');
      const ceilingRange=$('#ceilingBrightness'),lampRange=$('#lampBrightness');
      if(ceilingRange) ceilingRange.value=state.ceiling; if(lampRange) lampRange.value=state.lamp;
      const cv=$('#ceilingValue'),lv=$('#lampValue'); if(cv)cv.textContent=`${state.ceilingOn?state.ceiling:0}%`;if(lv)lv.textContent=`${state.lampOn?state.lamp:0}%`;
      $$('[data-light-toggle]').forEach(btn=>{const key=btn.dataset.lightToggle,on=key==='ceiling'?state.ceilingOn:key==='lamp'?state.lampOn:state.accent;btn.classList.toggle('is-on',on);btn.setAttribute('aria-pressed',String(on));});
    }
    $$('[data-scene-choice]').forEach(btn=>btn.addEventListener('click',()=>{
      const name=btn.dataset.sceneChoice, scene=scenes[name];if(!scene)return;
      state.scene=name;state.ceiling=scene.ceiling;state.lamp=scene.lamp;state.accent=scene.accent;state.ceilingOn=scene.ceiling>0;state.lampOn=scene.lamp>0;
      room.dataset.scene=name;$('#sceneName').textContent=scene.name;
      $$('[data-scene-choice]').forEach(b=>b.classList.toggle('active',b===btn));applyLighting();
    }));
    $$('[data-light-toggle]').forEach(btn=>btn.addEventListener('click',()=>{const key=btn.dataset.lightToggle;if(key==='ceiling')state.ceilingOn=!state.ceilingOn;else if(key==='lamp')state.lampOn=!state.lampOn;else state.accent=!state.accent;applyLighting();}));
    $$('[data-light-range]').forEach(range=>range.addEventListener('input',()=>{const key=range.dataset.lightRange;state[key]=Number(range.value);if(key==='ceiling')state.ceilingOn=state.ceiling>0;else state.lampOn=state.lamp>0;applyLighting();}));
    applyLighting();
  }

  // Enquiry modal and secure backend submission. No wa.me redirect is used.
  const modal=$('#enquiryModal');
  const openModal=(interest)=>{if(!modal)return;modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');const select=$('select[name="interest"]',modal);if(select&&interest){const option=[...select.options].find(o=>o.text.toLowerCase()===interest.toLowerCase())||[...select.options].find(o=>interest.toLowerCase().includes(o.text.toLowerCase()));if(option)select.value=option.value;}const first=$('input[name="name"]',modal);setTimeout(()=>first?.focus(),80);};
  const closeModal=()=>{modal?.classList.remove('is-open');modal?.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');};
  $$('.open-enquiry').forEach(btn=>btn.addEventListener('click',()=>openModal(btn.dataset.interest||'')));
  $$('[data-close-modal]').forEach(btn=>btn.addEventListener('click',closeModal));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
  $$('[data-enquiry-form]').forEach(form=>form.addEventListener('submit',async e=>{
    e.preventDefault();const feedback=$('.form-feedback',form),submit=$('button[type="submit"]',form);if(!form.reportValidity())return;
    const data=Object.fromEntries(new FormData(form).entries());data.consent=!!form.querySelector('[name="consent"]')?.checked;
    if(!data.consent){feedback.textContent='Please provide consent before sending.';return;}
    submit.disabled=true;submit.textContent='Sending…';feedback.textContent='';
    try{
      const response=await fetch('/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      const result=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(result.message||'The enquiry could not be sent. Please call or email Innovotix.');
      feedback.textContent='Your enquiry has been sent to Innovotix. Thank you.';form.reset();
    }catch(err){feedback.textContent=err.message.includes('Failed to fetch')?'The enquiry service is not connected yet. Please call +91 834 095 2438 or email innovotix016@gmail.com.':err.message;}
    finally{submit.disabled=false;submit.innerHTML='Send enquiry <span>↗</span>';}
  }));
  // The homepage uses a static mecanum-wheel robot image. No scroll-linked robot animation.

  // The biped completes its journey by arriving beside the Robotics lab platform.
  const roboticsBiped = $('.robotics-biped-arrival');
  if (roboticsBiped) {
    let arrivedFromHome = false;
    try { arrivedFromHome = sessionStorage.getItem('innovotix-robot-docked') === '1'; sessionStorage.removeItem('innovotix-robot-docked'); } catch (_) {}
    document.body.classList.add('robotics-robot-arrival-ready');
    if (window.gsap && !reduced) {
      gsap.fromTo(roboticsBiped,
        { x: arrivedFromHome ? -window.innerWidth * .45 : 90, y: 22, scale: arrivedFromHome ? .78 : .9, opacity: 0 },
        { x: 0, y: 0, scale: 1, opacity: 1, duration: arrivedFromHome ? 1.45 : 1.05,
          delay: arrivedFromHome ? .08 : .2, ease: 'power3.out', onComplete: () => roboticsBiped.classList.add('is-docked') });
    } else {
      roboticsBiped.style.opacity = '1';
      roboticsBiped.classList.add('is-docked');
    }
  }

})();
