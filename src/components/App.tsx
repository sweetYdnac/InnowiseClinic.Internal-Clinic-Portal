import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { AxiosInterceptor } from './AxiosInterceptor';
import { Root } from './Root';
import { AppRouter } from './routes/Router';

const App = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5,
            },
        },
    });

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <SnackbarProvider>
                    <AppRouter>
                        <Root>
                            <AxiosInterceptor />
                        </Root>
                    </AppRouter>
                </SnackbarProvider>
                <ReactQueryDevtools />
            </QueryClientProvider>
        </Provider>
    );
};

export default App;
