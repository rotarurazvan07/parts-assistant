import api from './api';

class BinsService {
  // Get all bins
  static async getBins() {
    try {
      const response = await api.get('/bins');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch bins: ${error.message}`);
    }
  }

  // Get single bin by ID
  static async getBin(id) {
    try {
      const response = await api.get(`/bins/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch bin: ${error.message}`);
    }
  }

  // Create new bin
  static async createBin(binData) {
    try {
      const response = await api.post('/bins', binData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create bin: ${error.message}`);
    }
  }

  // Update bin
  static async updateBin(id, binData) {
    try {
      const response = await api.put(`/bins/${id}`, binData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update bin: ${error.message}`);
    }
  }

  // Delete bin
  static async deleteBin(id) {
    try {
      const response = await api.delete(`/bins/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete bin: ${error.message}`);
    }
  }
}

export default BinsService;