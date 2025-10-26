import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { canchasData } from '../../data/canchasData';

// Función para generar franjas de 30 minutos entre 9:00 y 16:00
const generateTimeSlots = () => {
    const slots = [];
    for (let h = 9; h <= 15; h++) {
        slots.push(`${h.toString().padStart(2, '0')}:00`);
        slots.push(`${h.toString().padStart(2, '0')}:30`);
    }
    // Agregar el slot final de las 16:00
    slots.push('16:00'); 
    return slots;
};

// Datos de disponibilidad simulados (para el mockup)
const mockAvailability = {
    '09:00': 'available',
    '09:30': 'available',
    '10:00': 'occupied',
    '10:30': 'available',
    '11:00': 'available',
    '11:30': 'available',
    '12:00': 'occupied',
    '12:30': 'available',
    '13:00': 'occupied',
    '13:30': 'occupied',
    '14:00': 'available',
};

const SeleccionHorario = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Recuperar la fecha seleccionada del estado de la navegación (Paso 1)
    const selectedDateISO = location.state?.fecha;
    const selectedDate = selectedDateISO ? new Date(selectedDateISO) : null;
    
    // Obtener datos de la cancha
    const cancha = canchasData.find(c => c.id === parseInt(id));
    
    // Estado para el inicio del bloque seleccionado
    const [startSlot, setStartSlot] = useState(null);
    // Estado para el fin del bloque seleccionado
    const [endSlot, setEndSlot] = useState(null);
    // Estado para mostrar mensajes de error
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

    // Lógica para manejar el clic en un bloque de tiempo
    const handleSlotClick = (slot) => {
        setMessage(null);
        
        const slotStatus = mockAvailability[slot];
        if (slotStatus === 'occupied') {
            setMessage({ type: 'error', text: 'Horario ocupado, selecciona otro' });
            setStartSlot(null);
            setEndSlot(null);
            return;
        }

        // Si no hay inicio de slot seleccionado, este es el inicio
        if (!startSlot) {
            setStartSlot(slot);
            setEndSlot(null);
            return;
        }

        // Si el clic es el mismo slot, lo deseleccionamos
        if (startSlot === slot) {
            setStartSlot(null);
            setEndSlot(null);
            return;
        }
        
        // --- Lógica de Selección de Bloque (Mínimo 1 hora) ---

        const startIdx = getSlotIndex(startSlot);
        const clickedIdx = getSlotIndex(slot);
        
        // Ordena los índices para saber cuál es el inicio y cuál es el fin real
        const finalStartIdx = Math.min(startIdx, clickedIdx);
        const finalEndIdx = Math.max(startIdx, clickedIdx);

        // Calcula la duración del bloque seleccionado (2 slots = 1 hora)
        const durationSlots = finalEndIdx - finalStartIdx + 1;

        // Comprueba si el bloque seleccionado contiene algún slot ocupado
        for (let i = finalStartIdx; i <= finalEndIdx; i++) {
            if (mockAvailability[allTimeSlots[i]] === 'occupied') {
                setMessage({ type: 'error', text: 'El bloque seleccionado incluye un horario ocupado. Elige otro.' });
                setStartSlot(null);
                setEndSlot(null);
                return;
            }
        }

        // Asignamos el inicio y fin
        setStartSlot(allTimeSlots[finalStartIdx]);
        setEndSlot(allTimeSlots[finalEndIdx]);

        // Verificación de Bloque Mínimo (Mínimo de 1 hora = 2 slots de 30 min)
        // Si solo se seleccionó un slot (duración 1), verificamos si es válido (requiere 1 hora)
        if (durationSlots < 2) {
             setMessage({ type: 'error', text: 'El bloque mínimo de reserva es de 1 hora (selecciona 2 bloques de 30min).' });
             setStartSlot(null);
             setEndSlot(null);
             return;
        }
    };

    // Helper para determinar el estilo del slot
    const getSlotClass = (slot) => {
        const status = mockAvailability[slot] || 'unavailable';
        let classes = "py-2 px-3 rounded text-sm font-medium transition-colors cursor-pointer ";
        
        // Lógica para determinar si el slot está dentro del bloque seleccionado
        const isWithinSelection = startSlot && endSlot && getSlotIndex(slot) >= getSlotIndex(startSlot) && getSlotIndex(slot) <= getSlotIndex(endSlot);
        
        if (isWithinSelection) {
            classes += "bg-green-500 text-white shadow-lg ring-2 ring-green-600"; // Bloque seleccionado
        } else if (status === 'available') {
            classes += "bg-green-100 text-green-700 hover:bg-green-200 border border-green-200"; // Disponible
        } else if (status === 'occupied') {
            classes += "bg-red-100 text-red-700 cursor-not-allowed line-through border border-red-200"; // Ocupado
        } else {
            classes += "bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200"; // No disponible/fuera de rango
        }
        return classes;
    };

    // Función para avanzar a la CONFIRMACIÓN FINAL
    const handleConfirmReservation = () => {
        if (!startSlot || !endSlot) {
            setMessage({ type: 'error', text: 'Debes seleccionar un bloque de al menos 1 hora.' });
            return;
        }
        
        // Navegación al Mockup de Confirmación Final
        navigate(`/reservar/confirmacion-final`, { 
            state: { 
                canchaNombre: cancha.nombre,
                fecha: selectedDate.toLocaleDateString('es-ES'),
                hora: `${startSlot} - ${endSlot}`,
                monto: 80.00 // Monto simulado
            }
        });
    };

    // Formatear la fecha seleccionada
    const formattedDate = selectedDate.toLocaleDateString('es-ES', { 
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
    });


    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Migas de pan */}
                <div className="text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:underline">Inicio</Link>
                    <span className="mx-2">&gt;</span>
                    <Link to={`/cancha/${id}`} className="hover:underline">{cancha.nombre}</Link>
                    <span className="mx-2">&gt;</span>
                    <span className="font-semibold text-gray-700">Seleccionar Horario</span>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-xl">
                    
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h1 className="text-3xl font-bold text-gray-900">Seleccionar Hora</h1>
                        <button 
                            onClick={handleConfirmReservation}
                            className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300 disabled:opacity-50"
                            disabled={!startSlot || !endSlot}
                        >
                            Confirmar Reserva
                        </button>
                    </div>

                    {/* --- Cabecera de Datos --- */}
                    <div className="flex flex-wrap gap-4 mb-6">
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                            Fecha seleccionada: {formattedDate}
                        </span>
                        <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                            Bloque seleccionado: {startSlot && endSlot ? `${startSlot} - ${endSlot}` : 'Min. 1h'}
                        </span>
                        <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                            Slots libres: {Object.values(mockAvailability).filter(s => s === 'available').length}
                        </span>
                    </div>

                    {/* --- Mensajes de Error/Información --- */}
                    {message && (
                        <div 
                            className={`p-4 mb-6 rounded-lg ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}
                        >
                            {message.text}
                        </div>
                    )}
                    
                    {/* --- Leyenda --- */}
                    <div className="text-sm text-gray-600 mb-6 border-t pt-4">
                        Estado de horarios (<span className="text-green-600">verde = disponible</span>, <span className="text-red-600">rojo = ocupado</span>). El bloque mínimo a seleccionar es de **1 hora** (equivalente a 2 slots de 30min).
                    </div>


                    {/* -------------------- HORARIOS (Slots) -------------------- */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {allTimeSlots.slice(0, -1).map(slot => ( // No mostramos el último slot (16:00) como inicio
                            <button
                                key={slot}
                                onClick={() => handleSlotClick(slot)}
                                className={getSlotClass(slot)}
                                disabled={mockAvailability[slot] === 'occupied'}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                    
                    {/* --- Bloque Seleccionado Actual --- */}
                     <div className="p-4 border-t mt-4 text-center">
                        <p className="text-lg font-semibold text-gray-700">Bloque seleccionado (min. 1h):</p>
                        <p className={`text-xl font-bold ${startSlot ? 'text-blue-600' : 'text-gray-400'}`}>
                            {startSlot && endSlot ? `${startSlot} - ${endSlot}` : 'Selecciona un bloque en el calendario'}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SeleccionHorario;