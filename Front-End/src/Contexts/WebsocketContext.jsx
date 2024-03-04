import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
	return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const token = localStorage.getItem('token');
	const [retryTimeout, setRetryTimeout] = useState(null);
	const { isAuthenticated } = useAuth();
	useEffect(() => {
		if (token) {
			const ws = new WebSocket(
				`ws://localhost:8000/ws/chat/?token=${token}`
			);
			setSocket(ws);

			ws.onopen = () => {
				console.log('Connected to WebSocket');
				if (retryTimeout) {
					clearTimeout(retryTimeout);
					setRetryTimeout(null);
				}
			};

			ws.onclose = () => {
				console.log(
					'WebSocket connection closed. Retrying in 5 seconds...'
				);
				setSocket(null);
				const timeout = setTimeout(() => {
					console.log('Retrying WebSocket connection...');
					setSocket(
						new WebSocket(
							`ws://localhost:8000/ws/chat/?token=${token}`
						)
					);
				}, 5000);
				setRetryTimeout(timeout);
			};

			return () => {
				ws.close();
				if (retryTimeout) {
					clearTimeout(retryTimeout);
					setRetryTimeout(null);
				}
			};
		}
	}, [token, isAuthenticated]);

	return (
		<WebSocketContext.Provider value={socket}>
			{children}
		</WebSocketContext.Provider>
	);
};
