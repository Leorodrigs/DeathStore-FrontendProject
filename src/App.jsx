import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth } from './components/authContext';
import { Login } from './pages/login'; 
import { Signup } from './pages/Signup';
import { Home } from './pages/Home'; 
import { Clients } from './pages/Clients';
import { ClientDetails } from './pages/ClientDetails';
import { ClientEdit } from './pages/ClientEdit';
import { MyProfile } from './pages/MyProfile';
import { Products } from './pages/Products';
import { ProductCreate } from './pages/ProductCreate';
import { ProductDetails } from './pages/ProductDetails';
import { ProductEdit } from './pages/ProductEdit';
import { ProductExpanded } from './pages/ProductExpand';
import { Cart } from './pages/Cart';


const AppContent = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <Routes>
      {user ? (        
        <>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/login" element={<Navigate to="/home" replace />} />
          <Route path="/signup" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
          <Route path="/admin/clients" element={<Clients />} />
          <Route path="/admin/clients/:id/details" element={<ClientDetails />} />
          <Route path="/admin/clients/:id/edit" element={<ClientEdit />} />
          <Route path="/me" element={<MyProfile />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/products/create" element={<ProductCreate />} />
          <Route path="/admin/products/:id/details" element={<ProductDetails />} />
          <Route path="/admin/products/:id/edit" element={<ProductEdit />} />
          <Route path="/product/:id" element={<ProductExpanded />} />
          <Route path="/carrinho" element={<Cart />} />


        
        </>
      ) : (        
        <>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
