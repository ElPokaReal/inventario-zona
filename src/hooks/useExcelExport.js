import { useState } from 'react';
import api from '../utils/axiosConfig';
import toast from 'react-hot-toast';

export const useExcelExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToExcel = async (endpoint, fileName) => {
    if (isExporting) return;

    setIsExporting(true);
    const toastId = toast.loading(`Exportando ${fileName}...`);

    try {
      const response = await api.get(endpoint, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Exportación completada.', { id: toastId });
    } catch (error) {
      console.error(`Error al exportar ${fileName}:`, error);
      toast.error('No se pudo completar la exportación.', { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  return { isExporting, exportToExcel };
};
