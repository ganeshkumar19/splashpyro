import axios from "axios";
import { getAccessToken } from "../../firebaseConfig";

export const fetchCategoryItems = async (categoryId) => {
    try {
      // Get the Firebase access token
      const accessToken = await getAccessToken();
  
      // Make the API call with the access token
      const response = await axios.get(`https://us-central1-splashpyro-115e8.cloudfunctions.net/api/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,  // Pass the token in the Authorization header
        },
      });
  
      return response.data;  // Return items data
    } catch (error) {
      console.error(`Error fetching items for category ${categoryId}:`, error);
      throw error;  // Rethrow the error to handle it in the component
    }
  };