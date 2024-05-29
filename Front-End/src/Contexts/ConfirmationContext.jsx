// ConfirmationContext.js
import React, { createContext, useState, useContext } from 'react';
import Confirmation from './Helpers/Confirmation';

const ConfirmationContext = createContext();

export const useConfirmation = () => {
	return useContext(ConfirmationContext);
};

export const ConfirmationProvider = ({ children }) => {
	const [confirmation, setConfirmation] = useState(null);

	const confirm = (message, onConfirm, onReject, checkBoxList) => {
		setConfirmation({ message, onConfirm, onReject, checkBoxList });
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
					onConfirm={confirmation.onConfirm}
					onReject={confirmation.onReject}
					checkBoxList={confirmation.checkBoxList}
					setConfirmation={setConfirmation}
				/>
			)}
		</ConfirmationContext.Provider>
	);
};
