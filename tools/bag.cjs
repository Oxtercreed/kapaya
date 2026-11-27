const {launch,APP}=require('./lib.cjs');
(async()=>{
 const b=await launch({defaultViewport:{width:390,height:844}}), p=await b.newPage();
 const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(APP,{waitUntil:'networkidle0'});
 await p.evaluate(()=>localStorage.setItem('kapaya.state',JSON.stringify({cart:[{id:'iphone-14-pro',qty:1,color:'Gold',storage:'256GB'},{id:'iphone-15',qty:1,color:'Blue',storage:'128GB'}],favs:[],orders:[]})));
 await p.goto(APP+'#/bag',{waitUntil:'networkidle0'});await p.reload({waitUntil:'networkidle0'});
 for(const width of [320,390,767,1440]){
  await p.setViewport({width,height:844});
  const result=await p.evaluate(()=>({fits:document.documentElement.scrollWidth<=innerWidth+1, cards:[...document.querySelectorAll('.bag-card')].every(c=>{const a=c.getBoundingClientRect(),r=c.querySelector('.bag-remove').getBoundingClientRect();return r.right<=a.right && r.bottom<=a.bottom && r.left>a.left+a.width/2;}), images:[...document.querySelectorAll('.bag-thumb img')].every(i=>i.naturalWidth>0)}));
  if(Object.values(result).some(x=>!x))throw Error(width+' layout '+JSON.stringify(result));
 }
 await p.setViewport({width:390,height:844});
 await p.$eval('.bag-promo',e=>e.open=true);await p.type('.bag-promo input','KAPAYA10');await p.$eval('.bag-promo [data-apply]',e=>e.click());
 let total=()=>p.$eval('.summary .sum-total',e=>e.innerText);
 if(!(await total()).includes('$1618.20'))throw Error('promo total '+await total());
 await p.$eval('[data-line-qty][data-d="1"]',e=>e.click());
 if(!(await total()).includes('$2517.30'))throw Error('quantity discount '+await total());
 await p.$eval('[data-remove]',e=>e.click());
 if(!(await total()).includes('$719.10'))throw Error('remove discount '+await total());
 await p.$eval('[data-quick-add]',e=>e.click());
 if(await p.$$eval('.bag-card',es=>es.length)!==2)throw Error('quick add');
 await p.$eval('[data-go="checkout"]',e=>e.click());
 if(!(await p.$eval('.order-card .sum-total',e=>e.innerText)).includes('$1708.20'))throw Error('checkout total');
 await p.evaluate(()=>location.hash='#/bag');await new Promise(r=>setTimeout(r,200));
 await p.$eval('[data-save]',e=>e.click());
 if(await p.$$eval('.bag-card',es=>es.length)!==1)throw Error('save');
 await p.$eval('[data-remove]',e=>e.click());
 if(!await p.$('.empty'))throw Error('empty bag');
 if(errs.length)throw Error(errs.join('|')); console.log('bag layout, variants, promo, quantity, remove, quick add, save and checkout verified');await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
