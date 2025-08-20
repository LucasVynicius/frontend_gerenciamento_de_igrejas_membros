import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // ADICIONE ESTA SEÇÃO DE PROXY
    proxy: {
      // Qualquer requisição que comece com '/api'
      '/api': {
        // Será redirecionada para o seu back-end
        target: 'http://localhost:8080',
        // Necessário para o back-end não rejeitar a requisição
        changeOrigin: true,
      },
    },
  },
})