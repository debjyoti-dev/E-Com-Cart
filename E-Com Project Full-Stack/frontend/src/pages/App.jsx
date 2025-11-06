import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard.jsx'
import CartItem from '../components/CartItem.jsx'
import ReceiptModal from '../components/ReceiptModal.jsx'

export default function App() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState({items:[], total:0})
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function fetchProducts() {
    const r = await fetch('/api/products')
    const data = await r.json()
    setProducts(data)
  }
  async function fetchCart() {
    const r = await fetch('/api/cart')
    const data = await r.json()
    setCart(data)
  }
  useEffect(()=>{
    fetchProducts(); fetchCart();
  }, [])

  async function addToCart(productId) {
    setLoading(true); setError('')
    try {
      const r = await fetch('/api/cart', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ productId, qty: 1 })
      })
      if (!r.ok) throw new Error('Add failed')
      await fetchCart()
    } catch (e) {
      setError('Failed to add item. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function removeItem(cartId) {
    setLoading(true); setError('')
    try {
      const r = await fetch(`/api/cart/${cartId}`, { method: 'DELETE' })
      if (!r.ok) throw new Error('Remove failed')
      await fetchCart()
    } catch (e) {
      setError('Failed to remove item.')
    } finally { setLoading(false) }
  }

  async function updateQty(cartId, qty) {
    if (qty < 1) return
    setLoading(true); setError('')
    try {
      const r = await fetch(`/api/cart/${cartId}`, {
        method: 'PATCH',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ qty })
      })
      if (!r.ok) throw new Error('Update failed')
      await fetchCart()
    } catch (e) {
      setError('Failed to update quantity.')
    } finally { setLoading(false) }
  }

  async function checkout() {
    if (!name || !email) { setError('Name and email required.'); return; }
    setLoading(true); setError('')
    try {
      const r = await fetch('/api/checkout', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ name, email })
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Checkout failed')
      setReceipt(data.receipt)
      setName(''); setEmail('')
      await fetchCart()
    } catch (e) {
      setError('Checkout failed.')
    } finally { setLoading(false) }
  }

  return (
    <div className="container">
      <header>
        <div className="brand">🛒 Vibe Commerce Mock Cart</div>
        <div className="muted">{cart.items.length} items • Total ₹ {Number(cart.total).toFixed(2)}</div>
      </header>

      {error && <div className="card" style={{border:'1px solid #ef4444'}}>⚠️ {error}</div>}
      {loading && <div className="card">Loading…</div>}

      <div className="grid">
        {products.map(p => (
          <ProductCard key={p.id} product={p} onAdd={addToCart} />
        ))}
      </div>

      <h2 style={{marginTop:28}}>Your Cart</h2>
      <div className="cart-panel">
        {cart.items.length === 0 ? <div className="muted">Cart is empty.</div> :
          cart.items.map(it => (
            <CartItem key={it.cartId} item={it} onRemove={removeItem} onUpdate={updateQty} />
          ))
        }
        <div className="row" style={{marginTop:12}}>
          <div style={{fontSize:18, fontWeight:800}}>Total</div>
          <div style={{fontSize:18, fontWeight:800}}>₹ {Number(cart.total).toFixed(2)}</div>
        </div>
      </div>

      <h2 style={{marginTop:28}}>Checkout</h2>
      <div className="card">
        <div className="row" style={{gap:12}}>
          <input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <button onClick={checkout}>Pay (Mock)</button>
        </div>
        <div className="muted">No real payments. You will get a mock receipt modal.</div>
      </div>

      <ReceiptModal receipt={receipt} onClose={()=>setReceipt(null)} />
    </div>
  )
}
