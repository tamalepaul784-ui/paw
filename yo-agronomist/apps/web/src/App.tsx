import React, { useState } from 'react'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'
export default function App() {
  const [district, setDistrict] = useState('Mbarara')
  const [crop, setCrop] = useState('COFFEE')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    setLoading(true)
    const res = await fetch(`${API_BASE_URL}/advisory`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ district, crop, farmerType: 'COMMERCIAL' }) })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: 900, margin: '40px auto', padding: 20 }}>
    <h1>Yo Agronomist</h1>
    <p>AI agronomy advisory preview for Uganda.</p>
    <div style={{ display:'grid', gap:12, gridTemplateColumns:'1fr 1fr auto' }}>
      <input value={district} onChange={e=>setDistrict(e.target.value)} placeholder="District" />
      <select value={crop} onChange={e=>setCrop(e.target.value)}>
        <option value="MAIZE">Maize</option><option value="BEANS">Beans</option><option value="BANANA">Banana</option><option value="COFFEE">Coffee</option><option value="TOMATO">Tomato</option>
      </select>
      <button onClick={generate} disabled={loading}>{loading ? 'Loading...' : 'Get Advice'}</button>
    </div>
    {result && <div style={{ marginTop: 20, padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
      <h3>{result.crop} - {result.district}</h3>
      <p><strong>Planting window:</strong> {result.plantingWindow}</p>
      <p><strong>Advice:</strong> {result.districtAdvice}</p>
      <p><strong>Spacing:</strong> {result.agronomy?.spacing}</p>
      <p><strong>Nutrition:</strong> {result.agronomy?.fertilizer}</p>
      <p><strong>Pest watch:</strong> {result.agronomy?.pest}</p>
      <p><strong>Market signal:</strong> {result.marketSignal}</p>
    </div>}
  </div>
}
