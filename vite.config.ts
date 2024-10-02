import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // cors: {
    //   origin: '*', // Autorise toutes les origines
    //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Spécifiez les méthodes autorisées
    //   allowedHeaders: ['Content-Type', 'Authorization'], // Définir les en-têtes autorisés
    // },
    proxy: {
      '/api': {
        target: 'https://api.barcelos.dev',
        // target: 'https://cors-anywhere.herokuapp.com/https://api.barcelos.dev', 
        // target: 'http://localhost:8080/', 
        changeOrigin: true, 
        secure: false,
        // headers: {
        //   'Access-Control-Allow-Origin': '*',
        //   'Origin': 'https://api.barcelos.dev'
        // },
        // followRedirects: false,
        
        rewrite: (path) => path.replace(/^\/api/, ''),
        // configure: (proxy, options) => {
        //   proxy.on('proxyReq', (proxyReq, req, res) => {
        //     // Gérer les headers ici si nécessaire
        //   });

        //   proxy.on('proxyRes', (proxyRes, req, res) => {
        //     // Gérer les réponses du serveur ici
        //     res.setHeader('Access-Control-Allow-Origin', '*');  // Autoriser l'origine
        //     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        //     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
        //   });
        // },
      },
    },
  },
});
