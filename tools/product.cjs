const {launch,APP}=require('./lib.cjs');
(async()=>{const b=await launch({defaultViewport:{width:390,height:844}});const p=await b.newPage();let errors=[];p.on('pageerror',e=>errors.push(e.message));
for(const id of ['iphone-16-pro','iphone-15','iphone-14-pro','iphone-13']){
 await p.goto(APP+'#/product/'+id,{waitUntil:'networkidle0'});let colors=await p.$$eval('[data-color]',els=>els.map(e=>e.dataset.color));let seen=[];
 for(const c of colors){await p.click('[data-color="'+c+'"]');seen.push(await p.$eval('.gallery-plate img',e=>e.currentSrc));}
 if(new Set(seen).size!==colors.length)throw Error(id+' finish image failed');
 const wide=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);if(wide) throw Error(id+' overflow');console.log(id, colors.join(', '),'images distinct');
}
await p.goto(APP+'#/product/iphone-14-pro',{waitUntil:'networkidle0'});await p.evaluate(()=>localStorage.clear());await p.reload({waitUntil:'networkidle0'});
if (await p.$eval('.btn-add',e=>e.getBoundingClientRect().height) < 48) throw Error('mobile add button too small');
await p.click('[data-color="Gold"]');await p.click('[data-storage="256GB"]');let price=await p.$eval('.buy-price',e=>e.textContent);if(price!=='$999.00') throw Error('storage price '+price);await p.click('[data-add]');await p.evaluate(()=>location.hash='#/bag');await new Promise(r=>setTimeout(r,250));let bag=await p.$eval('.bag-info',e=>e.innerText);if(!bag.includes('Gold')||!bag.includes('256GB')||!bag.includes('$999.00')) throw Error('bag '+bag);console.log('storage + finish in bag',bag);
await p.evaluate(()=>location.hash='#/checkout');await new Promise(r=>setTimeout(r,250));if(!(await p.$eval('.order-card',e=>e.innerText)).includes('$999.00')) throw Error('checkout variant price');
await p.goto(APP+'#/product/iphone-14-pro',{waitUntil:'networkidle0'});await p.click('[data-pdp-menu]');if(!await p.$eval('[data-pdp-menu]',e=>e.getAttribute('aria-expanded')==='true'))throw Error('menu');await p.click('[data-pdp-search]');if(!await p.$eval('.search input',e=>document.activeElement===e))throw Error('search');
await p.goto(APP+'#/product/iphone-14-pro',{waitUntil:'networkidle0'});await p.screenshot({path:'/tmp/pdp-mobile.png',fullPage:true});await p.setViewport({width:1440,height:1200});await p.reload({waitUntil:'networkidle0'});await p.screenshot({path:'/tmp/pdp-desktop.png'});if(errors.length)throw Error(errors.join('|'));await b.close();})().catch(e=>{console.error(e);process.exit(1)});
