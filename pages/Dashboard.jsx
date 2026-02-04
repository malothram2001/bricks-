import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Package, Users, Settings, Search, Bell, Menu, 
  MoreVertical, ArrowUpRight, Filter, Download, LogOut, ChevronRight, ArrowLeft, 
  Plus, Minus, Truck, MapPin, Calendar, Send, CheckCircle, CreditCard, User, 
  X, MessageCircle, FileText, CheckSquare, Navigation
} from 'lucide-react';

/**
 * ==========================================================================================
 * BUILDMATE - FINAL CODE
 * Includes: 
 * 1. Dynamic Dashboard (Categories -> Subcategories -> Products)
 * 2. Full Inventory View (All Subcategories)
 * 3. Complete Order Management (Pending -> Approved -> Dispatched -> Delivered)
 * 4. Advanced Checkout (Distance Calc, Discount, Advance Payment)
 * ==========================================================================================
 */

// --- 1. MOCK DATA & STYLES ---

const DELIVERY_RATE_PER_KM = 40; 

const STYLES = {
  card: { backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' },
  input: { padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%', outline: 'none', fontSize: '14px' },
  label: { display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '4px' },
  btnPrimary: { backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s' },
  btnSecondary: { backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
  badge: (status) => {
    const colors = {
      'Pending': { bg: '#fff7ed', text: '#c2410c' },
      'Approved': { bg: '#eff6ff', text: '#1d4ed8' },
      'Dispatched': { bg: '#f3e8ff', text: '#7e22ce' },
      'Delivered': { bg: '#dcfce7', text: '#15803d' },
      'Cancelled': { bg: '#fef2f2', text: '#dc2626' }
    };
    const c = colors[status] || colors['Pending'];
    return { padding: '4px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', backgroundColor: c.bg, color: c.text };
  }
};

const MATERIALS_DATA = {
  categories: [
    { id: 'cat1', name: "Bricks", icon: "https://images.unsplash.com/photo-1588012886079-16538b97fbdf?w=400", stock: 15000 },
    { id: 'cat2', name: "Sand", icon: "https://images.unsplash.com/photo-1621262923785-007823d0c324?w=400", stock: 45 },
    { id: 'cat3', name: "Cements", icon: "https://plus.unsplash.com/premium_photo-1664304928174-279287333902?w=400", stock: 900 },
    { id: 'cat4', name: "Steels", icon: "https://images.unsplash.com/photo-1535063406560-2695c0d02433?w=400", stock: 15 },
    { id: 'cat5', name: "Furnitures", icon: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400", stock: 12 },
    { id: 'cat6', name: "Electricals", icon: "https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?w=400", stock: 28 },
    { id: 'cat7', name: "Stones", icon: "https://images.unsplash.com/photo-1599818960098-971775796246?w=400", stock: 65 },
    { id: 'cat8', name: "Paints", icon: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400", stock: 34 },
  ],
  subCategories: {
    "Bricks": [
      { id: 'sub1', name: "Red Clay Bricks", img: "https://images.unsplash.com/photo-1588012886079-16538b97fbdf?w=400" },
      { id: 'sub2', name: "Fly Ash Bricks", img: "https://5.imimg.com/data5/SELLER/Default/2023/1/VR/QJ/LL/4329227/fly-ash-bricks-500x500.jpg" },
      { id: 'sub3', name: "Concrete Blocks", img: "https://images.unsplash.com/photo-1590087747087-434770020c6a?w=400" },
    ],
    "Sand": [
      { id: 'sub4', name: "River Sand", img: "https://images.unsplash.com/photo-1621262923785-007823d0c324?w=400" },
      { id: 'sub5', name: "M-Sand", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_uG8q8J9y9z5y_y5y_y5y_y5y_y5y_y5y&s" },
    ],
    "default": [
      { id: 'sub6', name: "Standard Type", img: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400" },
      { id: 'sub7', name: "Premium Type", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400" }
    ]
  },
  products: {
    "default": [
      { id: 1, name: "Premium Quality Item", price: 500, unit: "bag", stock: 100 },
      { id: 2, name: "Standard Quality Item", price: 350, unit: "bag", stock: 50 }
    ],
    "Red Clay Bricks": [
      { id: 101, name: "Standard Red Brick 9x4x3", price: 12, unit: "piece", stock: 5000 },
      { id: 102, name: "Wire Cut Red Brick", price: 18, unit: "piece", stock: 2000 },
      { id: 103, name: "Table Molded Brick", price: 15, unit: "piece", stock: 3500 }
    ],
    "River Sand": [
      { id: 201, name: "Fine River Sand", price: 4000, unit: "ton", stock: 20 },
      { id: 202, name: "Coarse River Sand", price: 3500, unit: "ton", stock: 40 }
    ]
  }
};

const calculateDistance = async (origin, destination) => {
  return new Promise(resolve => setTimeout(() => resolve(Math.floor(Math.random() * 45) + 5), 800));
};

// --- 2. COMPONENTS ---

const StatCard = ({ title, value, trend, trendUp, color, icon }) => (
  <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div>
      <p style={{fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px 0'}}>{title}</p>
      <h3 style={{fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0'}}>{value}</h3>
      <div style={{display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '500', color: trendUp ? '#22c55e' : '#ef4444'}}>
        {trendUp ? <ArrowUpRight size={14}/> : <ArrowUpRight size={14} style={{transform: 'rotate(90deg)'}}/>}
        {trend}
      </div>
    </div>
    <div style={{width: '48px', height: '48px', borderRadius: '50%', backgroundColor: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: color}}>{icon}</div>
  </div>
);

const DashboardCards = ({ kpi }) => (
  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '32px'}}>
    <StatCard title="Daily Revenue" value={`₹ ${kpi.revenue.toLocaleString()}`} trend="+12.5%" trendUp={true} color="#22c55e" icon="$" />
    <StatCard title="Active Orders" value={kpi.activeOrders} trend="+4 new" trendUp={true} color="#3b82f6" icon="📦" />
    <StatCard title="Low Stock" value={`${kpi.lowStock} Items`} trend="Needs Attention" trendUp={false} color="#ef4444" icon="⚠️" />
    <StatCard title="Items Sold" value={kpi.itemsSold.toLocaleString()} trend="+5.2%" trendUp={true} color="#f97316" icon="📈" />
  </div>
);

const MaterialTypes = ({ categories, onSelect }) => (
  <div style={STYLES.grid}>
    {categories.map((cat, idx) => (
      <div key={idx} style={{...STYLES.card, ':hover': {transform: 'translateY(-5px)'}}} onClick={() => onSelect(cat)}>
        <div style={{height: '140px', overflow: 'hidden'}}><img src={cat.icon} alt={cat.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>
        <div style={{padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h4 style={{fontSize: '16px', fontWeight: '600', margin: 0}}>{cat.name}</h4>
          <span style={{fontSize: '12px', padding: '4px 8px', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '6px', fontWeight: '600'}}>{cat.stock} Units</span>
        </div>
      </div>
    ))}
  </div>
);

const ProductItem = ({ product, onAdd }) => {
  const [qty, setQty] = useState(0);
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #f1f5f9'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
        <div style={{width: '48px', height: '48px', backgroundColor: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Package size={24} color="#94a3b8"/></div>
        <div><h5 style={{fontSize: '15px', fontWeight: '600', margin: 0}}>{product.name}</h5><p style={{fontSize: '13px', color: '#64748b', margin: '4px 0 0 0'}}>₹{product.price} / {product.unit}</p></div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
        <div style={{display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '6px'}}>
          <button onClick={() => setQty(q => Math.max(0, q - 50))} style={{padding: '6px 10px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b'}}><Minus size={14}/></button>
          <span style={{width: '40px', textAlign: 'center', fontSize: '13px', fontWeight: '600'}}>{qty}</span>
          <button onClick={() => setQty(q => q + 50)} style={{padding: '6px 10px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b'}}><Plus size={14}/></button>
        </div>
        <button onClick={() => { if(qty > 0) { onAdd(qty); setQty(0); }}} disabled={qty === 0} style={{padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: qty > 0 ? '#3b82f6' : '#e2e8f0', color: qty > 0 ? 'white' : '#94a3b8', cursor: qty > 0 ? 'pointer' : 'not-allowed', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s'}}>Add</button>
      </div>
    </div>
  );
};

const ProductGallery = ({ category, subCategory, products, cart, onAddToCart, onCheckout, onSelectSub, subCategories }) => {
  if (!subCategory) {
    return (
      <>
        <h2 style={{fontSize: '22px', fontWeight: '700', marginBottom: '24px'}}>Select {category.name} Type</h2>
        <div style={STYLES.grid}>
          {subCategories.map((sub, idx) => (
            <div key={idx} style={STYLES.card} onClick={() => onSelectSub(sub)}>
              <div style={{height: '160px', overflow: 'hidden'}}><img src={sub.img} alt={sub.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>
              <div style={{padding: '20px', textAlign: 'center'}}>
                <h4 style={{fontSize: '16px', fontWeight: '600', margin: 0}}>{sub.name}</h4>
                <p style={{fontSize: '13px', color: '#64748b', marginTop: '6px'}}>View products</p>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }
  return (
    <div style={{display: 'flex', gap: '30px', flexDirection: 'column', lg: {flexDirection: 'row'}}}>
      <div style={{flex: 2}}>
        <h2 style={{fontSize: '22px', fontWeight: '700', marginBottom: '24px'}}>{subCategory.name}</h2>
        <div style={{backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '8px'}}>
          {products.map((prod, idx) => (<ProductItem key={idx} product={prod} onAdd={(qty) => onAddToCart(prod, qty)} />))}
        </div>
      </div>
      {cart.length > 0 && (
        <div style={{flex: 1, minWidth: '300px'}}>
          <div style={{backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', position: 'sticky', top: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}>
            <h3 style={{fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}><ShoppingCart size={18}/> Your Cart</h3>
            {cart.map((item, i) => (
              <div key={i} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', borderBottom: '1px dashed #e2e8f0', paddingBottom: '8px'}}>
                <span>{item.name} <span style={{color: '#64748b'}}>x{item.qty}</span></span><span style={{fontWeight: '600'}}>₹{item.price * item.qty}</span>
              </div>
            ))}
            <button onClick={onCheckout} style={{...STYLES.btnPrimary, width: '100%', justifyContent: 'center', marginTop: '24px'}}>Proceed <ArrowUpRight size={18}/></button>
          </div>
        </div>
      )}
    </div>
  );
};

const OrderForm = ({ cart, onPlaceOrder, onBack }) => {
  const [form, setForm] = useState({ name: "", mobile: "", address: "", distance: 0, advancePercent: 20, discount: 0, discountType: 'percent' });
  const [loadingDist, setLoadingDist] = useState(false);

  const itemTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const deliveryCharge = form.distance * DELIVERY_RATE_PER_KM;
  const discountAmount = form.discountType === 'percent' ? (itemTotal * form.discount / 100) : form.discount;
  const grandTotal = itemTotal + deliveryCharge - discountAmount;
  const advanceAmount = (grandTotal * form.advancePercent) / 100;

  const handleCalcDistance = async () => {
    if(!form.address) return;
    setLoadingDist(true);
    const dist = await calculateDistance('Warehouse', form.address);
    setForm(prev => ({ ...prev, distance: dist }));
    setLoadingDist(false);
  };

  return (
    <div style={{maxWidth: '800px', margin: '0 auto'}}>
      <h2 style={{fontSize: '24px', fontWeight: '700', marginBottom: '24px'}}>New Order Checkout</h2>
      <div style={{backgroundColor: 'white', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'}}>
        <h4 style={{fontSize: '14px', fontWeight: '700', color: '#64748b', marginBottom: '16px', textTransform: 'uppercase'}}>Customer Details</h4>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px'}}>
          <div><label style={STYLES.label}>Customer Name</label><input style={STYLES.input} type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Enter Full Name"/></div>
          <div><label style={STYLES.label}>Mobile Number</label><input style={STYLES.input} type="tel" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} placeholder="9876543210"/></div>
        </div>
        <div style={{marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px dashed #e2e8f0'}}>
          <label style={STYLES.label}>Delivery Address</label>
          <div style={{display: 'flex', gap: '12px'}}>
            <input style={STYLES.input} type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="House No, Street, City"/>
            <button onClick={handleCalcDistance} style={{...STYLES.btnSecondary, whiteSpace: 'nowrap'}}>{loadingDist ? 'Calculating...' : <><MapPin size={16} style={{marginRight: '6px', verticalAlign: 'middle'}}/> Get Distance</>}</button>
          </div>
          {form.distance > 0 && (
            <div style={{marginTop: '12px', padding: '10px', backgroundColor: '#f0fdf4', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{fontSize: '13px', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '6px'}}><Truck size={14}/> Distance: <strong>{form.distance} km</strong></span>
              <span style={{fontSize: '13px', fontWeight: '600', color: '#166534'}}>Delivery Charge: ₹{deliveryCharge}</span>
            </div>
          )}
        </div>
        <h4 style={{fontSize: '14px', fontWeight: '700', color: '#64748b', marginBottom: '16px', textTransform: 'uppercase'}}>Payment & Discount</h4>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px'}}>
          <div>
            <label style={STYLES.label}>Discount</label>
            <div style={{display: 'flex', gap: '8px'}}>
              <input type="number" style={STYLES.input} value={form.discount} onChange={e => setForm({...form, discount: Number(e.target.value)})} />
              <select style={{...STYLES.input, width: '80px'}} value={form.discountType} onChange={e => setForm({...form, discountType: e.target.value})}><option value="percent">%</option><option value="flat">₹</option></select>
            </div>
          </div>
          <div><label style={STYLES.label}>Advance (%)</label><input style={STYLES.input} type="number" value={form.advancePercent} onChange={e => setForm({...form, advancePercent: Number(e.target.value)})} /></div>
        </div>
        <div style={{marginBottom: '32px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px'}}><span style={{color: '#64748b'}}>Item Total:</span><span>₹{itemTotal.toLocaleString()}</span></div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px'}}><span style={{color: '#64748b'}}>Delivery:</span><span>+ ₹{deliveryCharge}</span></div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px'}}><span style={{color: '#16a34a'}}>Discount:</span><span style={{color: '#16a34a'}}>- ₹{discountAmount}</span></div>
          <div style={{borderTop: '1px solid #e2e8f0', margin: '8px 0'}}></div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700', color: '#1e293b'}}><span>Grand Total:</span><span>₹{grandTotal.toLocaleString()}</span></div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '14px', color: '#64748b'}}><span>Advance Payable:</span><span style={{fontWeight: '600', color: '#3b82f6'}}>₹{advanceAmount.toLocaleString()}</span></div>
        </div>
        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '16px'}}>
          <button onClick={onBack} style={STYLES.btnSecondary}>Back</button>
          <button onClick={() => onPlaceOrder(form, grandTotal, advanceAmount, itemTotal)} style={STYLES.btnPrimary}>Place Order <CheckCircle size={18}/></button>
        </div>
      </div>
    </div>
  );
};

const OrdersList = ({ orders, onViewOrder }) => (
  <div style={{backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden'}}>
    <div style={{display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 0.5fr', padding: '16px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc', fontWeight: '600', color: '#475569', fontSize: '13px', textTransform: 'uppercase'}}>
      <div>Customer</div><div>Order ID</div><div>Total</div><div>Status</div><div>Date</div><div>Action</div>
    </div>
    {orders.map((order, idx) => (
      <div key={idx} style={{display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 0.5fr', padding: '16px', borderBottom: '1px solid #f1f5f9', alignItems: 'center', fontSize: '14px'}}>
        <div><div style={{fontWeight: '600'}}>{order.customerName}</div><div style={{fontSize: '12px', color: '#64748b'}}>{order.mobile}</div></div>
        <div style={{fontFamily: 'monospace', color: '#64748b'}}>{order.id}</div>
        <div style={{fontWeight: '600'}}>₹{order.finalAmount.toLocaleString()}</div>
        <div><span style={STYLES.badge(order.status)}>{order.status}</span></div>
        <div style={{color: '#64748b'}}>{order.date}</div>
        <button onClick={() => onViewOrder(order)} style={{padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: 'pointer', color: '#64748b'}}><ArrowUpRight size={16}/></button>
      </div>
    ))}
  </div>
);

const OrderDetails = ({ order, onBack, onUpdateStatus }) => {
  const [dispatchDate, setDispatchDate] = useState("");
  const handleDispatch = () => {
    if(!dispatchDate) return alert("Please select a dispatch date");
    const trackingId = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;
    onUpdateStatus(order.id, 'Dispatched', { dispatchDate, trackingId, trackingLink: `https://maps.google.com/?q=${encodeURIComponent(order.address)}` });
  };
  const steps = ['Pending', 'Approved', 'Dispatched', 'Delivered'];
  const currentStepIdx = steps.indexOf(order.status);

  return (
    <div style={{maxWidth: '1000px', margin: '0 auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
        <div>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}><h2 style={{fontSize: '24px', fontWeight: '700'}}>Order #{order.id}</h2><span style={STYLES.badge(order.status)}>{order.status}</span></div>
          <p style={{color: '#64748b', fontSize: '13px', marginTop: '4px'}}>Placed on {order.date}</p>
        </div>
        <button onClick={onBack} style={STYLES.btnSecondary}>Back to Orders</button>
      </div>
      <div style={{backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px', display: 'flex', justifyContent: 'space-between'}}>
        {steps.map((step, i) => (
          <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative'}}>
            <div style={{width: '32px', height: '32px', borderRadius: '50%', backgroundColor: i <= currentStepIdx ? '#22c55e' : '#f1f5f9', color: i <= currentStepIdx ? 'white' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', zIndex: 1}}>{i < currentStepIdx ? <CheckCircle size={16}/> : i + 1}</div>
            <span style={{fontSize: '12px', fontWeight: '600', marginTop: '8px', color: i <= currentStepIdx ? '#1e293b' : '#94a3b8'}}>{step}</span>
            {i < steps.length - 1 && (<div style={{position: 'absolute', top: '16px', left: '50%', width: '100%', height: '2px', backgroundColor: i < currentStepIdx ? '#22c55e' : '#f1f5f9'}}></div>)}
          </div>
        ))}
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px'}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
          <div style={{backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
            <h4 style={{fontSize: '16px', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px'}}>Order Breakdown</h4>
            {order.items.map((item, i) => (
              <div key={i} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px'}}>
                <div><p style={{fontWeight: '600', margin: 0}}>{item.name}</p><p style={{color: '#64748b', fontSize: '12px', margin: 0}}>₹{item.price} x {item.qty} {item.unit}</p></div><p style={{fontWeight: '600'}}>₹{item.price * item.qty}</p>
              </div>
            ))}
            <div style={{borderTop: '1px dashed #e2e8f0', margin: '16px 0'}}></div>
            <div style={{fontSize: '14px', spaceY: '8px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}><span>Delivery ({order.distance}km):</span><span>₹{order.deliveryCharge}</span></div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#16a34a'}}><span>Discount:</span><span>- ₹{order.discountAmount}</span></div>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '700', margin: '12px 0'}}><span>Total:</span><span>₹{order.finalAmount}</span></div>
              <div style={{display: 'flex', justifyContent: 'space-between', color: '#64748b'}}><span>Advance Paid:</span><span>₹{order.advancePaid}</span></div>
              <div style={{display: 'flex', justifyContent: 'space-between', color: '#dc2626', fontWeight: '600'}}><span>Balance Due:</span><span>₹{order.finalAmount - order.advancePaid}</span></div>
            </div>
          </div>
          <div style={{backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
            <h4 style={{fontSize: '16px', fontWeight: '700', marginBottom: '16px'}}>Delivery Info</h4>
            <div style={{fontSize: '14px', color: '#334155'}}><p><strong>Name:</strong> {order.customerName}</p><p><strong>Mobile:</strong> {order.mobile}</p><p><strong>Address:</strong> {order.address}</p></div>
          </div>
        </div>
        <div style={{backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', height: 'fit-content'}}>
          <h4 style={{fontSize: '16px', fontWeight: '700', marginBottom: '16px'}}>Actions</h4>
          {order.status === 'Pending' && <button onClick={() => onUpdateStatus(order.id, 'Approved')} style={{...STYLES.btnPrimary, width: '100%', justifyContent: 'center'}}>Approve Order</button>}
          {order.status === 'Approved' && <div><input type="date" style={{...STYLES.input, marginBottom: '16px'}} value={dispatchDate} onChange={e => setDispatchDate(e.target.value)} /><button onClick={handleDispatch} style={{...STYLES.btnPrimary, width: '100%', justifyContent: 'center', backgroundColor: '#7e22ce'}}>Dispatch</button></div>}
          {order.status === 'Dispatched' && <div><div style={{padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0', marginBottom: '16px'}}><p style={{fontSize: '12px', color: '#166534'}}><strong>Tracking ID:</strong> {order.trackingId}</p></div><button onClick={() => onUpdateStatus(order.id, 'Delivered')} style={{...STYLES.btnPrimary, width: '100%', justifyContent: 'center'}}>Mark Delivered</button></div>}
          {order.status === 'Delivered' && <div style={{textAlign: 'center', color: '#16a34a', fontWeight: '600'}}><CheckCircle size={48} style={{margin: '0 auto 12px auto'}}/><p>Delivered</p></div>}
        </div>
      </div>
    </div>
  );
};

// --- 3. MAIN DASHBOARD ---

const NavItem = ({ icon, label, active, onClick, isOpen }) => (
  <div onClick={onClick} style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', margin: '4px 0', borderRadius: '8px', cursor: 'pointer', backgroundColor: active ? 'rgba(34, 197, 94, 0.1)' : 'transparent', color: active ? '#4ade80' : '#94a3b8', transition: 'all 0.2s'}}>
    {icon}
    {isOpen && <span style={{fontSize: '14px', fontWeight: '500'}}>{label}</span>}
  </div>
);

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([
    { id: "ORD-2024-001", customerName: "Rajesh Kumar", mobile: "9876543210", address: "Jubilee Hills, Hyd", distance: 12, items: [{ name: "Red Clay Brick", qty: 5000, price: 12, unit: 'piece' }], finalAmount: 60000, advancePaid: 12000, deliveryCharge: 480, discountAmount: 0, status: "Pending", dispatchDate: "", trackingId: "", date: "2024-01-20" }
  ]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [kpi, setKpi] = useState({ revenue: 145890, activeOrders: 1, lowStock: 2, itemsSold: 5000 });

  const addToCart = (product, qty) => {
    const existing = cart.find(c => c.id === product.id);
    if (existing) setCart(cart.map(c => c.id === product.id ? { ...c, qty: c.qty + qty } : c));
    else setCart([...cart, { ...product, qty }]);
  };

  const handlePlaceOrder = (formData, grandTotal, advanceAmount, itemTotal) => {
    const deliveryCharge = formData.distance * DELIVERY_RATE_PER_KM;
    const discountAmt = formData.discountType === 'percent' ? (itemTotal * formData.discount / 100) : formData.discount;
    const totalItems = cart.reduce((acc, i) => acc + i.qty, 0);
    const newOrder = {
      id: `ORD-2024-${String(orders.length + 1).padStart(3, '0')}`,
      customerName: formData.name, mobile: formData.mobile, address: formData.address, distance: formData.distance,
      items: [...cart], finalAmount: grandTotal, advancePaid: advanceAmount, deliveryCharge, discountAmount: discountAmt,
      status: "Pending", dispatchDate: "", trackingId: "", date: new Date().toISOString().split('T')[0]
    };
    setOrders([newOrder, ...orders]);
    setKpi(prev => ({ ...prev, revenue: prev.revenue + grandTotal, activeOrders: prev.activeOrders + 1, itemsSold: prev.itemsSold + totalItems }));
    setCart([]);
    setCurrentView('orders');
  };

  const handleUpdateStatus = (orderId, newStatus, extraData = {}) => {
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: newStatus, ...extraData } : o);
    setOrders(updatedOrders);
    setSelectedOrder(updatedOrders.find(o => o.id === orderId));
    if (newStatus === 'Delivered') setKpi(prev => ({ ...prev, activeOrders: Math.max(0, prev.activeOrders - 1) }));
  };

  const handleInventoryClick = () => {
    setCurrentView('inventory');
    setSelectedCategory(null);
    setSelectedSubCategory(null);
  };

  const handleInventorySubCategorySelect = (category, subCat) => {
    setSelectedCategory(category);
    setSelectedSubCategory(subCat);
    setCurrentView('inventory-products'); // Separate view state for inventory flow
  };

  const sidebarStyle = { width: isSidebarOpen ? '260px' : '80px', backgroundColor: '#0f172a', color: 'white', transition: 'width 0.3s', display: 'flex', flexDirection: 'column', zIndex: 20, flexShrink: 0 };

  return (
    <div style={{display: 'flex', height: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif', color: '#1e293b', overflow: 'hidden'}}>
      <aside style={sidebarStyle}>
        <div style={{height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #1e293b'}}>
          <div style={{width: '32px', height: '32px', backgroundColor: '#22c55e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>B</div>
          {isSidebarOpen && <span style={{marginLeft: '10px', fontWeight: 'bold', fontSize: '18px'}}>BuildMate</span>}
        </div>
        <div style={{padding: '24px 12px', flex: 1}}>
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active={['dashboard', 'subcategory', 'products'].includes(currentView)} onClick={() => setCurrentView('dashboard')} isOpen={isSidebarOpen}/>
          <NavItem icon={<ShoppingCart size={20}/>} label="Orders" active={['orders', 'orderDetail'].includes(currentView)} onClick={() => setCurrentView('orders')} isOpen={isSidebarOpen}/>
          <NavItem icon={<Package size={20}/>} label="Inventory" active={['inventory', 'inventory-products'].includes(currentView)} onClick={handleInventoryClick} isOpen={isSidebarOpen}/>
          <NavItem icon={<Users size={20}/>} label="Customers" isOpen={isSidebarOpen}/>
        </div>
        <div style={{padding: '16px'}}><button style={{display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer'}}><LogOut size={20}/> {isSidebarOpen && "Logout"}</button></div>
      </aside>

      <div style={{flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
        <header style={{height: '64px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#64748b'}}><Menu size={20}/></button>
            <div style={{position: 'relative'}}><Search size={16} style={{position: 'absolute', left: '12px', top: '10px', color: '#94a3b8'}}/><input type="text" placeholder="Search..." style={{...STYLES.input, paddingLeft: '36px', width: '280px', backgroundColor: '#f1f5f9', border: 'none'}} /></div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}><Bell size={20} color="#64748b" style={{cursor: 'pointer'}}/><div style={{width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><User size={20} color="#64748b"/></div></div>
        </header>

        <main style={{flex: 1, padding: '32px', overflowY: 'auto'}}>
          {currentView === 'dashboard' && (
            <>
              <DashboardCards kpi={kpi} />
              <h2 style={{fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#1e293b'}}>Material Stocks</h2>
              <MaterialTypes categories={MATERIALS_DATA.categories} onSelect={(cat) => { setSelectedCategory(cat); setSelectedSubCategory(null); setCurrentView('subcategory'); }} />
            </>
          )}

          {currentView === 'subcategory' && selectedCategory && (
            <>
              <div style={{marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#64748b', cursor: 'pointer'}} onClick={() => setCurrentView('dashboard')}><ArrowLeft size={16}/> Back to Dashboard</div>
              <ProductGallery category={selectedCategory} subCategory={null} subCategories={MATERIALS_DATA.subCategories[selectedCategory.name] || MATERIALS_DATA.subCategories['default']} products={[]} cart={cart} onSelectSub={(sub) => { setSelectedSubCategory(sub); setCurrentView('products'); }} />
            </>
          )}

          {currentView === 'products' && selectedSubCategory && (
            <>
              <div style={{marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#64748b', cursor: 'pointer'}} onClick={() => setCurrentView('subcategory')}><ArrowLeft size={16}/> Back to Types</div>
              <ProductGallery category={selectedCategory} subCategory={selectedSubCategory} products={MATERIALS_DATA.products[selectedSubCategory.name] || MATERIALS_DATA.products['default']} cart={cart} onAddToCart={addToCart} onCheckout={() => setCurrentView('checkout')} />
            </>
          )}

          {currentView === 'checkout' && <OrderForm cart={cart} onPlaceOrder={handlePlaceOrder} onBack={() => setCurrentView(currentView === 'inventory-products' ? 'inventory-products' : 'products')} />}
          
          {currentView === 'orders' && (
            <>
              <h2 style={{fontSize: '24px', fontWeight: '700', marginBottom: '24px'}}>Order Management</h2>
              <OrdersList orders={orders} onViewOrder={(o) => { setSelectedOrder(o); setCurrentView('orderDetail'); }} />
            </>
          )}

          {currentView === 'orderDetail' && selectedOrder && <OrderDetails order={selectedOrder} onBack={() => setCurrentView('orders')} onUpdateStatus={handleUpdateStatus} />}

          {/* Full Inventory View */}
          {currentView === 'inventory' && (
            <>
              <h2 style={{fontSize: '24px', fontWeight: '700', marginBottom: '24px'}}>Full Inventory</h2>
              {MATERIALS_DATA.categories.map((cat, idx) => {
                const subCats = MATERIALS_DATA.subCategories[cat.name] || MATERIALS_DATA.subCategories['default'];
                return (
                  <div key={idx} style={{marginBottom: '32px'}}>
                    <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#475569'}}>{cat.name}</h3>
                    <div style={STYLES.grid}>
                      {subCats.map((sub, subIdx) => (
                        <div key={subIdx} style={STYLES.card} onClick={() => handleInventorySubCategorySelect(cat, sub)}>
                          <div style={{height: '140px', overflow: 'hidden'}}><img src={sub.img} alt={sub.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>
                          <div style={{padding: '16px', textAlign: 'center'}}>
                            <h4 style={{fontSize: '15px', fontWeight: '600', margin: 0}}>{sub.name}</h4>
                            <p style={{fontSize: '12px', color: '#64748b', marginTop: '4px'}}>View Details</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* Product View via Inventory Flow */}
          {currentView === 'inventory-products' && selectedSubCategory && (
            <>
              <div style={{marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#64748b', cursor: 'pointer'}} onClick={() => setCurrentView('inventory')}><ArrowLeft size={16}/> Back to Full Inventory</div>
              <ProductGallery category={selectedCategory} subCategory={selectedSubCategory} products={MATERIALS_DATA.products[selectedSubCategory.name] || MATERIALS_DATA.products['default']} cart={cart} onAddToCart={addToCart} onCheckout={() => setCurrentView('checkout')} />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;