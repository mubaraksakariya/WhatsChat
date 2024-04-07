import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { manageIncomingMessage } from '../HelperApi/WebSocketMessageHelper';

const WebSocketContext = createContext(null);
let socketState;
export const useWebSocket = () => {
	return useContext(WebSocketContext);
};
export const WebSocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const token = localStorage.getItem('token');
	const [retryTimeout, setRetryTimeout] = useState(null);
	const { isAuthenticated } = useAuth();
	// to export freely
	socketState = socket;

	const connectWebSocket = () => {
		const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}${token}`);

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
			// console.log('Received message:', messageData);
			const message = messageData.data;
			// console.log('Received messageData:', message);
			manageIncomingMessage(message);
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

		// the method for sending text and typing signals here
		ws.forwardToWebSocket = (message) => {
			if (ws.readyState === WebSocket.OPEN) {
				try {
					if (
						message.type === 'text' ||
						message.type === 'typing' ||
						message.type === 'acknowledgement' ||
						message.type === 'attachment' ||
						message.type === 'image' ||
						message.type === 'audio' ||
						message.type === 'delete' ||
						message.type === 'video-call'
					) {
						console.log(message.type + ' message send');
						ws.send(JSON.stringify({ content: message }));
					} else {
						console.log(message);
						console.log('message handling yet to code');
					}
				} catch (error) {
					console.error('Error sending message:', error);
				}
			} else {
				console.error('WebSocket connection not open.');
			}
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

export { socketState as socket };
