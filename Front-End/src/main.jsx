import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AxiosProvider } from './Contexts/AxiosContext.jsx';
import { AuthProvider } from './Contexts/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<AxiosProvider>
			<AuthProvider>
				<App />
			</AuthProvider>
		</AxiosProvider>
	</React.StrictMode>
);
