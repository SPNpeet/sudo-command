import { useState } from 'react'

export default function RoiCalc({ t }) {
  const [spend, setSpend] = useState(15000)
  const [cpc, setCpc] = useState(6)
  const [conv, setConv] = useState(3)
  const [aov, setAov] = useState(1200)
  const clicks = spend / Math.max(0.1, cpc)
  const orders = clicks * (conv / 100)
  const revenue = orders * aov
  const profit = revenue - spend
  const roi = spend ? (profit / spend) * 100 : 0
  const fmt = (n) => n.toLocaleString('th-TH', { maximumFractionDigits: 0 })

  return (
    <div className="roi">
      <div className="roi-grid">
        <label>
          <span>งบแอด/เดือน (บาท)</span>
          <input type="range" min="3000" max="100000" step="1000" value={spend} onChange={(e) => setSpend(+e.target.value)} />
          <strong>{fmt(spend)}</strong>
        </label>
        <label>
          <span>CPC (บาท/คลิก)</span>
          <input type="range" min="2" max="15" step="0.5" value={cpc} onChange={(e) => setCpc(+e.target.value)} />
          <strong>{cpc.toFixed(1)}</strong>
        </label>
        <label>
          <span>อัตราปิด (%)</span>
          <input type="range" min="0.5" max="10" step="0.5" value={conv} onChange={(e) => setConv(+e.target.value)} />
          <strong>{conv}%</strong>
        </label>
        <label>
          <span>ยอดเฉลี่ย/ออเดอร์</span>
          <input type="range" min="500" max="5000" step="100" value={aov} onChange={(e) => setAov(+e.target.value)} />
          <strong>{fmt(aov)}</strong>
        </label>
      </div>
      <div className="roi-result">
        <div><span>คลิก</span><strong>{fmt(clicks)}</strong></div>
        <div><span>ออเดอร์</span><strong>{fmt(orders)}</strong></div>
        <div><span>รายได้</span><strong>{fmt(revenue)}</strong></div>
        <div className={profit >= 0 ? 'pos' : 'neg'}><span>กำไร</span><strong>{profit >= 0 ? '+' : ''}{fmt(profit)}</strong><em>{roi.toFixed(0)}% ROI</em></div>
      </div>
      <p className="roi-note">ลองขยับงบ/CPC ดู — ตัวเลขคำนวณสด ไม่มีการแต่ง</p>
    </div>
  )
}