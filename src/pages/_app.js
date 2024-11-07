import '../styles/globals.css'
import { AuthProvider } from '../hooks/useAuth'
import { useEffect } from 'react';
import { tokenService } from '../api/services/token.service';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Get initial token when app loads
    if (typeof window !== 'undefined' && !tokenService.getStoredToken()) {
      tokenService.getAuthToken();
      console.log('Token fetched');
    }
  }, []);

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp 