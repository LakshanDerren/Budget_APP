import { RootState } from '@/src/store/store';
import { Redirect } from 'expo-router';
import { useSelector } from 'react-redux';

export default function Index() {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    // If not authenticated or not onboarded, go to onboarding/login
    if (!isAuthenticated || !user?.isOnboarded) {
        return <Redirect href="/onboarding" />;
    }

    return <Redirect href="/(tabs)" />;
}
