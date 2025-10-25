import React, { useState } from 'react';
import Buscador from '../components/Buscador';
import CardCancha from '../components/CardCancha';

const canchasRecomendadas = [
  {
    id: 1,
    nombre: 'La Bombonera de Surco',
    ubicacion: 'Av. Primavera 123, Surco, Lima',
    precio: 70.00,
    imagen: 'https://placehold.co/400x300/3498DB/FFFFFF?text=Cancha+Futbol+1',
    lat: -12.1084, // Coordenada simulada
    lng: -77.0031, // Coordenada simulada
  },
  {
    id: 2,
    nombre: 'Estadio Monumental de La Molina',
    ubicacion: 'Jirón El Sol 456, La Molina, Lima',
    precio: 80.00,
    imagen: 'https://placehold.co/400x300/2ECC71/FFFFFF?text=Cancha+Futbol+2',
    lat: -12.0831, // Coordenada simulada
    lng: -76.9535, // Coordenada simulada
  },
  {
    id: 3,
    nombre: 'Canchas Basket Miraflores',
    ubicacion: 'Av. Larco 789, Miraflores, Lima',
    precio: 50.00,
    imagen: 'https://placehold.co/400x300/E67E22/FFFFFF?text=Cancha+Basket',
    lat: -12.1219, // Coordenada simulada
    lng: -77.0305, // Coordenada simulada
  },
  {
    id: 4,
    nombre: 'Tenis Club San Isidro',
    ubicacion: 'Calle Las Flores 101, San Isidro, Lima',
    precio: 60.00,
    imagen: 'https://placehold.co/400x300/F1C40F/FFFFFF?text=Cancha+Tenis',
    lat: -12.0950, // Coordenada simulada
    lng: -77.0381, // Coordenada simulada
  }
];

// Función de simulación de distancia (cálculo simple, no Haversine)
// Esto es solo para la demo, calcula una distancia "creíble".
const calculateFakeDistance = (userLoc, canchaLoc) => {
  const dx = userLoc.lat - canchaLoc.lat;
  const dy = userLoc.lng - canchaLoc.lng;
  // Multiplicamos por 111 (aprox. km por grado de latitud)
  const distance = Math.sqrt(dx * dx + dy * dy) * 111; 
  return distance.toFixed(1); // Retorna con 1 decimal, ej: "2.5"
};


const Inicio = () => {
  // Estado para manejar la lista de canchas (para poder actualizarlas con la distancia)
  const [canchas, setCanchas] = useState(canchasRecomendadas);
  // Estado para simular el "cargando" de la ubicación
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Función que simula la obtención de la ubicación del usuario
  const handleUseLocation = () => {
    console.log("Simulando obtención de ubicación...");
    setIsLoadingLocation(true);

    // Simulamos una llamada a la API de geolocalización (tarda 1 segundo)
    setTimeout(() => {
      // Ubicación simulada del usuario (Ej. un punto en Miraflores)
      const simulatedUserLocation = { lat: -12.1190, lng: -77.0311 };

      // Calculamos la distancia para cada cancha
      const canchasConDistancia = canchasRecomendadas.map(cancha => {
        const distancia = calculateFakeDistance(simulatedUserLocation, { lat: cancha.lat, lng: cancha.lng });
        return {
          ...cancha,
          distancia: parseFloat(distancia), // Añadimos la distancia al objeto
        };
      });

      // Ordenamos las canchas por distancia (las más cercanas primero)
      canchasConDistancia.sort((a, b) => a.distancia - b.distancia);

      // Actualizamos el estado con las nuevas canchas (que ahora tienen distancia)
      setCanchas(canchasConDistancia);
      setIsLoadingLocation(false);
      console.log("Ubicación simulada obtenida y distancias calculadas.");
    }, 1000);
  };


  return (
    <div>
      {/* Sección Hero (Banner principal) */}
      <div className="bg-blue-700 h-64 w-full relative">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold text-center p-4">
            Reserva tu cancha, <br /> vive tu pasión
          </h1>
        </div>
      </div>

      {/* Componente Buscador (Se superpone sobre el Hero) */}
      {/* Pasamos la función y el estado de 'loading' al Buscador */}
      <Buscador 
        onUseLocation={handleUseLocation}
        isLoading={isLoadingLocation}
      />

      {/* Sección de Recomendados (HU-013) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Recomendados
        </h2>

        {/* Grid de Canchas */}
        {/* Mapeamos desde el estado 'canchas' en lugar de la data mock directa */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {canchas.map((cancha) => (
            <CardCancha
              key={cancha.id}
              id={cancha.id}
              nombre={cancha.nombre}
              ubicacion={cancha.ubicacion}
              precio={cancha.precio}
              imagen={cancha.imagen}
              // Pasamos la nueva prop de distancia
              distancia={cancha.distancia} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inicio;