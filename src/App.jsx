import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Inicio from './pages/Inicio';
import Login from './pages/Login';
import Registrar from './pages/Registrar';
import DetalleCancha from './pages/DetalleCancha/DetalleCancha';
import ProfileLayout from './components/ProfileLayout'; 
import PersonalData from './pages/profile/PersonalData';
import Favorites from './pages/profile/Favorites';
import Reservations from './pages/profile/Reservations';
import Security from './pages/profile/Security';
import DeleteAccount from './pages/profile/DeleteAccount';
import MyReviews from './pages/profile/MyReviews';

function App() {
  return (
    <Routes>
      
      {/* Rutas Públicas (van fuera del Layout principal) */}
      <Route path="/login" element={<Login />} />
      <Route path="/registrar" element={<Registrar />} />
      
      {/* Rutas Principales (van dentro del Layout principal con Header/Footer) */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="/cancha/:id" element={<DetalleCancha />} />

        {/*Rutas de Perfil (Anidadas dentro del ProfileLayout) */}
        <Route path="/perfil" element={<ProfileLayout />}>
          <Route path="datos" element={<PersonalData />} />
          <Route path="favoritos" element={<Favorites />} />
          <Route path="reservas" element={<Reservations />} />
          <Route path="reseñas" element={<MyReviews />} />
          <Route path="seguridad" element={<Security />} />
          <Route path="eliminar-cuenta" element={<DeleteAccount />} />
        </Route>

      </Route>


    </Routes>
  );
}

export default App;