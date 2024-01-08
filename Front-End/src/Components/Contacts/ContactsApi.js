const DB_NAME = 'WhatsChatDb';
const DB_VERSION = 1;

// Function to open IndexedDB and return the database instance
const openDatabase = () => {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onsuccess = (event) => {
			const db = event.target.result;
			resolve(db);
		};

		request.onerror = (event) => {
			reject(event.target.error);
		};
	});
};

// Function to get all contacts from IndexedDB
export const getAllContacts = async () => {
	try {
		const db = await openDatabase();
		const transaction = db.transaction('contacts', 'readonly');
		const objectStore = transaction.objectStore('contacts');
		const getAllRequest = objectStore.getAll();

		return new Promise((resolve, reject) => {
			getAllRequest.onsuccess = () => {
				resolve(getAllRequest.result);
			};

			getAllRequest.onerror = (error) => {
				reject(error);
			};
		});
	} catch (error) {
		console.error('Error opening database:', error);
		throw error;
	}
};

// Function to check if an email is unique among contacts
export const isEmailUnique = async (email) => {
	try {
		const allContacts = await getAllContacts();
		return !allContacts.some((contact) => contact.email === email);
	} catch (error) {
		console.error('Error checking email uniqueness:', error);
		throw error;
	}
};

// Function to add a new contact to IndexedDB
export const addContact = async (contact) => {
	try {
		const db = await openDatabase();
		const transaction = db.transaction('contacts', 'readwrite');
		const objectStore = transaction.objectStore('contacts');
		const addRequest = objectStore.add(contact);

		return new Promise((resolve, reject) => {
			addRequest.onsuccess = () => {
				resolve('Contact added to IndexedDB');
			};

			addRequest.onerror = (error) => {
				reject(error);
			};
		});
	} catch (error) {
		console.error('Error opening database or adding contact:', error);
		throw error;
	}
};
