import React from 'react';
import { Link } from 'react-router-dom';
// Importamos los datos para buscar las reseñas y los nombres de las canchas
import { canchasData } from '../../data/canchasData.js'; 

// --- Componente de Icono de Estrella (similar al de DetalleCancha) ---
const IconStar = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// Componente para renderizar las estrellas (igual que en DetalleCancha)
const ReviewStars = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <IconStar 
          key={i} 
          className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
        />
      ))}
    </div>
  );
};
// --- Fin Componentes de Iconos ---


const MyReviews = () => {
  // SIMULACIÓN: Asumimos que el usuario logueado es 'Juan Pérez'
  const currentUser = 'Juan Pérez'; 

  // Buscamos todas las reseñas del usuario actual en todas las canchas
  const userReviews = canchasData.reduce((acc, cancha) => {
    // Si la cancha tiene reseñas y alguna es del usuario actual...
    if (cancha.reviews && cancha.reviews.length > 0) {
      const reviewsFromThisCancha = cancha.reviews
        .filter(review => review.user === currentUser)
        // Añadimos el nombre y el ID de la cancha a cada reseña encontrada
        .map(review => ({ ...review, canchaNombre: cancha.nombre, canchaId: cancha.id })); 
      
      // Si encontramos reseñas, las añadimos al acumulador
      if (reviewsFromThisCancha.length > 0) {
        return [...acc, ...reviewsFromThisCancha];
      }
    }
    return acc; // Si no, devolvemos el acumulador sin cambios
  }, []); // Empezamos con un array vacío


  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mis Reseñas</h2>

      {userReviews.length > 0 ? (
        <div className="space-y-6">
          {userReviews.map((review) => (
            <div key={`${review.canchaId}-${review.id}`} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              {/* Enlace a la cancha reseñada */}
              <Link 
                to={`/cancha/${review.canchaId}`} 
                className="text-lg font-semibold text-blue-600 hover:underline mb-1 block"
              >
                {review.canchaNombre} 
              </Link>
              <div className="flex items-center justify-between mb-2">
                <ReviewStars rating={review.rating} />
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              <p className="text-gray-700 mb-3">{review.comment}</p>
              
              {/* Botones de acción (simulados) */}
              <div className="flex space-x-3 text-sm">
                <button className="text-blue-500 hover:underline">Editar</button>
                <button className="text-red-500 hover:underline">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Aún no has dejado ninguna reseña.</p>
      )}
    </div>
  );
};

export default MyReviews;