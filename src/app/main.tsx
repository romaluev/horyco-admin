import React from 'react'
import ReactDOM from 'react-dom/client'

import { RouterProvider, createRouter } from '@tanstack/react-router'

import { routeTree } from '../routeTree.gen'

import './globals.css'
import 'nprogress/nprogress.css'

// Create router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

// Type registration for TypeScript
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
}
