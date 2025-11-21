import { useState } from 'react'

function App() {
  const [followers, setFollowers] = useState('')
  const [handle, setHandle] = useState('')
  const [contact, setContact] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)

    const value = Number(followers)
    if (!Number.isFinite(value) || value < 0) {
      setError('Please enter a valid non-negative number of followers.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instagram_handle: handle?.trim() || null,
          followers: value,
          contact: contact?.trim() || null,
          note: note?.trim() || null,
        }),
      })

      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || `Request failed: ${res.status}`)
      }
      const data = await res.json()
      setResult(data)
      setFollowers('')
      setHandle('')
      setContact('')
      setNote('')
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.06),transparent_50%)]" />

      <div className="relative min-h-screen flex items-center justify-center p-6">
        <div className="max-w-xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white tracking-tight">Instagram Followers Notify</h1>
            <p className="text-blue-200 mt-3">Enter the follower count and send it. You'll receive a notification if a webhook is configured.</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 shadow-xl">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-blue-200 mb-1">Followers</label>
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={followers}
                  onChange={(e) => setFollowers(e.target.value)}
                  className="w-full rounded-lg bg-slate-900/60 border border-slate-700 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 12000"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-blue-200 mb-1">Instagram handle (optional)</label>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full rounded-lg bg-slate-900/60 border border-slate-700 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="@yourname"
                  />
                </div>
                <div>
                  <label className="block text-sm text-blue-200 mb-1">Contact (optional)</label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full rounded-lg bg-slate-900/60 border border-slate-700 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="email or phone"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-blue-200 mb-1">Note (optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full rounded-lg bg-slate-900/60 border border-slate-700 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Anything else to share?"
                />
              </div>

              {error && (
                <div className="text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-sm">
                  {error}
                </div>
              )}

              {result && (
                <div className="text-green-300 bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2 text-sm">
                  Sent successfully. Reference ID: {result.id}. Notification: {result.notify}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {loading ? 'Sending...' : 'Send'}
              </button>

              <p className="text-xs text-blue-300/70 text-center">Backend: {baseUrl}</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
