import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { HomePage, RoutePage } from './pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: ':shortUrl',
    element: <RoutePage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
