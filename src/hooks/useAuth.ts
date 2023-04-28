import exp from 'constants';
import { selectAuth } from '../store/authorizationSlice';
import { useAppSelector } from './store';

const useAuth = () => {
    const selector = useAppSelector(selectAuth);
    const isAuthorized = selector.accessToken && selector.expirationTime * 1000 > Date.now();

    return isAuthorized;
};

export default useAuth;
