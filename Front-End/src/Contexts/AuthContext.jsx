import { createContext, useContext, useEffect, useState } from 'react';
import { useAxios } from './AxiosContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const token = localStorage.getItem('token');
	const [loggedInUser, setLoggedInUser] = useState();
	const axios = useAxios();

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
			axios.get('currentuser').then((response) => {
				console.log(response.data);
				if (response.data.result) setLoggedInUser(response.data.user);
				else console.log(response.data.error);
				setIsLoading(false);
			});
			// setIsLoading(false);
		};
		checkAuthStatus();
	}, [token]);

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				login,
				logout,
				isLoading,
				loggedInUser,
				setLoggedInUser,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
