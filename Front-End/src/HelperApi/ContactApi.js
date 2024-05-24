// IndexedDB Configuration, for all tables,
const DB_NAME = 'WhatsChatDb';
const DB_VERSION = 1;
const CONTACT_STORE_NAME = 'contacts';
const MESSAGE_STORE_NAME = 'messages';
const CALL_LOG_STORE_NAME = 'calls';

// Function to open IndexedDB and return the database instance

const openDatabase = () => {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onupgradeneeded = (event) => {
			const db = event.target.result;
			if (!db.objectStoreNames.contains(CONTACT_STORE_NAME)) {
				const contactStore = db.createObjectStore(CONTACT_STORE_NAME, {
					keyPath: 'id',
					autoIncrement: true,
				});
				contactStore.createIndex('email', 'email', { unique: true });
			}
			if (!db.objectStoreNames.contains(MESSAGE_STORE_NAME)) {
				db.createObjectStore(MESSAGE_STORE_NAME, {
					keyPath: 'id',
					autoIncrement: true,
				});
			}
			if (!db.objectStoreNames.contains(CALL_LOG_STORE_NAME)) {
				db.createObjectStore(CALL_LOG_STORE_NAME, {
					keyPath: 'id',
					autoIncrement: true,
				});
			}
		};

		request.onsuccess = (event) => {
			const db = event.target.result;
			resolve(db);
		};

		request.onerror = (event) => {
			reject(event.target.error);
		};
	});
};

// Function to add a contact to the contact store
// contact = {
// 	first_name,
// 	last_name,
// 	email,
// };
const addContact = async (contact) => {
	try {
		const db = await openDatabase();
		const transaction = db.transaction([CONTACT_STORE_NAME], 'readwrite');
		const store = transaction.objectStore(CONTACT_STORE_NAME);
		const request = store.add(contact);

		return new Promise((resolve, reject) => {
			request.onsuccess = () => {
				resolve('Contact added to IndexedDB');
			};

			request.onerror = (event) => {
				reject(event.target.error);
			};
		});
	} catch (error) {
		console.error('Error adding contact:', error);
		throw error;
	}
};

// Function to delete a contact from the contact store
const deleteContact = async (id) => {
	try {
		const db = await openDatabase();
		const transaction = db.transaction([CONTACT_STORE_NAME], 'readwrite');
		const store = transaction.objectStore(CONTACT_STORE_NAME);
		const request = store.delete(id);

		return new Promise((resolve, reject) => {
			request.onsuccess = () => {
				resolve('Contact deleted from IndexedDB');
			};

			request.onerror = (event) => {
				reject(event.target.error);
			};
		});
	} catch (error) {
		console.error('Error deleting contact:', error);
		throw error;
	}
};

// Function to get all contacts from the contact store
const getAllContacts = async () => {
	try {
		const db = await openDatabase();
		const transaction = db.transaction([CONTACT_STORE_NAME], 'readonly');
		const store = transaction.objectStore(CONTACT_STORE_NAME);
		const request = store.getAll();

		return new Promise((resolve, reject) => {
			request.onsuccess = () => {
				resolve(request.result);
			};

			request.onerror = (event) => {
				reject(event.target.error);
			};
		});
	} catch (error) {
		console.error('Error retrieving contacts:', error);
		throw error;
	}
};

// Function to check if an email is unique among contacts
const isEmailUnique = async (email) => {
	try {
		const allContacts = await getAllContacts();
		return !allContacts.some((contact) => contact.email === email);
	} catch (error) {
		console.error('Error checking email uniqueness:', error);
		throw error;
	}
};
// checks if the given email exists in the db
// returns true/falls
const checkContactByEmail = async (email) => {
	const db = await openDatabase();
	return await new Promise((resolve, reject) => {
		const transaction = db.transaction([CONTACT_STORE_NAME], 'readonly');
		const store = transaction.objectStore(CONTACT_STORE_NAME);
		const index = store.index('email');
		const request = index.get(email);

		request.onsuccess = (event) => {
			const result_1 = event.target.result;
			if (result_1) {
				resolve(true); // Contact exists
			} else {
				resolve(false); // Contact does not exist
			}
		};

		request.onerror = (event_1) => {
			reject(event_1.target.error);
		};
	});
};
// Export the functions for external use
export {
	addContact,
	deleteContact,
	getAllContacts,
	isEmailUnique,
	openDatabase,
	checkContactByEmail,
};
