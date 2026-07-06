const CLAUDE_MODEL = 'claude-sonnet-5'
const CLAUDE_PROXY_URL = '/.netlify/functions/claude-proxy'
const API_KEY_STORAGE_KEY = 'gainz_dev_api_key'

// On localhost we call Anthropic directly using a key pasted into Settings
// (fine for local dev, never exported in the JSON backup). Once deployed
// anywhere else, the real key lives only in a Netlify environment variable
// and requests go through the proxy function instead — the client never
// holds a real key that could be read from devtools.
export function isLocalDev() {
  return ['localhost', '127.0.0.1', ''].includes(window.location.hostname)
}

export function getDevApiKey() {
  try { return localStorage.getItem(API_KEY_STORAGE_KEY) || '' } catch { return '' }
}

export function setDevApiKey(key) {
  try {
    if (key) localStorage.setItem(API_KEY_STORAGE_KEY, key)
    else localStorage.removeItem(API_KEY_STORAGE_KEY)
  } catch { /* storage unavailable */ }
}

// Sends a Messages API request body either directly to Anthropic (local dev,
// using the caller-supplied key) or through the Netlify proxy (deployed).
async function claudeRequest(bodyObj) {
  const body = JSON.stringify(bodyObj)
  if (isLocalDev()) {
    const apiKey = getDevApiKey()
    if (!apiKey) return null
    return fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'anthropic-dangerous-direct-browser-calls': 'true',
      },
      body,
    })
  }
  return fetch(CLAUDE_PROXY_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
  })
}

export async function askClaudeForJSON(prompt, maxTokens = 600) {
  const res = await claudeRequest({
    model: CLAUDE_MODEL,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  })
  if (!res) return { demo: true }
  if (!res.ok) {
    const errBody = await res.json().catch(() => null)
    throw new Error(errBody?.error?.message || errBody?.error || `HTTP ${res.status}`)
  }
  const data = await res.json()
  const text = data.content?.[0]?.text || ''
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Unexpected response from Claude.')
  return JSON.parse(match[0])
}
