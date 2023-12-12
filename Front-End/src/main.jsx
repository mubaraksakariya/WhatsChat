import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AxiosProvider } from './contexts/AxiosContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<AxiosProvider>
			<App />
		</AxiosProvider>
	</React.StrictMode>
);
