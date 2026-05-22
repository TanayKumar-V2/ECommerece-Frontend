interface RateLimitConfig {
  windowMs: number
  max: number
  message?: string
}

interface Entry {
  timestamps: number[]
}

const store = new Map<string, Entry>()

function cleanup() {
  const now = Date.now()
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < 60000)
    if (entry.timestamps.length === 0) {
      store.delete(key)
    }
  }
}

setInterval(cleanup, 60_000)

function getIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  return forwarded?.split(',')[0]?.trim() || realIp || 'unknown'
}

export function rateLimit(config: RateLimitConfig) {
  const { windowMs, max, message = 'Too many requests. Please try again later.' } = config

  return (req: Request): { passed: boolean; message: string; status: number } => {
    const ip = getIp(req)
    const now = Date.now()
    const key = `${ip}:${config.windowMs}:${config.max}`

    let entry = store.get(key)
    if (!entry) {
      entry = { timestamps: [] }
      store.set(key, entry)
    }

    entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs)

    if (entry.timestamps.length >= max) {
      return { passed: false, message, status: 429 }
    }

    entry.timestamps.push(now)
    return { passed: true, message: '', status: 200 }
  }
}
