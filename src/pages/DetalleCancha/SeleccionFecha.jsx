import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { canchasData } from '../../data/canchasData';

// Función para obtener el primer día del mes dado (0 = enero, 11 = diciembre)
// Esto es esencial para saber dónde empezar a dibujar los días en la cuadrícula.
const getStartDay = (year, month) => new Date(year, month, 1).getDay();

const SeleccionFecha = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const cancha = canchasData.find(c => c.id === parseInt(id));
    
    // 🎯 CAMBIO 1: Estado para la fecha seleccionada (el día que se marca en azul)
    // Inicializado en 26, ya que el calendario inicial es octubre de 2025 (índice 9)
    const [selectedDayNumber, setSelectedDayNumber] = useState(26);

    // 🎯 NUEVO ESTADO: Controla el mes y año que se está viendo.
    // Inicializamos en la fecha actual (Octubre 2025)
    const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1)); // 9 es Octubre

    const [confirming, setConfirming] = useState(false);

    // --- Lógica del Calendario Dinámico ---

    // Obtener el año y el mes actuales del estado
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Días de un mes específico (ej: Octubre tiene 31)
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    // 0 = Domingo, 1 = Lunes, ... (Necesitamos compensar para que Lu sea el inicio de la cuadrícula)
    const firstDayIndex = (getStartDay(currentYear, currentMonth) + 6) % 7; // Ajuste para que Lunes sea 0

    // Función para cambiar de mes (anterior/siguiente)
    const changeMonth = (delta) => {
        const newMonth = currentMonth + delta;
        setCurrentDate(new Date(currentYear, newMonth, 1));
        setSelectedDayNumber(null); // Deseleccionar día al cambiar de mes
    };

    // --- Lógica de Reserva y Redirección ---

    const handleConfirmDate = () => {
        if (!selectedDayNumber) {
            alert('Por favor, selecciona una fecha.');
            return;
        }
        setConfirming(true);
        
        // Creamos la fecha final con el mes/año actual y el día seleccionado.
        const dateToPass = new Date(currentYear, currentMonth, selectedDayNumber);

        navigate(`/cancha/${id}/reservar/horario`, { 
            state: { fecha: dateToPass.toISOString() } 
        });

        setTimeout(() => setConfirming(false), 500); 
    };

    // Helper para formatear la fecha seleccionada para la visualización
    const formattedDate = selectedDayNumber
        ? new Date(currentYear, currentMonth, selectedDayNumber).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'Selecciona un día'; // Texto si no hay día seleccionado

    // Datos simulados (solo para marcar algunos días disponibles)
    const simulatedDates = [1, 2, 3, 14, 19, 27];
    const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];


    if (!cancha) {
        return (
            <div className="text-center py-20">
                <p>Cancha no encontrada.</p>
                <Link to="/" className="text-blue-600">Volver al inicio</Link>
            </div>
        );
    }
    
    return (
        <div className="bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                {/* Migas de pan */}
                {/* ... (código de migas de pan) ... */}
                
                <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h1 className="text-3xl font-bold text-gray-900">Reservar</h1>
                        <button 
                            onClick={() => alert("Función final de reserva")}
                            className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300"
                        >
                            Reservar
                        </button>
                    </div>

                    {/* -------------------- FECHA SELECCIONADA -------------------- */}
                    <div className="text-center mb-6">
                        <p className="text-lg font-medium text-gray-700">
                            Fecha seleccionada: <span className="font-bold text-blue-600">
                                {formattedDate}
                            </span>
                        </p>
                    </div>

                    {/* -------------------- CALENDARIO DINÁMICO -------------------- */}
                    <div className="calendar-sim mb-8 p-4 border rounded-lg bg-gray-50">
                        <div className="flex justify-between items-center text-lg font-bold text-gray-800 mb-4">
                            {/* Botón Anterior */}
                            <button 
                                onClick={() => changeMonth(-1)}
                                className="text-blue-600 hover:text-blue-800 flex items-center"
                            >
                                &lt; Anterior
                            </button>

                            {/* Mes y Año Actual */}
                            <span className='capitalize'>
                                {monthNames[currentMonth]} {currentYear}
                            </span>

                            {/* Botón Siguiente */}
                            <button 
                                onClick={() => changeMonth(1)}
                                className="text-blue-600 hover:text-blue-800 flex items-center"
                            >
                                Siguiente &gt;
                            </button>
                        </div>
                        
                        {/* Días de la semana */}
                        <div className="grid grid-cols-7 text-center text-sm text-gray-500 mb-2">
                            {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map(day => <span key={day}>{day}</span>)}
                        </div>
                        
                        {/* Días del mes (Generación Dinámica) */}
                        <div className="grid grid-cols-7 text-center gap-2">
                            
                            {/* Relleno: Días vacíos al inicio del mes (Lunes = 0, Domingo = 6) */}
                            {[...Array(firstDayIndex)].map((_, i) => <span key={`empty-${i}`} className="w-10 h-10"></span>)}

                            {/* Días del Mes */}
                            {[...Array(daysInMonth)].map((_, i) => {
                                const day = i + 1;
                                const isAvailable = simulatedDates.includes(day);
                                const isSelected = selectedDayNumber === day;
                                const isMaintenance = day === 3; 
                                
                                let classes = "w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold cursor-pointer";

                                if (isMaintenance) {
                                    classes += " bg-gray-300 text-gray-600 cursor-not-allowed line-through relative";
                                } else if (isSelected) {
                                    classes += " bg-blue-600 text-white";
                                } else if (isAvailable) {
                                    classes += " bg-green-200 text-green-700 hover:bg-green-300";
                                } else {
                                    classes += " text-gray-400";
                                }

                                return (
                                    <span 
                                        key={day} 
                                        className={classes}
                                        onClick={isMaintenance ? null : () => setSelectedDayNumber(day)}
                                    >
                                        {day}
                                    </span>
                                );
                            })}
                        </div>
                        
                        <p className="text-sm text-red-500 mt-4 text-right">Fecha no disponible, elige otra</p>
                    </div>
                    
                    {/* -------------------- BOTÓN CONFIRMAR FECHA -------------------- */}
                    <div className="text-center mb-8">
                        <button 
                            onClick={handleConfirmDate}
                            disabled={confirming || !selectedDayNumber} // Deshabilitar si no hay día seleccionado
                            className="bg-blue-600 text-white font-semibold py-2 px-8 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
                        >
                            {confirming ? 'Confirmando...' : 'Confirmar Fecha'}
                        </button>
                    </div>
                    
                    {/* Sección de horarios vacía como en tu mockup */}
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Horarios disponibles</h3>
                    <div className="text-center py-4 text-gray-500 italic">
                        Selecciona una fecha para ver los horarios.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeleccionFecha;