import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import Root from './routes/Root';
import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Root />);

reportWebVitals();
