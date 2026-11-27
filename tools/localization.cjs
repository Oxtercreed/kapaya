const {launch,APP}=require('./lib.cjs');
(async()=>{
 const b=await launch({defaultViewport:{width:1440,height:900}}),p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(APP,{waitUntil:'networkidle0'});
 await p.evaluate(()=>localStorage.setItem('kapaya.state',JSON.stringify({cart:[{id:'iphone-15',qty:1,color:'Blue'}],favs:[],orders:[],form:{first:'Alex',last:'Morgan',email:'alex.morgan@example.com',city:'Rotterdam',country:'Netherlands'}})));
 await p.goto(APP+'#/checkout');await p.reload({waitUntil:'networkidle0'});
 let values=await p.evaluate(()=>['first','last','city'].map(n=>document.querySelector('[name='+n+']').value));
 if(JSON.stringify(values)!==JSON.stringify(['B&D','LABS','Dar es Salaam']))throw Error('details '+JSON.stringify(values));
 for(const route of ['home','shop','product/iphone-15','bag','checkout','account','orders','help','chat']){
  await p.goto(APP+'#/'+route);await new Promise(r=>setTimeout(r,100));
  if(await p.$('.crumb, .steps'))throw Error('breadcrumbs '+route);
  if(await p.$eval('.desktop-chat',e=>getComputedStyle(e).display==='none'))throw Error('desktop chat '+route);
 }
 await p.click('.desktop-chat');if(!await p.$('.chat-panel'))throw Error('desktop chat click');
 await p.goto(APP+'#/account');await new Promise(r=>setTimeout(r,100));let account=await p.$eval('.acct',e=>e.innerText);
 if(!account.includes('B&D LABS')||!account.includes('b&dlabs@gmail.com')||!account.includes('Tanzania'))throw Error('account identity');
 await p.goto(APP+'#/home');await new Promise(r=>setTimeout(r,100));if(!await p.$('a[href="mailto:b%26dlabs@gmail.com"]'))throw Error('contact link');
 for(const width of [320,390,767,1440]){
  await p.setViewport({width,height:900});
  const v=await p.evaluate(()=>({noOverflow:document.documentElement.scrollWidth<=innerWidth+1, animated:getComputedStyle(document.querySelector('.band-track')).animationName==='announcement-scroll', label:document.querySelector('.band').getAttribute('aria-label').includes('Free shipping')}));
  if(Object.values(v).some(x=>!x))throw Error('band '+width+': '+JSON.stringify(v));
 }
 const x1=await p.$eval('.band-track',e=>e.getBoundingClientRect().left);await new Promise(r=>setTimeout(r,300));const x2=await p.$eval('.band-track',e=>e.getBoundingClientRect().left);if(!(x2<x1))throw Error('banner not moving');
 await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);if(await p.$eval('.band-track',e=>getComputedStyle(e).animationName)!=='none')throw Error('reduced motion');
 if(errs.length)throw Error(errs.join('|'));console.log('breadcrumb removal, location, migration, contact, desktop chat and banner verified');await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
