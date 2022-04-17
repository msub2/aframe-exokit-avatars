import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'index.js',
      name: 'A-Frame Exokit Avatars',
      formats: ['umd'],
      fileName: format => 'aframe-exokit-avatars.min.js'
    },
    rollupOptions: {
      external: ['three'],
      output: {
        globals: {
          three: 'THREE'
        }
      }
    }
  }
})