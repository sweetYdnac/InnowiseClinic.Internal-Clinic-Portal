import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import Router from './Router';

const Root = () => {
    const queryClient = new QueryClient();

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <Router />
            </QueryClientProvider>
        </Provider>
    );
};

export default Root;
