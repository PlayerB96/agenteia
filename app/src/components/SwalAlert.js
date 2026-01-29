// src/components/SwalAlert.js
import Swal from 'sweetalert2'

/**
 * Muestra un SweetAlert2 con colores de fondo/texto según Tailwind y modo dark/light.
 * @param {Object} options - Opciones de Swal (icon, title, text, etc)
 */
export function showSwalAlert(options = {}) {
  // Crear elemento temporal para obtener colores de Tailwind
  const tempDiv = document.createElement('div');
  tempDiv.className = 'bg-800 text-100';
  document.body.appendChild(tempDiv);
  const computed = window.getComputedStyle(tempDiv);
  const bgColor = computed.backgroundColor;
  const textColor = computed.color;
  document.body.removeChild(tempDiv);

  const isDark = document.documentElement.classList.contains('dark');

  Swal.fire({
    background: bgColor,
    color: textColor,
    customClass: {
      popup: 'shadow-xl',
      title: 'font-semibold',
      confirmButton: isDark ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white',
    },
    ...options
  });
}
