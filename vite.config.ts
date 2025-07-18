import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/rup-api': {
        target: process.env.VITE_API_BASE_URL||'http://localhost:5173',
        changeOrigin: true,
        rewrite: (path) => {
          const newPath = path.replace(/^\/rup-api/, '');
          console.log(`🔄 Proxy rewrite: ${path} -> ${newPath}`);
          return newPath;
        },
        secure: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.error('❌ Proxy error:', err.message);
            console.error('Request details:', {
              url: req.url,
              method: req.method,
              headers: req.headers
            });
          });

          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`🌐 Proxying: ${req.method} ${req.url}`);
            console.log(`📡 Target: https://isb.lkpp.go.id${proxyReq.path}`);
            
            // Add headers for CORS
            proxyReq.setHeader('Accept', 'application/json');
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (compatible; RUP-Dashboard/1.0)');
          });

          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log(`📨 Response: ${proxyRes.statusCode} from ${req.url}`);
            
            // Log response headers for debugging
            console.log('Response headers:', {
              'content-type': proxyRes.headers['content-type'],
              'content-length': proxyRes.headers['content-length'],
              'access-control-allow-origin': proxyRes.headers['access-control-allow-origin']
            });
            
            // Add CORS headers to response
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
          });
        }
      }
    },
    // Add CORS configuration
    cors: true,
    // Increase timeout
    hmr: {
      timeout: 60000
    }
  },
  // Untuk debugging
  define: {
    __DEV__: JSON.stringify(true),
  }
})