import React, { useEffect, useState } from 'react'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'
export default function App() {
  const [email, setEmail] = useState('admin@yoagronomist.com')
  const [password, setPassword] = useState('Admin@12345')
  const [token, setToken] = useState('')
  const [farmers, setFarmers] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [status, setStatus] = useState('Please log in')

  const login = async () => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    const data = await res.json()
    if (data.token) { setToken(data.token); setStatus('Login successful') } else { setStatus(data.error || 'Login failed') }
  }

  useEffect(() => {
    if (!token) return
    Promise.all([
      fetch(`${API_BASE_URL}/farmers`).then(r=>r.json()),
      fetch(`${API_BASE_URL}/alerts`).then(r=>r.json())
    ]).then(([f,a])=>{ setFarmers(f); setAlerts(a) })
  }, [token])

  return <div style={{ fontFamily:'Arial, sans-serif', maxWidth: 1000, margin:'40px auto', padding:20 }}>
    <h1>Yo Agronomist Admin</h1>
    {!token && <div style={{ display:'grid', gap:12, maxWidth:420 }}>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
      <button onClick={login}>Log in</button>
    </div>}
    <p>{status}</p>
    {token && <div style={{ display:'grid', gap:20, gridTemplateColumns:'1fr 1fr' }}>
      <div style={{ border:'1px solid #ddd', borderRadius:8, padding:16 }}><h3>Farmers</h3>{farmers.map((f:any)=><div key={f.id} style={{ marginBottom:10 }}><strong>{f.fullName}</strong><br />{f.district} - {f.farmerType}</div>)}</div>
      <div style={{ border:'1px solid #ddd', borderRadius:8, padding:16 }}><h3>Alerts</h3>{alerts.map((a:any)=><div key={a.id} style={{ marginBottom:10 }}><strong>{a.title}</strong><br />{a.message}</div>)}</div>
    </div>}
  </div>
}
