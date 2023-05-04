import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import Root from './Root';
import AppRouter from './routes/Router';
import { store } from './store/store';

const App = () => {
    const queryClient = new QueryClient();

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <Root />
                <AppRouter />
            </QueryClientProvider>
        </Provider>
    );
};

export default App;
