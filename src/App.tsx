import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { AxiosInterceptor } from './AxiosInterceptor';
import { Root } from './Root';
import { AppRouter } from './routes/Router';
import { store } from './store/store';

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
                <BrowserRouter>
                    <SnackbarProvider>
                        <AppRouter>
                            <Root>
                                <AxiosInterceptor />
                            </Root>
                        </AppRouter>
                    </SnackbarProvider>
                    <ReactQueryDevtools />
                </BrowserRouter>
            </QueryClientProvider>
        </Provider>
    );
};

export default App;
