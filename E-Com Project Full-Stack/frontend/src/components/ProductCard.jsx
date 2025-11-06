import React from 'react'

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="card">
      <img src={product.imageUrl || 'https://picsum.photos/seed/'+product.id+'/400/300'} alt={product.name} />
      <div className="row">
        <div>
          <div style={{fontWeight:800}}>{product.name}</div>
          <div className="muted">₹ {product.price.toFixed(2)}</div>
        </div>
        <button onClick={() => onAdd(product.id)}>Add</button>
      </div>
    </div>
  )
}
