import { createContext, useContext } from 'react';
import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
});

// Add a request interceptor to add the token to all requests
axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Token ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

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
