class ApiEndpoints {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async postFrenchWord(data: any): Promise<Response> {
    try {
      return await fetch(`${this.baseUrl}/word`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error posting French word:', error);
      throw error; // Re-throw the error for the calling component to handle
    }
  }

  async doesFrenchWordExist(word: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/word/exist/${word}`);
      return await response.json();
    } catch (error) {
      console.error(`Error checking if ${word} exists:`, error);
      throw error;
    }
  }

  // Add more API endpoint methods here as needed
  async updateSomething(itemId: string, newData: any): Promise<Response> {
    try {
      const response = await fetch(`${this.baseUrl}/something/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });
      return response;
    } catch (error) {
      console.error('Error updating something:', error);
      throw error;
    }
  }

  // ... more methods for GET, DELETE, etc.
}

const apiService = new ApiEndpoints('http://localhost:36145/language/fr'); // Replace with your actual base URL

export default apiService;