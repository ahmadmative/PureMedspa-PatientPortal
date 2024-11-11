import '../styles/globals.css'
import { AuthProvider } from '../hooks/useAuth'
import { useEffect } from 'react';
import { tokenService } from '../api/services/token.service';

function MyApp({ Component, pageProps }) {

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp 