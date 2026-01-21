// Environment types are defined in src/vite-env.d.ts
// This file is kept for backwards compatibility

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
  }
}
