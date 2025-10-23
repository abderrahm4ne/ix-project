import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './components/routes/HomePage';
import ProductsPage from './components/routes/ProductsPage';
import ContactPage from './components/routes/ContactPage';
import OrderPage from './components/order/OrderPage';
import ProductPage from './components/product/ProductPage';
import AdminLogin from './admin/auth/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import ProtectedRoute from './admin/auth/ProtectedRoute';
import AdminProductsPage from './admin/AdminProductsPage';
import AdminContactsPage from './admin/AdminContactsPage';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='' element={<NavBar />}>
          <Route index element={<HomePage />} />
          <Route path='products' element={<ProductsPage />} />
          <Route path='products/:category/:slug' element={<ProductPage />} />
          <Route path='contact' element={<ContactPage />} />
          <Route path='CompleteYourOrder' element={<OrderPage />} />
        </Route>

        <Route path='secret/admin' element={<AdminLogin />} />

        <Route path='secret/admin/dashboard' element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>} >

          <Route index element={<AdminProductsPage />} />
          <Route path='admin-contacts' element={<AdminContactsPage />} />

        </Route>
        <Route path='*' element={<h1 className='font-bold text-black text-5xl'>404 - Page Not Found</h1>} />
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
