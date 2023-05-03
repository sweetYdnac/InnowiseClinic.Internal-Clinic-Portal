import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import Root from './Root';
import Router from './Router';

const App = () => {
    const queryClient = new QueryClient();

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <Root />
                <Router />
            </QueryClientProvider>
        </Provider>
    );
};

export default App;
