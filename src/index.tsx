import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import App from './routes/App';
import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);

reportWebVitals();
