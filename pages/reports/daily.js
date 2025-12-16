import { useEffect, useState } from 'react'

export default function DailyReport() {
  const [report, setReport] = useState([])

  useEffect(()=> {
    fetch('/api/report/daily').then(r=>r.json()).then(setReport)
  }, [])

  return (
    <div style={{padding:20}}>
      <h1>Daily Report (Products count)</h1>
      <pre>{JSON.stringify(report, null, 2)}</pre>
    </div>
  )
}
