import api from './api';

class SearchService {
  // Search parts
  static async searchParts(queryParams) {
    try {
      const response = await api.get('/search', { params: queryParams });
      return response.data;
    } catch (error) {
      throw new Error(`Search failed: ${error.message}`);
    }
  }
}

export default SearchService;