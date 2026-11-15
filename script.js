const WA='919782736969',CK='jj_cart';
const SHEET_URL='';/* Google Sheet web app link (see README) */
const LANG=(()=>{try{return localStorage.getItem('jj_lang')||'en'}catch(e){return'en'}})();document.documentElement.lang=LANG;
const $=(s)=>document.querySelector(s);
const inr=n=>'₹'+Number(n).toLocaleString('en-IN');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const getCart=()=>{try{return JSON.parse(localStorage.getItem(CK))||[]}catch(e){return[]}};
const setCart=c=>{try{localStorage.setItem(CK,JSON.stringify(c))}catch(e){}count()};
const count=()=>{const n=getCart().reduce((a,i)=>a+i.qty,0);document.querySelectorAll('.cc').forEach(e=>e.textContent=n)};
const wa=t=>'https://wa.me/'+WA+'?text='+encodeURIComponent(t);
let P=[];
function layout(){
$('#hdr').innerHTML='<div class="wrap nav"><a class="logo" href="index.html">Jay<span>&amp;</span>Joy</a><nav><a href="index.html">Home</a><a href="products.html">All Products</a><a href="products.html?f=new">New</a><a href="about.html">About</a><a href="contact.html">Contact</a><a href="cart.html">Cart (<b class="cc">0</b>)</a></nav><button class="lang" id="lg"></button></div>';
$('#ftr').innerHTML='<div class="wrap"><b>Jay&amp;Joy</b> by Riddhi Siddhi Fashion<br>Kids Boys Shirts – Wholesaler &amp; Manufacturer, India<br>Payment: Cash on Delivery only<br><a href="about.html">About</a> | <a href="contact.html">Contact</a> | <a href="privacy.html">Privacy Policy</a> | <a href="terms.html">Terms &amp; Conditions</a> | <a href="shipping.html">Shipping Policy</a> | <a href="returns.html">Return &amp; Refund Policy</a><br><a href="'+wa('Hello Jay&Joy, I want to know more about your shirts.')+'" target="_blank" rel="noopener">Contact Jay&amp;Joy on WhatsApp</a><p>© 2026 Jay&amp;Joy</p></div>';
document.body.insertAdjacentHTML('beforeend','<a class="fab" target="_blank" rel="noopener" href="'+wa('Hello Jay&Joy, I want to order shirts.')+'">WhatsApp</a>');}
const card=p=>`<a class="card" href="product-details.html?id=${encodeURIComponent(p.id)}"><img src="${esc(p.images[0])}" alt="${esc(p.name)}" loading="lazy"><div class="cb"><h3>${esc(p.name)}</h3><div class="pr"><b>${inr(p.price)}</b> <s>${inr(p.mrp)}</s> <i>${Math.round(100-p.price*100/p.mrp)}% off</i></div>${p.stock>0?'':'<em>Out of stock</em>'}</div></a>`;
const lines=()=>getCart().map((i,n)=>({...i,n,p:P.find(x=>x.id===i.id)})).filter(i=>i.p);
const total=l=>l.reduce((a,i)=>a+i.p.price*i.qty,0);
function home(){$('#pop').innerHTML=P.filter(p=>p.popular).slice(0,8).map(card).join('');$('#new').innerHTML=P.filter(p=>p.isNew).slice(0,8).map(card).join('');$('#hwa').href=wa('Hello Jay&Joy, I want to order shirts.')}
function list(){
const q=new URLSearchParams(location.search);
const opt=(id,arr,l)=>{$(id).innerHTML='<option value="">'+l+'</option>'+arr.map(x=>'<option>'+esc(x)+'</option>').join('')};
opt('#fs',[...new Set(P.flatMap(p=>p.sizes))],'All sizes');opt('#fc',[...new Set(P.flatMap(p=>p.colors))],'All colours');
if(['new','popular'].includes(q.get('f')))$('#fo').value=q.get('f');
const draw=()=>{const mp=+$('#fp').value||1e9,s=$('#fs').value,c=$('#fc').value,o=$('#fo').value;
const r=P.filter(p=>p.price<=mp&&(!s||p.sizes.includes(s))&&(!c||p.colors.includes(c))&&(o!=='new'||p.isNew)&&(o!=='popular'||p.popular));
$('#list').innerHTML=r.map(card).join('');$('#none').hidden=r.length>0};
document.querySelectorAll('.filters select').forEach(e=>e.onchange=draw);draw()}
function detail(){
const id=new URLSearchParams(location.search).get('id'),p=P.find(x=>x.id===id),r=$('#pd');
if(!p){r.innerHTML='<p>Product not found.</p><a class="btn" href="products.html">View all shirts</a>';return}
document.title=p.name+' | Jay&Joy';const ok=p.stock>0;
const o=a=>a.map(x=>'<option>'+esc(x)+'</option>').join('');
r.innerHTML=`<div class="pdg"><div><img id="mi" class="mi" src="${esc(p.images[0])}" alt="${esc(p.name)}"><div class="th">${p.images.map((s,i)=>`<img src="${esc(s)}" alt="${esc(p.name)} photo ${i+1}" data-s="${esc(s)}">`).join('')}</div></div>
<div><h1>${esc(p.name)}</h1><p class="sku">SKU: ${esc(p.sku)}</p><div class="pr big"><b>${inr(p.price)}</b> <s>${inr(p.mrp)}</s> <i>${Math.round(100-p.price*100/p.mrp)}% off</i></div>
<p>${esc(p.desc)}</p><p>${esc(p.details)}</p><p><b>${ok?'In stock':'Out of stock'}</b></p>
<label for="sz">Size</label><select id="sz">${o(p.sizes)}</select><label for="cl">Colour</label><select id="cl">${o(p.colors)}</select>
<label for="qt">Quantity</label><input id="qt" type="number" min="1" max="${Math.max(p.stock,1)}" value="1">
<p class="cod">Payment: Cash on Delivery only</p>
<button class="btn" id="add" ${ok?'':'disabled'}>Add to Cart</button><a class="btn" href="cart.html">Go to Cart</a>
<a class="btn wa" target="_blank" rel="noopener" href="${wa('Hello Jay&Joy, I want to ask about '+p.name+' (SKU: '+p.sku+')')}">Ask about this product</a><p id="msg" role="status"></p></div></div>`;
r.querySelector('.th').onclick=e=>{if(e.target.dataset.s)$('#mi').src=e.target.dataset.s};
$('#add').onclick=()=>{const s=$('#sz').value,c=$('#cl').value,q=Math.max(1,Math.min(+$('#qt').value||1,p.stock));
const cart=getCart(),k=cart.find(i=>i.id===p.id&&i.size===s&&i.color===c);
if(k)k.qty+=q;else cart.push({id:p.id,size:s,color:c,qty:q});setCart(cart);$('#msg').textContent='Added to cart ✓'};
const ld=document.createElement('script');ld.type='application/ld+json';
ld.textContent=JSON.stringify({'@context':'https://schema.org','@type':'Product',name:p.name,sku:p.sku,description:p.desc,image:p.images,brand:{'@type':'Brand',name:'Jay&Joy'},offers:{'@type':'Offer',priceCurrency:'INR',price:p.price,availability:'https://schema.org/'+(ok?'InStock':'OutOfStock')}});
document.head.appendChild(ld)}
function cartPage(){
const r=$('#cart');
const draw=()=>{const l=lines();
if(!l.length){r.innerHTML='<p>Your cart is empty.</p><a class="btn" href="products.html">Shop Now</a>';return}
r.innerHTML=l.map(i=>`<div class="ci"><img src="${esc(i.p.images[0])}" alt="${esc(i.p.name)}"><div><b>${esc(i.p.name)}</b><br>Size: ${esc(i.size)} | Colour: ${esc(i.color)}<br>${inr(i.p.price)}</div><div class="q"><button aria-label="Less" data-a="-" data-n="${i.n}">−</button> ${i.qty} <button aria-label="More" data-a="+" data-n="${i.n}">+</button><br><button class="rm" data-a="x" data-n="${i.n}">Remove</button></div></div>`).join('')+`<div class="tot"><p>Subtotal: ${inr(total(l))}</p><h3>Final amount (Cash on Delivery): ${inr(total(l))}</h3><a class="btn" href="checkout.html">Proceed to Checkout</a></div>`};
r.onclick=e=>{const b=e.target.closest('button');if(!b)return;const c=getCart(),n=+b.dataset.n,a=b.dataset.a;
if(a==='x')c.splice(n,1);else{c[n].qty+=a==='+'?1:-1;if(c[n].qty<1)c.splice(n,1)}setCart(c);draw()};draw()}
function checkout(){
const l=lines(),f=$('#f');
if(!l.length){f.hidden=true;$('#sum').innerHTML='<p>Your cart is empty.</p><a class="btn" href="products.html">Shop Now</a>';return}
$('#sum').innerHTML='<h2>Order Summary</h2>'+l.map(i=>`<p>${esc(i.p.name)} – ${esc(i.size)}, ${esc(i.color)} × ${i.qty} = ${inr(i.p.price*i.qty)}</p>`).join('')+`<h3>Total: ${inr(total(l))}</h3><p class="cod">Payment: Cash on Delivery (COD) only. Pay cash when the order is delivered.</p>`;
f.onsubmit=e=>{e.preventDefault();const v=n=>f[n].value.trim(),er=[],ph=/^[6-9]\d{9}$/;
if(v('name').length<2)er.push('Enter your full name.');
if(!ph.test(v('mobile')))er.push('Enter a valid 10-digit mobile number.');
if(!ph.test(v('wa')))er.push('Enter a valid 10-digit WhatsApp number.');
if(v('addr').length<10)er.push('Enter your full delivery address.');
if(v('city').length<2)er.push('Enter your city.');
if(v('state').length<2)er.push('Enter your state.');
if(!/^[1-9]\d{5}$/.test(v('pin')))er.push('Enter a valid 6-digit PIN code.');
$('#err').innerHTML=er.map(esc).join('<br>');if(er.length)return;
const ref='JJ-'+new Date().toISOString().slice(2,10).replace(/-/g,'')+'-'+Math.floor(1000+Math.random()*9000);
const m=['*NEW ORDER – Jay&Joy*','Order Ref: '+ref,'Payment: CASH ON DELIVERY (COD)','','*Customer*','Name: '+v('name'),'Mobile: '+v('mobile'),'WhatsApp: '+v('wa'),'Address: '+v('addr')+', '+v('city')+', '+v('state')+' - '+v('pin'),'','*Items*',
...l.map((i,k)=>(k+1)+'. '+i.p.name+' (SKU '+i.p.sku+') | Size '+i.size+' | Colour '+i.color+' | Qty '+i.qty+' x '+inr(i.p.price)+' = '+inr(i.p.price*i.qty)),'','*Total to pay on delivery: '+inr(total(l))+'*','','Please confirm my order.'].join('\n');
const u=wa(m);
if(SHEET_URL)fetch(SHEET_URL,{method:'POST',mode:'no-cors',body:JSON.stringify({ref,name:v('name'),mobile:v('mobile'),wa:v('wa'),address:v('addr')+', '+v('city')+', '+v('state')+' - '+v('pin'),items:l.map(i=>i.p.name+' '+i.size+' '+i.color+' x'+i.qty).join('; '),total:total(l)})}).catch(()=>{});
if(!window.open(u,'_blank'))location.href=u;
$('#done').innerHTML=`<p class="note"><b>Order reference: ${ref}</b><br>Your order is NOT confirmed yet. Press Send in WhatsApp. Jay&amp;Joy will check and confirm it.</p><a class="btn wa" target="_blank" rel="noopener" href="${u}">Open WhatsApp again</a>`}}
document.addEventListener('DOMContentLoaded',()=>{layout();langBtn();count();
fetch('products.json').then(r=>r.json()).then(d=>{P=d;const pg=document.body.dataset.page;({index:home,products:list,'product-details':detail,cart:cartPage,checkout:checkout}[pg]||(()=>{}))();count()})
.catch(()=>$('main').insertAdjacentHTML('afterbegin','<p id="err">Products could not load. Please refresh the page.</p>'))});

