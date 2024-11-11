export const TOKEN_KEY = 'auth_token';

export const authUtils = {
  // Store token
  setToken: (token) => {
    window.localStorage.setItem(TOKEN_KEY, token);
  },

  // Get token
  getToken: () => {
    return window.localStorage.getItem(TOKEN_KEY);
  },

  // Remove token
  removeToken: () => {
    window.localStorage.removeItem(TOKEN_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!window.localStorage.getItem(TOKEN_KEY);
  }
}; 