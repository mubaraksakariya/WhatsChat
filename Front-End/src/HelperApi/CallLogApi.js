import { openDatabase } from './ContactApi';

const CALL_LOG_STORE_NAME = 'calls';
// const log = {
//     from:loggedInUser,
//     to:user,
//     startTime:Date.now(),
//     type:'outgoing',
//     status:'calling'
// }
// Function to add a call log
const addCallLog = async (callLog) => {
	try {
		const db = await openDatabase();
		const transaction = db.transaction([CALL_LOG_STORE_NAME], 'readwrite');
		const store = transaction.objectStore(CALL_LOG_STORE_NAME);
		const request = store.add(callLog);

		return new Promise((resolve, reject) => {
			request.onsuccess = () => {
				resolve(request.result);
			};

			request.onerror = (event) => {
				reject(event.target.error);
			};
		});
	} catch (error) {
		console.error('Error opening database:', error);
		throw error;
	}
};

// Function to fetch call logs with pagination
const fetchCallLogs = async (page, pageSize) => {
	try {
		const db = await openDatabase();
		const transaction = db.transaction([CALL_LOG_STORE_NAME], 'readonly');
		const store = transaction.objectStore(CALL_LOG_STORE_NAME);
		const totalRequest = store.count();

		return new Promise((resolve, reject) => {
			totalRequest.onsuccess = async () => {
				const totalRecords = totalRequest.result;
				const totalPages = Math.ceil(totalRecords / pageSize);

				if (page > totalPages) {
					reject(new Error('Page number out of range'));
					return;
				}

				const offset = (page - 1) * pageSize;
				const callLogs = [];
				let currentIndex = 0;
				const request = store.openCursor();

				request.onsuccess = (event) => {
					const cursor = event.target.result;
					if (cursor && currentIndex < offset + pageSize) {
						if (currentIndex >= offset) {
							callLogs.push(cursor.value);
						}
						currentIndex++;
						cursor.continue();
					} else {
						resolve({ callLogs, totalPages });
					}
				};

				request.onerror = (event) => {
					reject(event.target.error);
				};
			};

			totalRequest.onerror = (event) => {
				reject(event.target.error);
			};
		});
	} catch (error) {
		console.error('Error fetching call logs:', error);
		throw error;
	}
};

const calculateCallDuration = (answeringTime, callEndingTime) => {
	const startTime = new Date(answeringTime);
	const endTime = new Date(callEndingTime);
	const durationInSeconds = (endTime - startTime) / 1000;
	return formatTime(durationInSeconds);
};

const formatTime = (seconds) => {
	const hrs = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);

	const formattedMins = mins.toString().padStart(2, '0');
	const formattedSecs = secs.toString().padStart(2, '0');

	if (hrs > 0) {
		return `${hrs}:${formattedMins}:${formattedSecs}`;
	} else {
		return `${mins}:${formattedSecs}`;
	}
};

export { addCallLog, fetchCallLogs, calculateCallDuration };
