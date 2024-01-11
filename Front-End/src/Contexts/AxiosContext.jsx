import { createContext, useContext } from 'react';
import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'http://127.0.0.1:8000/api/',
	// headers: {
	// 	'Content-Type': 'application/json',
	// 	Origin: 'http://localhost:5173/',
	// 	// Add any other headers as needed
	// },
	// Add other configuration options as needed
});

const AxiosContext = createContext(axiosInstance);

const AxiosProvider = ({ children }) => {
	return (
		<AxiosContext.Provider value={axiosInstance}>
			{children}
		</AxiosContext.Provider>
	);
};

const useAxios = () => {
	const context = useContext(AxiosContext);
	if (!context) {
		throw new Error('useAxios must be used within an AxiosProvider');
	}
	return context;
};

export { AxiosProvider, useAxios, AxiosContext };
