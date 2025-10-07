import React, { useEffect, useRef, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { createChart } from 'lightweight-charts'

function usePing() {
  const [data, setData] = useState(null)
  useEffect(() => {
    fetch('/api/ping').then(r => r.json()).then(setData).catch(()=>setData({status:'offline'}))
  }, [])
  return data
}

function useDefaults() {
  const [defs, setDefs] = useState(null)
  useEffect(() => { fetch('/api/defaults').then(r=>r.json()).then(setDefs) }, [])
  return defs
}

function Hero(){
  const ping = usePing()
  const defs = useDefaults()
  const navigate = useNavigate()
  return (
    <div className="container">
      <div className="hero">
        <h1 style={{fontSize:40, margin:0, lineHeight:1.1}}>
          Hybrid Pro — Plateforme de Trading<br/>
          <span style={{color:'var(--accent)'}}>20 cryptos USDT Futures</span>
        </h1>
        <p style={{color:'var(--muted)', maxWidth:780}}>
          Price action + indicateurs avancés (EMA/RSI/MACD/Bollinger/OBV), gestion du risque (SL/TP, sizing), 
          alertes et monitoring temps réel. Front React + API FastAPI — une seule URL Cloud Run.
        </p>
        <div style={{display:'flex', gap:12}}>
          <button className="btn primary" onClick={()=>navigate('/dashboard')}>Ouvrir le Dashboard</button>
          <a className="btn" href="https://github.com/" target="_blank" rel="noreferrer">Voir le Code</a>
        </div>

        <div className="grid grid-3" style={{marginTop:24}}>
          <div className="card kpi"><span className="label">Statut API</span><span className="value">{ping?.status ?? '...'}</span></div>
          <div className="card kpi"><span className="label">Univers</span><span className="value">{defs?.universe?.length ?? '...' } pairs</span></div>
          <div className="card kpi"><span className="label">Indicateurs</span><span className="value">EMA/RSI/MACD/BB/OBV</span></div>
        </div>
      </div>
    </div>
  )
}

function MiniChart(){
  const ref = useRef(null)
  useEffect(()=>{
    const el = ref.current
    const chart = createChart(el, { width: el.clientWidth, height: 260, layout:{ background: { color: '#111727'}, textColor: '#8aa0b6'}, grid:{ vertLines:{color:'#1b2438'}, horzLines:{color:'#1b2438'} } })
    const series = chart.addLineSeries({ lineWidth: 2 })
    // demo data
    const now = Math.floor(Date.now()/1000)
    const data = Array.from({length:120}, (_,i)=>({ time: now- (120-i)*60, value: 60000 + Math.sin(i/6)*800 + Math.random()*300 }))
    series.setData(data)
    const onResize = ()=> chart.applyOptions({ width: el.clientWidth })
    window.addEventListener('resize', onResize)
    return ()=> { window.removeEventListener('resize', onResize); chart.remove() }
  }, [])
  return <div ref={ref} className="card" />
}

function Dashboard(){
  const defs = useDefaults()
  return (
    <div className="container" style={{display:'grid', gap:16}}>
      <div className="grid grid-3">
        <div className="card"><h3 style={{marginTop:0}}>Portefeuille</h3><p className="muted">Solde, marge, PnL, exposition.</p></div>
        <div className="card"><h3 style={{marginTop:0}}>Stratégies</h3><p className="muted">Hybrid / Momentum / Mean-Revert</p></div>
        <div className="card"><h3 style={{marginTop:0}}>Univers</h3><p style={{wordBreak:'break-word'}}>{defs?.universe?.join(' · ') ?? '...'}</p></div>
      </div>
      <MiniChart/>
      <div className="grid grid-3">
        <div className="card"><strong>Alertes</strong><p className="muted">Drawdown, liquidation, marge, frais.</p></div>
        <div className="card"><strong>Journal</strong><p className="muted">Exécutions & PnL récents.</p></div>
        <div className="card"><strong>Paramètres</strong><p className="muted">Clés Bitget, sécurité, sandbox.</p></div>
      </div>
    </div>
  )
}

export default function App(){
  return (
    <>
      <nav className="nav">
        <div className="brand">HYBRID <span style={{color:'var(--accent)'}}>PRO</span></div>
        <div style={{flex:1}}/>
        <Link to="/">Accueil</Link>
        <Link to="/dashboard">Dashboard</Link>
        <a className="btn" href="/api/ping">API</a>
        <a className="btn primary" href="/api/defaults">Defaults</a>
      </nav>
      <Routes>
        <Route path="/" element={<Hero/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
      <div className="footer">© {new Date().getFullYear()} Dr Bleou — Hybrid Pro</div>
    </>
  )
}
