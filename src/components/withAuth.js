import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { authService } from '../api/services/auth.service';

export function withAuth(WrappedComponent) {
    return function WithAuthComponent(props) {
        const router = useRouter();
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            // Check if we're in the browser
            if (typeof window !== 'undefined') {
                if (!authService.isAuthenticated()) {
                    router.replace('/');
                }
                setIsLoading(false);
            }
        }, [router]);

        // Show nothing while checking authentication
        if (isLoading) {
            return null;
        }

        // If authenticated, render the component
        return <WrappedComponent {...props} />;
    };
} 