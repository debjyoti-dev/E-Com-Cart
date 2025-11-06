import React from 'react'

export default function ReceiptModal({ receipt, onClose }) {
  if (!receipt) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <h2 style={{marginTop:0}}>✅ Order Confirmed</h2>
        <div className="muted">Receipt ID: {receipt.id}</div>
        <div className="muted">When: {new Date(receipt.timestamp).toLocaleString()}</div>
        <hr style={{opacity:.15}}/>
        <div>
          {receipt.items.map((it, idx)=>(
            <div key={idx} className="row" style={{padding:'6px 0'}}>
              <div style={{flex:1}}>{it.name} × {it.qty}</div>
              <div>₹ {Number(it.lineTotal).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <hr style={{opacity:.15}}/>
        <div className="row">
          <div style={{fontWeight:800}}>Total</div>
          <div style={{fontWeight:800}}>₹ {Number(receipt.total).toFixed(2)}</div>
        </div>
        <div style={{marginTop:16, textAlign:'right'}}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
