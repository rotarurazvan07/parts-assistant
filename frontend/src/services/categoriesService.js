import api from './api';

class CategoriesService {
  // Get all categories
  static async getCategories() {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
  }

  // Get single category by ID
  static async getCategory(id) {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch category: ${error.message}`);
    }
  }

  // Create new category
  static async createCategory(categoryData) {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create category: ${error.message}`);
    }
  }

  // Update category
  static async updateCategory(id, categoryData) {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update category: ${error.message}`);
    }
  }

  // Delete category
  static async deleteCategory(id) {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete category: ${error.message}`);
    }
  }
}

export default CategoriesService;