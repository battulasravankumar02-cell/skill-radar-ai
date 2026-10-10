import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { handleOpportunitySearch, handleGeneratePlan, handleHealthCheck, handleChatSearch } from './backend/apiRouter.js'

const RAW_KEY = 'MGZhNzVjM2RiYTU2NjY4YzdkMjk1MDEwY2NmYmZmZWU3M2FhZmI0NTk3M2QxOWViZDI3MjllMDExOGEyNjQ4MA=='
const DEFAULT_SERPAPI_KEY = Buffer.from(RAW_KEY, 'base64').toString('utf8')

function nexguideLiveApiPlugin() {
  return {
    name: 'nexguide-live-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Parse request URL
        const url = req.url ? req.url.split('?')[0] : ''
        const clientApiKey = req.headers['x-serpapi-key'] || process.env.SERPAPI_KEY || DEFAULT_SERPAPI_KEY

        if (url === '/api/radar/search' && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', async () => {
            try {
              const parsed = body ? JSON.parse(body) : {}
              if (!parsed.serpApiKey) {
                parsed.serpApiKey = clientApiKey
              }
              const result = await handleOpportunitySearch(parsed)
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify(result))
            } catch (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: false, error: err.message }))
            }
          })
          return
        }

        if ((url === '/api/chat/ask' || url === '/api/radar/chat') && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', async () => {
            try {
              const parsed = body ? JSON.parse(body) : {}
              if (!parsed.serpApiKey) {
                parsed.serpApiKey = clientApiKey
              }
              const result = await handleChatSearch(parsed)
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify(result))
            } catch (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: false, error: err.message }))
            }
          })
          return
        }

        if (url === '/api/radar/plan' && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', async () => {
            try {
              const parsed = body ? JSON.parse(body) : {}
              const result = handleGeneratePlan(parsed)
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify(result))
            } catch (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: false, error: err.message }))
            }
          })
          return
        }

        if (url === '/api/radar/status' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json')
          res.statusCode = 200
          res.end(JSON.stringify(handleHealthCheck(clientApiKey)))
          return
        }

        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables (including SERPAPI_KEY from .env / .env.local)
  const env = loadEnv(mode, process.cwd(), '')
  process.env.SERPAPI_KEY = env.SERPAPI_KEY || process.env.SERPAPI_KEY || DEFAULT_SERPAPI_KEY

  return {
    root: 'frontend',
    publicDir: 'public',
    build: {
      outDir: '../dist',
      emptyOutDir: true,
    },
    plugins: [react(), nexguideLiveApiPlugin()],
  }
})

