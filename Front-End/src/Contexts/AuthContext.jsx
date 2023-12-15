import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const token = localStorage.getItem('token');

	const login = () => {
		setIsAuthenticated(true);
	};

	const logout = () => {
		localStorage.removeItem('token');
		setIsAuthenticated(false);
	};

	useEffect(() => {
		const checkAuthStatus = async () => {
			setIsAuthenticated(token ? true : false);
			setIsLoading(false);
		};
		checkAuthStatus();
	}, [token]);

	return (
		<AuthContext.Provider
			value={{ isAuthenticated, login, logout, isLoading }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
