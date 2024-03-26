// IndexedDB Configuration
const DB_NAME = 'WhatsChatDb';
const DB_VERSION = 3;
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
			reject(event.target.error);
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
		const request = store.get(id);

		request.onsuccess = () => {
			const message = request.result;
			message.is_deleted = true;

			const updateRequest = store.put(message);
			updateRequest.onsuccess = () => {
				console.log('Message deleted');
			};
			updateRequest.onerror = (event) => {
				console.error(
					'Error updating message in IndexedDB:',
					event.target.error
				);
			};
		};

		request.onerror = (event) => {
			console.error(
				'Error getting message from IndexedDB:',
				event.target.error
			);
		};
	} catch (error) {
		console.error('Error updating message in IndexedDB:', error);
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

// Function to get paginated messages from the message store
const getPaginatedMessages = (page, pageSize, loggedInUser, user) => {
	return new Promise(async (resolve, reject) => {
		try {
			const db = await openDatabase();
			const transaction = db.transaction(
				[MESSAGE_STORE_NAME],
				'readonly'
			);
			const store = transaction.objectStore(MESSAGE_STORE_NAME);
			let messages = [];
			let cursorIndex = 0;
			const request = store.openCursor(null, 'prev');
			request.onsuccess = (event) => {
				const cursor = event.target.result;
				if (cursor) {
					const message = cursor.value;
					if (
						message.to === user.email ||
						message.from === user.email
					) {
						if (cursorIndex >= (page - 1) * pageSize) {
							messages.push(message);
							// Resolve if we've reached the desired page size
							if (messages.length >= pageSize) {
								resolve(messages.reverse());
								return;
							}
						}
						cursorIndex++;
					}
					cursor.continue();
				} else {
					resolve(messages.reverse());
				}
			};
		} catch (error) {
			console.error('Error retrieving paginated messages:', error);
			reject(error);
		}
	});
};

// Function to update the status of a message in the message store
const updateStatus = async (messageId, status) => {
	try {
		const db = await openDatabase();
		const transaction = db.transaction([MESSAGE_STORE_NAME], 'readwrite');
		const store = transaction.objectStore(MESSAGE_STORE_NAME);

		const getRequest = store.get(messageId);
		getRequest.onsuccess = (event) => {
			const message = event.target.result;
			if (message) {
				message.status = status;
				const updateRequest = store.put(message);
				// updateRequest.onsuccess = () => {
				// 	console.log('Message status updated successfully');
				// };
				updateRequest.onerror = (event) => {
					console.error(
						'Error updating message status:',
						event.target.error
					);
				};
			} else {
				console.error('Message not found');
			}
		};
		getRequest.onerror = (event) => {
			console.error('Error retrieving message:', event.target.error);
		};
	} catch (error) {
		console.error('Error updating message status:', error);
		throw error;
	}
};

// Formats last seen date to easily readable
function formatLastSeen(lastSeenString) {
	const lastSeen = new Date(lastSeenString);
	const now = new Date();

	const diff = now - lastSeen;

	const minute = 60 * 1000;
	const hour = minute * 60;
	const day = hour * 24;
	const week = day * 7;
	const month = day * 30;
	const year = day * 365;

	if (diff < minute) {
		return 'just now';
	} else if (diff < hour) {
		const minutes = Math.floor(diff / minute);
		return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
	} else if (diff < day) {
		const hours = Math.floor(diff / hour);
		return `${hours} hour${hours > 1 ? 's' : ''} ago`;
	} else if (diff < week) {
		const days = Math.floor(diff / day);
		return `${days} day${days > 1 ? 's' : ''} ago`;
	} else if (diff < month) {
		const weeks = Math.floor(diff / week);
		return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
	} else if (diff < year) {
		const months = Math.floor(diff / month);
		return `${months} month${months > 1 ? 's' : ''} ago`;
	} else {
		const years = Math.floor(diff / year);
		return `${years} year${years > 1 ? 's' : ''} ago`;
	}
}

// Export the functions for external use
export {
	addMessage,
	deleteMessage,
	getAllMessages,
	getPaginatedMessages,
	updateStatus,
	formatLastSeen,
};
