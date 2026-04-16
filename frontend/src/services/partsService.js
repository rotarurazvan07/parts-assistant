import api from './api';

class PartsService {
  // Get all parts with pagination
  static async getParts(params = {}) {
    try {
      const response = await api.get('/parts', { params });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch parts: ${error.message}`);
    }
  }

  // Get single part by ID
  static async getPart(id) {
    try {
      const response = await api.get(`/parts/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch part: ${error.message}`);
    }
  }

  // Create new part
  static async createPart(partData) {
    try {
      const response = await api.post('/parts', partData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create part: ${error.message}`);
    }
  }

  // Update part
  static async updatePart(id, partData) {
    try {
      const response = await api.put(`/parts/${id}`, partData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update part: ${error.message}`);
    }
  }

  // Delete part
  static async deletePart(id) {
    try {
      const response = await api.delete(`/parts/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete part: ${error.message}`);
    }
  }
}

export default PartsService;