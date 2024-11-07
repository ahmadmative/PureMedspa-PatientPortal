export const TOKEN_KEY = 'auth_token';

export const authUtils = {
  // Store token
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Get token
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Remove token
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  }
}; 