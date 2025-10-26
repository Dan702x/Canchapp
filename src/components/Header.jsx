import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaFutbol } from 'react-icons/fa'; 

// --- Iconos SVG ---
const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const IconClose = () => (
   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
// --- Fin Iconos SVG ---


const Header = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const profileMenuRef = useRef(null); 
  const mobileMenuRef = useRef(null); 

  // Hook para cerrar el MENÚ DE PERFIL si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Efecto para evitar scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);


  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center text-2xl font-bold text-blue-600 flex-shrink-0">
            <FaFutbol className="mr-2 h-7 w-7" />
            CanchApp
          </Link>

          {/* Navegación para Escritorio */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">
              Iniciar Sesión
            </Link>
            <Link to="/registrar" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium">
              Crear Cuenta
            </Link>

            {/* Menú de Perfil (Escritorio) */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} 
                className="flex items-center justify-center h-10 w-10 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Abrir menú de usuario"
              >
                <IconUser />
              </button>

              {isProfileMenuOpen && (
                <div 
                  ref={profileMenuRef}
                  className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
                  role="menu" aria-orientation="vertical"
                >
                  <div className="py-1" role="none">
                    <Link to="/perfil/datos" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" onClick={() => setIsProfileMenuOpen(false)}>Datos personales</Link>
                    <Link to="/perfil/favoritos" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" onClick={() => setIsProfileMenuOpen(false)}>Mis favoritos</Link>
                    <Link to="/perfil/reservas" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" onClick={() => setIsProfileMenuOpen(false)}>Mis reservas</Link>
                    <Link to="/perfil/reseñas" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" onClick={() => setIsProfileMenuOpen(false)}>Mis reseñas</Link>
                    <Link to="/perfil/seguridad" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" onClick={() => setIsProfileMenuOpen(false)}>Seguridad</Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button onClick={() => { console.log("Cerrando sesión..."); setIsProfileMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-500 hover:text-white rounded-b-md" role="menuitem">Cerrar sesión</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botón de Menú Móvil */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)} 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen} 
            >
              <span className="sr-only">Abrir menú principal</span>
              <IconMenu /> 
            </button>
          </div>
        </div>
      </nav>

      {/* --- Menú Móvil Lateral con Overlay --- */}
      {/* Contenedor principal que se muestra/oculta */}
      {isMobileMenuOpen && ( 
        <div 
          className="md:hidden fixed inset-0 z-40" 
          role="dialog" 
          aria-modal="true"
        >
          {/* Overlay (Fondo oscuro) */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity ease-in-out duration-300 opacity-100" // Opacidad siempre 100 cuando está visible
            aria-hidden="true"
            onClick={() => setIsMobileMenuOpen(false)} 
          ></div>

          {/* Panel del Menú Lateral */}
          <div 
            ref={mobileMenuRef} 
            // Aseguramos las clases de transición y posición
            className={`absolute inset-y-0 left-0 flex flex-col max-w-[80%] w-4/5 h-full bg-white shadow-xl transform transition-transform ease-in-out duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} 
            id="mobile-menu"
          >
            {/* Encabezado del Menú Móvil (Fijo arriba) */}
            <div className="flex items-center justify-between pt-5 pb-4 px-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-lg font-medium text-gray-900">Menú</h2>
              <button
                type="button"
                className="-mr-2 p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="sr-only">Cerrar menú</span>
                <IconClose />
              </button>
            </div>

            {/* Contenido del Menú (Scrollable) */}
            <div className="p-4 space-y-1 flex-grow overflow-y-auto"> 
              <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Iniciar Sesión</Link>
              <Link to="/registrar" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Crear Cuenta</Link>
              
              <div className="pt-4 pb-2 border-t border-gray-200">
                 <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mi Cuenta</p>
              </div>
              
              <Link to="/perfil/datos" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Datos personales</Link>
              <Link to="/perfil/favoritos" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Mis favoritos</Link>
              <Link to="/perfil/reservas" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Mis reservas</Link>
              <Link to="/perfil/reseñas" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Mis reseñas</Link>
              <Link to="/perfil/seguridad" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Seguridad</Link>
            </div>

            {/* Botón Cerrar Sesión (Abajo fijo) */}
            <div className="p-4 border-t border-gray-200 mt-auto flex-shrink-0">
               <button onClick={() => { console.log("Cerrando sesión..."); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-700 hover:text-red-900 hover:bg-red-50">Cerrar sesión</button>
            </div>
          </div> 
        </div> // CORREGIDO: Cierre del div role="dialog"
      )} {/* CORREGIDO: Cierre de la llave de isMobileMenuOpen */}
      {/* --- Fin Menú Móvil --- */}
    </header>
  );
};

export default Header;