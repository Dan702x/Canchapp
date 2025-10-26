// src/pages/DetalleCancha/ComprobantePago.jsx

import { Link, useNavigate } from 'react-router-dom';

// Datos simulados del comprobante 
const simulatedReceiptData = {
    cancha: 'Cancha Sintética San Juan',
    fecha: 'Sábado, 28 de Septiembre',
    hora: '6:00 PM - 7:00 PM',
    metodo: 'Tarjeta de crédito (**** 1234)',
    monto: 80.00,
    operacion: '000123456789',
};

// Componente para el ícono de verificación
const IconCheckSquare = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const ComprobantePago = () => {
    const navigate = useNavigate();
    const data = simulatedReceiptData;

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center py-10">
            <div className="max-w-xl w-full p-8 bg-white rounded-lg shadow-2xl">
                
                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center border-b pb-4">
                    Comprobante de pago
                </h1>

                {/* Mensaje de éxito */}
                <div className="flex items-center justify-center text-xl font-semibold text-green-700 mb-8">
                    <IconCheckSquare /> Pago realizado con éxito
                </div>

                {/* Detalles del Comprobante */}
                <div className="border border-gray-300 p-6 rounded-lg text-left space-y-2 text-base font-medium mb-10">
                    <p><strong>Cancha:</strong> {data.cancha}</p>
                    <p><strong>Fecha:</strong> {data.fecha}</p>
                    <p><strong>Hora:</strong> {data.hora}</p>
                    <p><strong>Método:</strong> {data.metodo}</p>
                    <p><strong>Monto:</strong> S/ {data.monto.toFixed(2)}</p>
                    <p><strong>N° Operación:</strong> {data.operacion}</p>
                </div>
                
                {/* Botones de Acción */}
                <div className="space-y-4 mb-10 border-b pb-6">
                    <div className="flex justify-center">
                        <button className="py-3 px-8 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition duration-200">
                            Descargar comprobante
                        </button>
                    </div>
                    <div className="flex justify-center">
                        <button className="py-3 px-8 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition duration-200">
                            Enviar a mi correo
                        </button>
                    </div>
                </div>

                {/* Botones de Navegación Final */}
                <div className="flex justify-between">
                    <Link to="/" className="py-3 px-6 text-gray-700 font-semibold border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-200">
                        Volver al inicio
                    </Link>
                    <button 
                        onClick={() => navigate('/perfil/reservas')} 
                        className="py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Ver mis reservas
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ComprobantePago;