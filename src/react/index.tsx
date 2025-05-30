import { createRoot } from 'react-dom/client';
import App from './components/app';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App/>);