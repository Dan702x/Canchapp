// src/pages/DetalleCancha/DetallePago.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DetallePago = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryDate: '', // MM/AA
        cvv: '',
        fullName: '',
        documentId: '',
        email: '',
        phone: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const montoAPagar = 80.00; // Monto fijo simulado

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        setError('');
        // Validación básica de tarjeta
        if (!/^\d{16}$/.test(formData.cardNumber)) {
            setError('Número de tarjeta inválido (16 dígitos numéricos).');
            return false;
        }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
            setError('Fecha de vencimiento inválida (MM/AA).');
            return false;
        }
        if (!/^\d{3,4}$/.test(formData.cvv)) {
            setError('CVV inválido (3 o 4 dígitos numéricos).');
            return false;
        }
        // Validación de datos del titular y contacto (simplificada)
        if (formData.fullName.trim().length < 5 || formData.documentId.trim().length < 7 || !/\S+@\S+\.\S+/.test(formData.email) || !/^\d{9,}$/.test(formData.phone)) {
             setError('Completa todos los campos de titular y contacto correctamente.');
             return false;
        }
        return true;
    };

    const handleSubmitPayment = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        // Simulación de procesamiento de pago
        setTimeout(() => {
            setIsLoading(false);
            
            // 🎯 REDIRECCIÓN FINAL: Al Comprobante de Pago
            navigate('/reservar/comprobante'); 
        }, 2000); 
    };

    const handleCancel = () => {
        // Vuelve a la página de ConfirmacionFinal
        navigate('/reservar/confirmacion-final'); 
    };

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center py-10">
            <div className="max-w-xl w-full p-8 bg-white rounded-lg shadow-2xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                    Pago de Cancha
                </h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmitPayment} className="space-y-6">
                    {/* Sección de Información de Tarjeta */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center">
                            <span className="mr-2">💳</span> Información de Tarjeta
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Número de tarjeta:</label>
                                <input
                                    type="text"
                                    id="cardNumber"
                                    name="cardNumber"
                                    maxLength="16"
                                    value={formData.cardNumber}
                                    onChange={handleChange}
                                    placeholder="XXXX XXXX XXXX XXXX"
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex space-x-4">
                                <div className="w-1/2">
                                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Fecha de vencimiento (MM/AA):</label>
                                    <input
                                        type="text"
                                        id="expiryDate"
                                        name="expiryDate"
                                        maxLength="5"
                                        value={formData.expiryDate}
                                        onChange={handleChange}
                                        placeholder="MM/AA"
                                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV:</label>
                                    <input
                                        type="text"
                                        id="cvv"
                                        name="cvv"
                                        maxLength="4"
                                        value={formData.cvv}
                                        onChange={handleChange}
                                        placeholder="123"
                                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección de Datos del Titular */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center">
                            <span className="mr-2">👤</span> Datos del titular
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Nombre completo:</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="documentId" className="block text-sm font-medium text-gray-700">Documento de identidad:</label>
                                <input
                                    type="text"
                                    id="documentId"
                                    name="documentId"
                                    value={formData.documentId}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sección de Contacto */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center">
                            <span className="mr-2">✉️</span> Contacto
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono:</label>
                                <input
                                    type="tel" 
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Monto a Pagar */}
                    <div className="text-center text-2xl font-bold text-gray-800 pt-6">
                        [ Monto a pagar: S/ {montoAPagar.toFixed(2)} ]
                    </div>

                    {/* Botones */}
                    <div className="flex justify-center space-x-4 pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="py-3 px-8 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400"
                        >
                            {isLoading ? 'Procesando...' : 'Confirmar pago'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="py-3 px-8 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                        >
                            Cancelar ❌
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DetallePago;