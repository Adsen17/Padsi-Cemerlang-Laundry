export default function Toast({ message }) {
  return (
    <div style={{position:'fixed', right:20, top:20, zIndex:9999}}>
      <div style={{padding:'8px 12px', background:'#16a34a', color:'#fff', borderRadius:6, boxShadow:'0 2px 6px rgba(0,0,0,0.15)'}}>
        {message}
      </div>
    </div>
  )
}
