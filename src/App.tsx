import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import PublicHome from './pages/PublicHome';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import CreateAddress from './pages/CreateAddress';
import { UserAccess } from './enums/UserAccess';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import CreateStore from './pages/CreateStore';
import MyStores from './pages/MyStores';
import CreateProduct from './pages/CreateProduct';
import CreateDemand from './pages/CreateDemand';
import DemandsRetailerView from './pages/DemandsRetailerView';
import UpdateDemand from './pages/UpdateDemand';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute allowedRoles={[UserAccess.STORE_OWNER, UserAccess.ADMIN]} />}>
              <Route path="/address" element={<CreateAddress />} />
              <Route path="/demand/update/:storeUUID/:demandUUID" element={<UpdateDemand />} />
              <Route path="/demand/:storeUUID" element={<CreateDemand />} />
              <Route path="/store" element={<CreateStore />} />
              <Route path="/my-stores" element={<MyStores />} />
              <Route path="/product" element={<CreateProduct />} />
              <Route path="/demands-retailer/:storeUUID" element={<DemandsRetailerView />} />
            </Route>
            <Route path="/" element={<PublicHome />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;