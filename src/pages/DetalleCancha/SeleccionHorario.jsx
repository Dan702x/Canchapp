// pages/DetalleCancha/SeleccionHorario.jsx

import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { canchasData } from '../../data/canchasData';

// Función para generar slots SOLO en horas completas (ej: 09:00, 10:00)
const generateTimeSlots = () => {
    const slots = [];
    for (let h = 9; h <= 22; h++) { 
        slots.push(`${h.toString().padStart(2, '0')}:00`);
    }
    slots.push('23:00'); // Hora final de cierre
    return slots;
};

// Datos de disponibilidad simulados. Cada hora es un slot de 1 hora.
const mockAvailability = {
    '09:00': 'available', 
    '10:00': 'occupied',  // OCUPADO
    '11:00': 'available', 
    '12:00': 'occupied',  // OCUPADO
    '13:00': 'available',
    '14:00': 'available',
    '15:00': 'available',
    '16:00': 'available',
    '17:00': 'available',
    '18:00': 'available',
    '19:00': 'available',
    '20:00': 'available',
    '21:00': 'available',
    '22:00': 'available', // Última hora de inicio
};

const SeleccionHorario = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const selectedDateISO = location.state?.fecha;
    const selectedDate = selectedDateISO ? new Date(selectedDateISO) : null;
    
    const cancha = canchasData.find(c => c.id === parseInt(id));
    
    const [startSlot, setStartSlot] = useState(null);
    const [endSlot, setEndSlot] = useState(null);
    const [message, setMessage] = useState(null);

    const allTimeSlots = generateTimeSlots();

    if (!cancha || !selectedDate) {
        return (
            <div className="text-center py-20">
                <p className="text-xl font-semibold text-red-500">Error: No se seleccionó una fecha válida.</p>
                <Link to={`/cancha/${id}/reservar`} className="text-blue-600 hover:underline mt-4 inline-block">
                    &larr; Volver a Seleccionar Fecha
                </Link>
            </div>
        );
    }
    
    // Helper para obtener el índice de un slot
    const getSlotIndex = (time) => allTimeSlots.indexOf(time);


    // LÓGICA DE SELECCIÓN DE RANGO (MÍNIMO 1 HORA)
    const handleSlotClick = (slot) => {
        setMessage(null);
        
        const clickedIdx = getSlotIndex(slot);
        const nextSlot = allTimeSlots[clickedIdx + 1];
        
        // CASO 1: El slot clicado es la hora final (23:00) o está ocupado
        if (mockAvailability[slot] === 'occupied' || !nextSlot) {
            setMessage({ type: 'error', text: 'Esta hora no está disponible.' });
            setStartSlot(null);
            setEndSlot(null);
            return;
        }

        // CASO 2: Deseleccionar si el slot clicado ya es el inicio
        if (startSlot === slot) {
            setStartSlot(null);
            setEndSlot(null);
            return;
        }

        // CASO 3: Iniciar un nuevo bloque (Forzando el mínimo de 1 hora)
        if (!startSlot) {
            // Verificamos que el slot siguiente (que forma la hora mínima) esté libre
            if (mockAvailability[nextSlot] === 'occupied') {
                 setMessage({ type: 'error', text: 'La reserva mínima de 1 hora no puede completarse en esta hora.' });
                 return;
            }
            setStartSlot(slot);
            setEndSlot(nextSlot); // Forzar 1 hora: 09:00 a 10:00
            return;
        }
        
        // CASO 4: Extender o Reducir el Bloque (Manejo de Rango)

        const startIdx = getSlotIndex(startSlot);
        const endReferenceIdx = clickedIdx;
        
        const newStartIdx = Math.min(startIdx, endReferenceIdx);
        const newEndIdx = Math.max(startIdx, endReferenceIdx);

        const reservationEndSlot = allTimeSlots[newEndIdx + 1]; 
        
        if (!reservationEndSlot) {
             setMessage({ type: 'error', text: 'El rango seleccionado excede la hora de cierre (23:00).' });
             return;
        }
        
        // Verificación de slots ocupados dentro del nuevo rango
        for (let i = newStartIdx; i <= newEndIdx; i++) {
            if (mockAvailability[allTimeSlots[i]] === 'occupied') {
                setMessage({ type: 'error', text: 'El rango seleccionado incluye horarios ocupados.' });
                setStartSlot(null);
                setEndSlot(null);
                return;
            }
        }
        
        // Verificación de Bloque Mínimo (Mínimo 1 hora).
        const newDurationSlots = newEndIdx - newStartIdx + 1;
        if (newDurationSlots < 1) { 
            setMessage({ type: 'error', text: 'Debes seleccionar un bloque de al menos 1 hora.' });
            setStartSlot(null);
            setEndSlot(null);
            return;
        }

        // El bloque es válido, lo asignamos:
        setStartSlot(allTimeSlots[newStartIdx]);
        setEndSlot(reservationEndSlot);
    };
    
    // Helper para determinar el estilo del slot
    const getSlotClass = (slot) => {
        const slotIdx = getSlotIndex(slot);
        
        if (slotIdx === allTimeSlots.length - 1) {
            return "hidden"; 
        }

        const status = mockAvailability[slot] || 'unavailable';
        let classes = "py-2 px-3 rounded text-sm font-medium transition-colors cursor-pointer ";
        
        const startIdx = startSlot ? getSlotIndex(startSlot) : -1;
        const endIdx = endSlot ? getSlotIndex(endSlot) : -1;
        
        // La selección incluye el slot si su índice es >= al inicio y < al fin
        const isWithinSelection = startSlot && endSlot && slotIdx >= startIdx && slotIdx < endIdx;

        if (status === 'occupied') {
            classes += "bg-red-500 text-white cursor-not-allowed line-through shadow-md"; 
        } else if (isWithinSelection) {
            classes += "bg-green-600 text-white shadow-lg ring-2 ring-green-700"; 
        } else if (status === 'available') {
            classes += "bg-green-100 text-green-700 hover:bg-green-200 border border-green-200"; 
        } else {
            classes += "bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200"; 
        }
        return classes;
    };

    // Función para avanzar a la CONFIRMACIÓN FINAL
    const handleConfirmReservation = () => {
        if (!startSlot || !endSlot) {
            setMessage({ type: 'error', text: 'Debes seleccionar un bloque de 1 hora.' });
            return;
        }
        
        // Calcular duración
        const startIdx = getSlotIndex(startSlot);
        const endIdx = getSlotIndex(endSlot);
        const durationSlots = endIdx - startIdx;
        
        if (durationSlots < 1) {
             setMessage({ type: 'error', text: 'El bloque seleccionado es menor a 1 hora.' });
             return;
        }

        // Navegación al Mockup de Confirmación Final
        navigate(`/reservar/confirmacion-final`, { 
            state: { 
                canchaNombre: cancha.nombre,
                fecha: selectedDate.toLocaleDateString('es-ES'),
                hora: `${startSlot} - ${endSlot}`, 
                monto: 80.00 * durationSlots
            }
        });
    };

    // Formatear la fecha seleccionada
    const formattedDate = selectedDate.toLocaleDateString('es-ES', { 
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
    });

    // Calcula los slots disponibles
    const availableSlotCount = allTimeSlots.length - 1 - Object.values(mockAvailability).filter(s => s === 'occupied').length;


    return (
        // 🎯 CÓDIGO CORREGIDO PARA RESPONSIVIDAD: Ajuste de py-6 sm:py-12
        <div className="bg-gray-50 min-h-screen py-6 sm:py-12"> 
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Migas de pan (ajustadas por brevedad) */}
                <p className="text-sm text-gray-500 mb-6">Inicio &gt; {cancha.nombre} &gt; Seleccionar Horario</p>

                <div className="bg-white p-4 sm:p-8 rounded-lg shadow-xl">
                    
                    {/* 🎯 CORRECCIÓN RESPONSIVA: Flex-col en móvil */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 gap-3">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Seleccionar Hora</h1>
                        <button 
                            onClick={handleConfirmReservation}
                            className="w-full sm:w-auto bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300 disabled:opacity-50"
                            disabled={!startSlot || !endSlot}
                        >
                            Confirmar Reserva
                        </button>
                    </div>

                    {/* --- Cabecera de Datos --- */}
                    <div className="flex flex-wrap justify-start gap-2 sm:gap-4 mb-6">
                        <span className="bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium px-2 py-1 rounded-full">
                            Fecha seleccionada: {formattedDate}
                        </span>
                        <span className="bg-purple-100 text-purple-800 text-xs sm:text-sm font-medium px-2 py-1 rounded-full">
                            Bloque seleccionado: {startSlot && endSlot ? `${startSlot} - ${endSlot}` : 'Min. 1h'}
                        </span>
                        <span className="bg-gray-100 text-gray-800 text-xs sm:text-sm font-medium px-2 py-1 rounded-full">
                            Slots libres: {availableSlotCount}
                        </span>
                    </div>

                    {/* --- Mensajes de Error/Información --- */}
                    {message && (
                        <div 
                            className={`p-3 mb-6 rounded-lg text-sm ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}
                        >
                            {message.text}
                        </div>
                    )}
                    
                    {/* --- Leyenda --- */}
                    <div className="text-sm text-gray-600 mb-6 border-t pt-4">
                        Estado de horarios (<span className="text-green-600">verde = disponible</span>, <span className="text-red-600">rojo = ocupado</span>). La reserva mínima es de **1 hora** (Horas completas).
                    </div>


                    {/* -------------------- HORARIOS (Slots) -------------------- */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {allTimeSlots.slice(0, -1).map(slot => (
                            <button
                                key={slot}
                                onClick={() => handleSlotClick(slot)}
                                className={getSlotClass(slot)}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                    
                    {/* --- Bloque Seleccionado Actual --- */}
                     <div className="p-4 border-t mt-4 text-center">
                        <p className="text-lg font-semibold text-gray-700">Bloque seleccionado (1 hora):</p>
                        <p className={`text-xl font-bold ${startSlot ? 'text-blue-600' : 'text-gray-400'}`}>
                            {startSlot && endSlot ? `${startSlot} - ${endSlot}` : 'Selecciona una hora de inicio'}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SeleccionHorario;