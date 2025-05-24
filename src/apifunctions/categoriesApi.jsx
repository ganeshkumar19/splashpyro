import axios from 'axios';
import { getAccessToken } from '../../firebaseConfig';
  // Import the access token function

// Function to fetch categories
export const fetchCategories = async () => {
  try {
    // Get the Firebase access token
    const accessToken = await getAccessToken();

    // Make the API call with the access token
    const response = await axios.get('https://us-central1-splashpyro-115e8.cloudfunctions.net/api/categories', {
      headers: {
        Authorization: `Bearer ${accessToken}`,  // Pass the token in the Authorization header
      },
    });

    return response.data;  // Return categories data
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;  // Rethrow the error to handle it in the component
  }
};
