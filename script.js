const products = [
  {id:1,name:'после дождя',subtitle:'подвеска · серебро 925',price:8900,category:'pendant',shape:'pendant',image:'product-pendant.jpg',tag:'',featured:1,description:'подвеска, вдохновлённая тишиной после любимой песни. вытянутая форма и зеркальный блеск серебра напоминают о чувствах, которые остаются с нами.'},
  {id:2,name:'первый аккорд',subtitle:'кольцо · серебро 925',price:7600,category:'ring',shape:'ring',image:'product-ring.jpg',tag:'',featured:2,description:'кольцо о начале чего-то важного. лаконичный силуэт и выразительная фактура становятся личным символом нового этапа.'},
  {id:3,name:'на повторе',subtitle:'серьги · серебро 925',price:10400,category:'earrings',shape:'earrings',image:'product-earrings.jpg',tag:'',featured:3,description:'серьги для мелодии, к которой хочется возвращаться. скульптурная форма ловит свет и меняется вместе с движением.'},
  {id:4,name:'между строк',subtitle:'браслет · серебро 925',price:6900,category:'bracelet',shape:'chain',image:'product-bracelet.jpg',tag:'',featured:4,description:'браслет о смыслах, которые не всегда можно выразить словами. серебряные звенья соединяют отдельные мгновения в одну историю.'}
];
const rubles = n => new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
const iconArrow = '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';
const iconClose = '<svg class="ui-icon close-glyph" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
const iconMenu = '<svg class="ui-icon menu-glyph" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
const iconCheck = '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>';

