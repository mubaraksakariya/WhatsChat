import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { manageIncomingMessage } from '../HelperApi/WebSocketMessageReciever';

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
	return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const token = localStorage.getItem('token');
	const [retryTimeout, setRetryTimeout] = useState(null);
	const { isAuthenticated } = useAuth();

	const connectWebSocket = () => {
		const ws = new WebSocket(`ws://localhost:8000/ws/chat/?token=${token}`);

		ws.onopen = () => {
			console.log('Connected to WebSocket');
			if (retryTimeout) {
				clearTimeout(retryTimeout);
				setRetryTimeout(null);
			}
		};

		ws.onmessage = (event) => {
			// console.log('a message recieved');
			const messageData = JSON.parse(event.data);
			// console.log(messageData);
			manageIncomingMessage(messageData.data);
		};

		ws.onclose = () => {
			console.log(
				'WebSocket connection closed. Retrying in 5 seconds...'
			);
			const timeout = setTimeout(() => {
				console.log('Retrying WebSocket connection...');
				connectWebSocket(); // Retry connection
			}, 5000);
			setRetryTimeout(timeout);
		};

		setSocket(ws);
	};

	useEffect(() => {
		if (token && isAuthenticated) {
			connectWebSocket();
		}
	}, [token, isAuthenticated]);

	useEffect(() => {
		return () => {
			if (socket) {
				socket.close();
			}
			if (retryTimeout) {
				clearTimeout(retryTimeout);
				setRetryTimeout(null);
			}
		};
	}, [socket]);

	return (
		<WebSocketContext.Provider value={socket}>
			{children}
		</WebSocketContext.Provider>
	);
};
