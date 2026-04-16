import api from './api';

class ImportExportService {
  // Import parts from CSV or JSON file
  static async importParts(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/import/parts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Import failed: ${error.message}`);
    }
  }

  // Export parts in specified format (json or csv)
  static async exportParts(format = 'json') {
    try {
      const response = await api.get(`/export/parts?format=${format}`);
      return response.data;
    } catch (error) {
      throw new Error(`Export failed: ${error.message}`);
    }
  }

  // Download exported data as file
  static downloadExport(data, format, filename = 'parts-export') {
    try {
      let content;
      let mimeType;
      let fileExtension;

      if (format === 'csv') {
        content = data.csv_content || data;
        mimeType = 'text/csv';
        fileExtension = 'csv';
      } else {
        content = JSON.stringify(data.parts || data, null, 2);
        mimeType = 'application/json';
        fileExtension = 'json';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error(`Download failed: ${error.message}`);
    }
  }
}

export default ImportExportService;
