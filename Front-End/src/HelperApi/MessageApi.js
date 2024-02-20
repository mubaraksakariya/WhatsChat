// IndexedDB Configuration
const DB_NAME = 'WhatsChatDb';
const DB_VERSION = 2;
const MESSAGE_STORE_NAME = 'messages';

// Function to open IndexedDB and return the database instance
const openDatabase = () => {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onupgradeneeded = (event) => {
			const db = event.target.result;
			if (!db.objectStoreNames.contains(MESSAGE_STORE_NAME)) {
				db.createObjectStore(MESSAGE_STORE_NAME, {
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
			// reject(event.target.error);
			console.log('error occured');
		};
	});
};

// Function to add a message to the message store
const addMessage = async (message) => {
	try {
		const db = await openDatabase();
		const transaction = db.transaction([MESSAGE_STORE_NAME], 'readwrite');
		const store = transaction.objectStore(MESSAGE_STORE_NAME);
		const request = store.add(message);

		return new Promise((resolve, reject) => {
			request.onsuccess = (event) => {
				const newItemKey = event.target.result;
				const getRequest = store.get(newItemKey);
				getRequest.onsuccess = (event) => {
					const newItem = event.target.result;
					resolve(newItem);
				};
				getRequest.onerror = (event) => {
					reject('Error retrieving newly added item');
				};
			};

			request.onerror = (event) => {
				reject(event.target.error);
			};
		});
	} catch (error) {
		console.error('Error adding message:', error);
		throw error;
	}
};

// Function to delete a message from the message store
const deleteMessage = async (id) => {
	try {
		const db = await openDatabase();
		const transaction = db.transaction([MESSAGE_STORE_NAME], 'readwrite');
		const store = transaction.objectStore(MESSAGE_STORE_NAME);
		const request = store.delete(id);

		return new Promise((resolve, reject) => {
			request.onsuccess = () => {
				resolve('Message deleted from IndexedDB');
			};

			request.onerror = (event) => {
				reject(event.target.error);
			};
		});
	} catch (error) {
		console.error('Error deleting message:', error);
		throw error;
	}
};

// Function to get all messages from the message store
const getAllMessages = async () => {
	try {
		const db = await openDatabase();
		const transaction = db.transaction([MESSAGE_STORE_NAME], 'readonly');
		const store = transaction.objectStore(MESSAGE_STORE_NAME);
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
		console.error('Error retrieving messages:', error);
		throw error;
	}
};

// Export the functions for external use
export { addMessage, deleteMessage, getAllMessages };
