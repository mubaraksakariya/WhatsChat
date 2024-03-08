import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AxiosProvider } from './Contexts/AxiosContext.jsx';
import { AuthProvider } from './Contexts/AuthContext.jsx';
import { WebSocketProvider } from './Contexts/WebsocketContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
	// <React.StrictMode>
	<AxiosProvider>
		<AuthProvider>
			<WebSocketProvider>
				<App />
			</WebSocketProvider>
		</AuthProvider>
	</AxiosProvider>
	// </React.StrictMode>
);
