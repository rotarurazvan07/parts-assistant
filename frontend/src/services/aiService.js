import api from './api';

class AIService {
  // Send AI chat message
  static async sendAIRequest(messageData) {
    try {
      const response = await api.post('/ai/chat', messageData);
      return response.data;
    } catch (error) {
      throw new Error(`AI request failed: ${error.message}`);
    }
  }
}

export default AIService;