// ConfirmationContext.js
import React, { createContext, useState, useContext } from 'react';
import Confirmation from './Helpers/Confirmation';

const ConfirmationContext = createContext();

export const useConfirmation = () => {
	return useContext(ConfirmationContext);
};

export const ConfirmationProvider = ({ children }) => {
	const [confirmation, setConfirmation] = useState(null);

	const confirm = (message, onConfirm, onReject) => {
		setConfirmation({ message, onConfirm, onReject });
	};

	const clearConfirmation = () => {
		setConfirmation(null);
	};

	return (
		<ConfirmationContext.Provider value={{ confirm, clearConfirmation }}>
			{children}
			{confirmation && (
				<Confirmation
					message={confirmation.message}
					onConfirm={() => {
						confirmation.onConfirm();
						clearConfirmation();
					}}
					onReject={() => {
						confirmation.onReject();
						clearConfirmation();
					}}
				/>
			)}
		</ConfirmationContext.Provider>
	);
};
