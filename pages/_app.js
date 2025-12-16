import '../styles/globals.css'
import { useEffect, useState } from 'react'
import Toast from '../components/Toast'

export default function MyApp({ Component, pageProps }) {

  const [toast, setToast] = useState(null)

  const notify = (msg) => {
    setToast(msg)
  }

  useEffect(() => {
    if (toast) {
      const timeout = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timeout)
    }
  }, [toast])

  return (
    <>
      <Component {...pageProps} notify={notify} />
      {toast && <Toast message={toast} />}
    </>
  )
}