let activeCategory = 'all';
let cart = [];
let activeProduct = null;
const grid = document.querySelector('#productGrid');
const cartDrawer = document.querySelector('#cartDrawer');
const overlay = document.querySelector('#overlay');
const checkoutModal = document.querySelector('#checkoutModal');
const productModal = document.querySelector('#productModal');
const productModalImage = document.querySelector('#productModalImage');
function productArt(product, extra='') {
  return `<img class="product-art ${product.shape} ${extra}" src="assets/${product.image}" alt="${product.name} — ${product.subtitle}" loading="lazy">`;
}
function visibleProducts(){
  const query=document.querySelector('#searchInput').value.trim().toLocaleLowerCase('ru');
  let list=products.filter(p=>(activeCategory==='all'||p.category===activeCategory)&&`${p.name} ${p.subtitle} ${p.description}`.toLocaleLowerCase('ru').includes(query));
  const sort=document.querySelector('#sortSelect').value;
  if(sort==='low') list.sort((a,b)=>a.price-b.price); else if(sort==='high') list.sort((a,b)=>b.price-a.price); else list.sort((a,b)=>a.featured-b.featured);
  return list;
}
function renderProducts(){
  const list=visibleProducts();
  document.querySelector('#resultCount').textContent=`${list.length} ${list.length===1?'изделие':list.length>1&&list.length<5?'изделия':'изделий'}`;
  grid.innerHTML=list.length?list.map(p=>`<article class="product-card"><div class="product-image" role="button" tabindex="0" data-detail="${p.id}" aria-label="подробнее: ${p.name}">${productArt(p)}${p.tag?`<span class="product-badge">${p.tag}</span>`:''}<button class="quick-add" data-add="${p.id}">добавить в корзину +</button></div><div class="product-meta"><div><p class="product-name">${p.name}</p><p class="product-subtitle">${p.subtitle}</p></div><span class="product-price">${rubles(p.price)}</span></div></article>`).join(''):'<div class="no-results">ничего не найдено. попробуйте изменить запрос или категорию.</div>';
}
function updateCart(){
  const count=cart.reduce((s,i)=>s+i.qty,0), total=cart.reduce((s,i)=>s+i.qty*i.price,0);
  document.querySelector('#cartCount').textContent=count;
  document.querySelector('#drawerCount').textContent=`(${count})`;
  document.querySelector('#cartTotal').textContent=rubles(total);
  document.querySelector('#cartItems').innerHTML=cart.length?cart.map(i=>`<div class="cart-item"><div class="mini-art">${productArt(i)}</div><div><p class="cart-item-name">${i.name}</p><span class="cart-item-price">${rubles(i.price)}</span><div class="qty-controls"><button data-qty="${i.id}" data-delta="-1" aria-label="уменьшить количество">-</button><span>${i.qty}</span><button data-qty="${i.id}" data-delta="1" aria-label="увеличить количество">+</button></div></div><button class="remove-item" data-remove="${i.id}" aria-label="удалить ${i.name}">${iconClose}</button></div>`).join(''):'<p class="empty-cart">пока здесь пусто — добавьте украшение, которое вам откликнулось.</p>';
  document.querySelector('#checkoutOpen').disabled=!cart.length;
  document.querySelector('#checkoutOpen').style.opacity=cart.length?'1':'.45';
}
function showOverlay(){overlay.hidden=false;document.body.style.overflow='hidden';}
function hideOverlay(){
  overlay.hidden=true;document.body.style.overflow='';
  cartDrawer.classList.remove('open');cartDrawer.setAttribute('aria-hidden','true');
  checkoutModal.hidden=true;productModal.hidden=true;
}
function openCart(){showOverlay();cartDrawer.classList.add('open');cartDrawer.setAttribute('aria-hidden','false');}
function openCheckout(){
  cartDrawer.classList.remove('open');cartDrawer.setAttribute('aria-hidden','true');
  checkoutModal.hidden=false;
  document.querySelector('#formSuccess').hidden=true;
  document.querySelector('#formSuccess').replaceChildren();
  document.querySelector('#checkoutForm').hidden=false;
}
function openProductDetails(product){
  activeProduct=product;
  document.querySelector('#productModalTitle').textContent=product.name;
  document.querySelector('#productModalSubtitle').textContent=product.subtitle;
  document.querySelector('#productModalDescription').textContent=product.description;
  document.querySelector('#productModalPrice').textContent=rubles(product.price);
  productModalImage.src=`assets/${product.image}`;
  productModalImage.alt=`${product.name} — ${product.subtitle}`;
  productModal.hidden=false;showOverlay();
}
function addToCart(id){
  const p=products.find(x=>x.id===Number(id));if(!p)return;
  const found=cart.find(x=>x.id===p.id);found?found.qty++:cart.push({...p,qty:1});
  updateCart();hideOverlay();openCart();
}
document.querySelectorAll('.filter-tab').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.filter-tab').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');activeCategory=b.dataset.category;renderProducts();
}));
document.querySelector('#searchInput').addEventListener('input',renderProducts);
document.querySelector('#sortSelect').addEventListener('change',renderProducts);
grid.addEventListener('click',e=>{
  const add=e.target.closest('[data-add]');
  if(add){e.stopPropagation();addToCart(add.dataset.add);return;}
  const detail=e.target.closest('[data-detail]');
  if(detail){const p=products.find(x=>x.id===Number(detail.dataset.detail));if(p)openProductDetails(p);}
});
grid.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-detail]')){e.preventDefault();e.target.click();}});
document.querySelector('#cartOpen').addEventListener('click',openCart);
document.querySelector('#cartClose').addEventListener('click',hideOverlay);
document.querySelector('#checkoutOpen').addEventListener('click',openCheckout);
document.querySelector('#checkoutClose').addEventListener('click',hideOverlay);
document.querySelector('#productModalClose').addEventListener('click',hideOverlay);
document.querySelector('#productModalAdd').addEventListener('click',()=>{if(activeProduct)addToCart(activeProduct.id);});
overlay.addEventListener('click',hideOverlay);
document.querySelector('#cartItems').addEventListener('click',e=>{
  const qty=e.target.closest('[data-qty]');const rem=e.target.closest('[data-remove]');
  if(qty){const item=cart.find(x=>x.id===Number(qty.dataset.qty));if(item){item.qty+=Number(qty.dataset.delta);if(item.qty<=0)cart=cart.filter(x=>x.id!==item.id);}updateCart();}
  if(rem){cart=cart.filter(x=>x.id!==Number(rem.dataset.remove));updateCart();}
});
document.querySelector('#checkoutForm').addEventListener('submit',e=>{
  e.preventDefault();
  if(!cart.length)return;
  const data=new FormData(e.currentTarget);
  const clean=value=>String(value||'').replace(/[<>]/g,'').trim();
  const deliveryLabel=data.get('delivery')==='courier'?'СДЭК — курьером':'СДЭК — в пункт выдачи';
  const items=cart.map(i=>`- ${i.name} x ${i.qty} — ${rubles(i.price*i.qty)}`).join('\n');
  const total=cart.reduce((s,i)=>s+i.qty*i.price,0);
  const comment=clean(data.get('comment'));
  const message=[
    'здравствуйте! хочу оформить заказ в мелора.',
    '',`имя: ${clean(data.get('name'))}`,`контакт: ${clean(data.get('contact'))}`,
    `доставка: ${deliveryLabel}`,'','состав заказа:',items,'',`итого за украшения: ${rubles(total)}`,
    comment?`комментарий: ${comment}`:'', '', 'пожалуйста, подтвердите наличие, стоимость доставки и способы оплаты.'
  ].filter(Boolean).join('\n');
  const tgUrl=`https://t.me/gosmuv?text=${encodeURIComponent(message)}`;
  const success=document.querySelector('#formSuccess');
  success.replaceChildren();
  const title=document.createElement('strong');title.textContent='заказ готов к отправке';
  const note=document.createElement('p');note.textContent='Telegram откроется с подготовленным сообщением. Проверьте детали и нажмите «отправить», чтобы передать заказ менеджеру.';
  const link=document.createElement('a');link.className='button button-dark full-width telegram-submit';link.href=tgUrl;link.target='_blank';link.rel='noopener noreferrer';link.textContent='открыть Telegram';link.insertAdjacentHTML('beforeend', iconArrow);
  success.append(title,note,link);success.hidden=false;e.currentTarget.hidden=true;
});
document.querySelector('#menuToggle').addEventListener('click',()=>{
  const nav=document.querySelector('#mainNav');const open=nav.classList.toggle('open');
  document.querySelector('#menuToggle').setAttribute('aria-expanded',String(open));
  document.querySelector('#menuToggle').setAttribute('aria-label',open?'закрыть меню':'открыть меню');
  document.querySelector('#menuToggle').innerHTML=open?iconClose:iconMenu;
});
document.querySelectorAll('#mainNav a').forEach(a=>a.addEventListener('click',()=>{
  document.querySelector('#mainNav').classList.remove('open');
  document.querySelector('#menuToggle').setAttribute('aria-expanded','false');
  document.querySelector('#menuToggle').setAttribute('aria-label','открыть меню');
  document.querySelector('#menuToggle').innerHTML=iconMenu;
}));
document.addEventListener('keydown',e=>{if(e.key==='Escape')hideOverlay();});
renderProducts();updateCart();
