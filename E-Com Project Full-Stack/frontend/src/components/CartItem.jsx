import React from 'react'

export default function CartItem({ item, onRemove, onUpdate }) {
  return (
    <div className="row" style={{padding:'8px 0', borderBottom: '1px dashed rgba(255,255,255,0.1)'}}>
      <div style={{flex:1}}>
        <div style={{fontWeight:700}}>{item.name}</div>
        <div className="muted">₹ {item.price.toFixed(2)} × {item.qty} = <strong>₹ {Number(item.lineTotal).toFixed(2)}</strong></div>
      </div>
      <div className="row" style={{gap:8}}>
        <input type="number" min="1" value={item.qty} onChange={(e)=>onUpdate(item.cartId, Number(e.target.value))} style={{width:80}}/>
        <button className="ghost" onClick={() => onRemove(item.cartId)}>Remove</button>
      </div>
    </div>
  )
}
