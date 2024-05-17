import { Suspense } from 'react'
import Router, { BASE_URL } from './router'
import { BrowserRouter } from 'react-router-dom'
import LoadingOrError from '@/components/LoadingOrError'

export default function App() {
  return (
    <BrowserRouter basename={BASE_URL}>
      <Suspense fallback={<LoadingOrError />}>
        <Router />
      </Suspense>
    </BrowserRouter>
  )
}
