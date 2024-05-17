import routes from './map'
import { Route, Routes } from 'react-router-dom'

export const BASE_URL = '/'

export default function Router() {
  return (
    <Routes>
      {routes.map(({ path, component: Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
    </Routes>
  )
}
