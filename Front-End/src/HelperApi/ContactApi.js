// IndexedDB Configuration
const DB_NAME = 'WhatsChatDb';
const DB_VERSION = 1;
const CONTACT_STORE_NAME = 'contacts';

// Function to open IndexedDB and return the database instance

const openDatabase = () => {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onupgradeneeded = (event) => {
			const db = event.target.result;
			if (!db.objectStoreNames.contains(CONTACT_STORE_NAME)) {
				db.createObjectStore(CONTACT_STORE_NAME, {
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

// Export the functions for external use
export { addContact, deleteContact, getAllContacts, isEmailUnique };
