import React, { useEffect, useState } from 'react'
export default function App(){
  const [resp,setResp]=useState(null); const [defs,setDefs]=useState(null);
  useEffect(()=>{ fetch('/api/ping').then(r=>r.json()).then(setResp); fetch('/api/defaults').then(r=>r.json()).then(setDefs); },[]);
  return (<div style={{fontFamily:'Inter, system-ui, Arial', padding:24}}>
    <h1>Hybrid Pro — Cloud Run</h1>
    <p>Interface React servie par FastAPI (même URL).</p>
    <pre style={{background:'#111',color:'#0f0',padding:12,borderRadius:8}}>{JSON.stringify(resp,null,2) || '...'}</pre>
    <h3>Paramètres par défaut</h3>
    <pre style={{background:'#111',color:'#0ff',padding:12,borderRadius:8}}>{JSON.stringify(defs,null,2) || '...'}</pre>
  </div>);
}
