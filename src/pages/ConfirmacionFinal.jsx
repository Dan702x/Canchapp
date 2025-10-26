import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Componente para el ícono de verificación (Checkmark)
const IconCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const ConfirmacionFinal = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Dejamos en 'true' para que se vean los detalles al cargar
    const [showDetails, setShowDetails] = useState(true); 

    // Recuperamos los datos pasados (usando datos simulados si falla)
    const { 
        canchaNombre = 'Canchas Basket Miraflores', 
        fecha = '26/10/2025', 
        hora = '10:30 - 11:30', 
        monto = 80.00 
    } = location.state || {};
    
    // Datos fijos del mockup
    const nReserva = 'R-000123';
    const sede = 'Sede Central';
    const montoSimulado = monto;

    // DATOS SIMULADOS ALINEADOS CON EL ESTADO PENDIENTE
    const paymentData = {
        reservaEstado: 'PENDIENTE DE PAGO', 
        metodoPago: '---', 
        precioTotal: montoSimulado.toFixed(2), 
    };

    // FUNCIÓN PARA EL BOTÓN DE PAGO
    const handleGoToPayment = () => {
        // Redirige a la página de pago simulada
        navigate('/reservar/pago');
    };

    return (
        // 🎯 CÓDIGO CORREGIDO: Usamos flex, items-center y justify-center para centrar verticalmente
        <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center">
            <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-2xl text-center">
                
                <h1 className="text-4xl font-bold text-green-600 mb-4 flex items-center justify-center">
                    ¡Reserva confirmada! 
                </h1>
                
                {/* Ícono de Verificación (Checkmark) */}
                <div className="my-6 border-4 border-green-300 border-dashed rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                    <IconCheck />
                </div>
                

                <div className="text-left space-y-3 mb-6 text-base font-medium">
                    <p><strong>N° Reserva:</strong> <span className="text-blue-600">{nReserva}</span></p>
                    <p><strong>Cancha:</strong> {canchaNombre}</p>
                    <p><strong>Sede:</strong> {sede}</p>
                    <p><strong>Fecha/Hora:</strong> {fecha} {hora}</p>
                    <p><strong>Monto:</strong> <span className="text-green-700 font-bold">S/ {montoSimulado.toFixed(2)}</span></p>
                </div>
                
                {/* ----------------- DETALLES OCULTOS ----------------- */}
                {showDetails && (
                    <div className="bg-gray-100 p-4 mt-4 rounded-lg text-left text-sm space-y-1 mb-6">
                        <p className="font-semibold mb-1">Detalles de la Transacción:</p>
                        
                        <p><strong>Estado de la Reserva:</strong> <span className="text-red-500 font-bold">{paymentData.reservaEstado}</span></p>
                        <p><strong>Método de Pago:</strong> {paymentData.metodoPago}</p>
                        {/* Línea eliminada: Ya no se muestra el Transacción ID */}
                        <p><strong>Precio Total:</strong> S/ {paymentData.precioTotal}</p>

                    </div>
                )}
                {/* ----------------- FIN DETALLES OCULTOS ----------------- */}

                <p className="text-gray-600 mb-8 text-sm">
                    Te enviaremos los detalles de tu reserva a tu correo electrónico.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-3">
                    {/* Botón "Ver Detalles" (Toggle) */}
                    <button 
                        onClick={() => setShowDetails(!showDetails)}
                        className="py-2 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-200"
                    >
                        {showDetails ? 'Ocultar Detalles' : 'Ver Detalles'}
                    </button>
                    
                    {/* Botón "Ir al pago de cancha" */}
                    <button 
                        onClick={handleGoToPayment}
                        className="py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Ir al pago de cancha
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmacionFinal;