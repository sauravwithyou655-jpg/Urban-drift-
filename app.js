// Urban Drift static site JS
const PRODUCTS = [
  { id:1, name:'Urban Tee', price:899, category:'Men', image:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80' },
  { id:2, name:'Street Hoodie', price:1499, category:'Men', image:'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80' },
  { id:3, name:'Classic Joggers', price:1199, category:'Men', image:'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80' },
  { id:4, name:'Urban Tee Women', price:899, category:'Women', image:'https://images.unsplash.com/photo-1600180758895-03d6e7cb2c10?auto=format&fit=crop&w=800&q=80' },
  { id:5, name:'Street Hoodie Women', price:1499, category:'Women', image:'https://images.unsplash.com/photo-1618354699265-c276f6d6c740?auto=format&fit=crop&w=800&q=80' }
];

let products = PRODUCTS.slice();
let cart = [];

const productsEl = document.getElementById('products');
const cartBtn = document.getElementById('cartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const closeCart = document.getElementById('closeCart');
const cartItemsEl = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const totalAmt = document.getElementById('totalAmt');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckout = document.getElementById('closeCheckout');
const checkoutForm = document.getElementById('checkoutForm');
const orderConfirm = document.getElementById('orderConfirm');
const continueBtn = document.getElementById('continueBtn');

function renderProducts(){
  productsEl.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" />
      <div class="card-body">
        <div>
          <h4>${p.name}</h4>
          <p>₹${p.price}</p>
        </div>
        <button class="btn" onclick="addToCart(${p.id})">Add</button>
      </div>
    `;
    productsEl.appendChild(card);
  });
}

function updateCartUI(){
  cartItemsEl.innerHTML = '';
  if(cart.length===0){
    cartItemsEl.innerHTML = '<p style="color:#666;text-align:center;margin-top:20px">Your cart is empty.</p>';
    totalAmt.textContent = '₹0';
    cartCount.textContent = '0';
    return;
  }
  cart.forEach(item=>{
    const div = document.createElement('div');
    div.className = 'cart-row';
    div.style.display='flex';
    div.style.justifyContent='space-between';
    div.style.padding='10px 0';
    div.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <div style="font-size:13px;color:#666">₹${item.price} x ${item.qty}</div>
      </div>
      <div>
        <button onclick="removeFromCart(${item.id})" style="background:transparent;border:none;color:#d00;cursor:pointer">Remove</button>
      </div>
    `;
    cartItemsEl.appendChild(div);
  });
  const total = cart.reduce((s,i)=>s + i.price*i.qty,0);
  totalAmt.textContent = '₹' + total;
  cartCount.textContent = cart.reduce((s,i)=>s+i.qty,0);
}

// Cart functions
function addToCart(id){
  const p = PRODUCTS.find(x=>x.id===id);
  const exist = cart.find(i=>i.id===id);
  if(exist) exist.qty++;
  else cart.push({...p, qty:1});
  updateCartUI();
  openCart();
  // GA event if present
  if(window.gtag) window.gtag('event','add_to_cart',{currency:'INR',value:p.price,items:[{id:p.id,name:p.name,price:p.price,quantity:1}]});
}

function removeFromCart(id){
  cart = cart.filter(i=>i.id!==id);
  updateCartUI();
}

// UI helpers
function openCart(){ cartDrawer.classList.remove('hidden'); }
function closeCartFn(){ cartDrawer.classList.add('hidden'); }
function scrollToShop(){ location.hash = '#shop'; window.scrollTo({top: document.getElementById('shop').offsetTop - 80, behavior:'smooth'}); }

cartBtn.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartFn);
checkoutBtn.addEventListener('click', ()=>{ checkoutModal.classList.remove('hidden'); });
closeCheckout.addEventListener('click', ()=>{ checkoutModal.classList.add('hidden'); });

checkoutForm.addEventListener('submit', function(e){
  e.preventDefault();
  // send GA purchase event
  const total = cart.reduce((s,i)=>s + i.price*i.qty,0);
  if(window.gtag) window.gtag('event','purchase',{currency:'INR',value:total,transaction_id: String(Date.now()),items: cart.map(i=>({id:i.id,name:i.name,price:i.price,quantity:i.qty}))});
  // clear cart and show confirmation
  cart = [];
  updateCartUI();
  checkoutModal.classList.add('hidden');
  cartDrawer.classList.add('hidden');
  orderConfirm.classList.remove('hidden');
});

continueBtn.addEventListener('click', ()=>{
  orderConfirm.classList.add('hidden');
  // back to shop
  document.getElementById('shop').scrollIntoView({behavior:'smooth'});
});

// Filters
document.querySelectorAll('.filter').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.getAttribute('data-cat');
    applyFilters(cat, document.querySelector('.filter-price.active').getAttribute('data-price'));
  });
});
document.querySelectorAll('.filter-price').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.filter-price').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const price = btn.getAttribute('data-price');
    applyFilters(document.querySelector('.filter.active').getAttribute('data-cat'), price);
  });
});

function applyFilters(category, price){
  let filtered = PRODUCTS.slice();
  if(category && category!=='All') filtered = filtered.filter(p=>p.category===category);
  if(price==='Below1000') filtered = filtered.filter(p=>p.price<1000);
  else if(price==='1000to1500') filtered = filtered.filter(p=>p.price>=1000 && p.price<=1500);
  else if(price==='Above1500') filtered = filtered.filter(p=>p.price>1500);
  products = filtered;
  renderProducts();
}

// Initialize
renderProducts();
updateCartUI();
