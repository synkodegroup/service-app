import { useQuery } from '@tanstack/react-query'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

function App() {
  const { data } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const r = await fetch(`${baseURL}/healthz`)
      return r.json() as Promise<{ status: string }>
    },
  })

  return (
    <div style={{ padding: 24 }}>
      <h1>Client</h1>
      <p>Coming soon.</p>
      <p>Backend health: {data?.status ?? 'checking...'}</p>
    </div>
  )
}

export default App
