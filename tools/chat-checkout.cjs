const {launch,APP}=require('./lib.cjs');
(async()=>{
 const b=await launch({defaultViewport:{width:390,height:844}}),p=await b.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(APP,{waitUntil:'networkidle0'});await p.evaluate(()=>localStorage.setItem('kapaya.state',JSON.stringify({cart:[{id:'iphone-15',qty:1,color:'Blue',storage:'128GB'}],favs:[],orders:[]})));
 await p.goto(APP+'#/checkout',{waitUntil:'networkidle0'});await p.reload({waitUntil:'networkidle0'});
 for(const width of [320,390,767,1440]){
  await p.setViewport({width,height:844});
  const state=await p.evaluate(()=>({fits:document.documentElement.scrollWidth<=innerWidth+1, noSteps:!document.querySelector('.steps'), shipping:!!document.querySelector('[name=first]')&&!!document.querySelector('[name=last]')&&!!document.querySelector('[name=city]'),noContact:!document.querySelector('[name=email]'),noPromo:!document.querySelector('.checkout-page [data-promo]'),demo:document.querySelector('.checkout-page').innerText.includes('Demo')}));
  if(Object.values(state).some(x=>!x))throw Error('checkout '+width+' '+JSON.stringify(state));
 }
 await p.setViewport({width:390,height:844});await p.$eval('.btn-pay', e=>e.click());
 if (!await p.$('.done-hero') || await p.$('.track-card, .way-card') || !p.url().endsWith('#/confirmed')) throw Error('checkout confirmation');
 await p.$eval('.done-actions [data-go=account]',e=>e.click());
 if (!await p.$('.orders-page .order-status') || !await p.$('.orders-page .order-items')) throw Error('order sections missing');
 await p.reload({waitUntil:'networkidle0'});if(!await p.$('.orders-page .order-items'))throw Error('order did not persist');
 await p.click('[data-mobile-route="chat"]');
 if(!await p.$eval('[data-mobile-route="chat"]',e=>e.getAttribute('aria-current')==='page'))throw Error('chat active');
 await p.type('#chat-message','<b>hello</b>');await p.$eval('[data-chat-form]',e=>e.requestSubmit());
 if(await p.$eval('.chat-sent',e=>e.textContent)!=='<b>hello</b>' || await p.$('.chat-sent b'))throw Error('chat escaping');
 if(!await p.$eval('.chat-notice',e=>e.textContent.includes('not sent')))throw Error('demo disclosure');
 await p.screenshot({path:'/tmp/kapaya-chat.png',fullPage:true});
 await p.click('[data-mobile-route="home"]');if(!await p.$('.hero-home'))throw Error('landing route');
 await p.click('[data-mobile-route="chat"]');if(!(await p.$('.chat-sent')))throw Error('chat session');
 await p.evaluate(()=>location.hash='#/chat');await p.reload({waitUntil:'networkidle0'});if(!await p.$('.chat-panel'))throw Error('direct route');
 if(errors.length)throw Error(errors.join('|'));console.log('checkout, mobile navigation, chat, escaping and direct route verified');await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