function langBtn(){const b=$('#lg');b.textContent=LANG==='hi'?'English':'हिंदी';b.onclick=()=>{try{localStorage.setItem('jj_lang',LANG==='hi'?'en':'hi')}catch(e){}location.reload()}}
const HI={'Home':'होम','All Products':'सभी प्रोडक्ट','New':'नए','About':'हमारे बारे में','Contact':'संपर्क','Shop Boys Shirts':'लड़कों की शर्ट देखें','Order on WhatsApp':'WhatsApp पर ऑर्डर करें','Popular Shirts':'लोकप्रिय शर्ट','New Arrivals':'नई शर्ट','Boys Shirts':'लड़कों की शर्ट','Little Style. Big Confidence.':'छोटा स्टाइल, बड़ा कॉन्फिडेंस।','Add to Cart':'कार्ट में डालें','Go to Cart':'कार्ट देखें','Ask about this product':'इस प्रोडक्ट के बारे में पूछें','Your Cart':'आपका कार्ट','Your cart is empty.':'आपका कार्ट खाली है।','Shop Now':'अभी खरीदें','Proceed to Checkout':'चेकआउट करें','Remove':'हटाएँ','Checkout':'चेकआउट','Order Summary':'ऑर्डर सारांश','Delivery Details':'डिलीवरी की जानकारी','Full name':'पूरा नाम','Mobile number':'मोबाइल नंबर','WhatsApp number':'WhatsApp नंबर','Full delivery address':'पूरा पता','City':'शहर','State':'राज्य','PIN code':'पिन कोड','Place Order on WhatsApp':'WhatsApp पर ऑर्डर भेजें','Size':'साइज़','Colour':'रंग','Quantity':'मात्रा','In stock':'उपलब्ध','Out of stock':'स्टॉक में नहीं','Added to cart ✓':'कार्ट में जुड़ गया ✓','Any price':'कोई भी दाम','All sizes':'सभी साइज़','All colours':'सभी रंग','All':'सभी','New arrivals':'नई शर्ट','Popular':'लोकप्रिय','No shirts match. Change the filters.':'कोई शर्ट नहीं मिली। फ़िल्टर बदलें।','Product not found.':'प्रोडक्ट नहीं मिला।','Contact Jay&Joy on WhatsApp':'WhatsApp पर Jay&Joy से बात करें','Privacy Policy':'प्राइवेसी पॉलिसी','Terms & Conditions':'नियम व शर्तें','Shipping Policy':'शिपिंग पॉलिसी','Return & Refund Policy':'रिटर्न व रिफंड पॉलिसी','Open WhatsApp again':'WhatsApp फिर खोलें','Enter your full name.':'अपना पूरा नाम लिखें।','Enter a valid 10-digit mobile number.':'सही 10 अंकों का मोबाइल नंबर लिखें।','Enter a valid 10-digit WhatsApp number.':'सही 10 अंकों का WhatsApp नंबर लिखें।','Enter your full delivery address.':'पूरा पता लिखें।','Enter your city.':'शहर लिखें।','Enter your state.':'राज्य लिखें।','Enter a valid 6-digit PIN code.':'सही 6 अंकों का पिन कोड लिखें।','Order Summary':'ऑर्डर सारांश'};
const PRE={'Subtotal:':'उप-योग:','Total:':'कुल:','Final amount (Cash on Delivery):':'कुल रकम (डिलीवरी पर नकद):','Payment: Cash on Delivery only':'भुगतान: सिर्फ़ डिलीवरी पर नकद (COD)','Payment: Cash on Delivery (COD) only.':'भुगतान: सिर्फ़ डिलीवरी पर नकद (COD)।','Size:':'साइज़:','Colour:':'रंग:','Order reference:':'ऑर्डर नंबर:','Your order is NOT confirmed yet.':'आपका ऑर्डर अभी पक्का नहीं है। WhatsApp में Send दबाएँ; Jay&Joy जाँचकर पक्का करेगा।'};
function tr(root){const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode())){const t=n.nodeValue.trim();if(!t)continue;if(HI[t]){n.nodeValue=n.nodeValue.replace(t,HI[t]);continue}for(const k in PRE)if(t.startsWith(k)){n.nodeValue=n.nodeValue.replace(k,PRE[k]);break}}}
if(LANG==='hi')new MutationObserver(()=>tr(document.body)).observe(document.body,{childList:true,subtree:true,characterData:true});
