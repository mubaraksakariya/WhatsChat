import React, { useEffect, useRef, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import './ChatInput.css';
import FileInput from './FileInput';
import CameraInput from './CameraInput';
import ChatMessageSendButton from './ChatMessageSendButton';
import AudioInputButton from './AudioInputButton';
import { addMessage } from '../../../HelperApi/MessageApi';
import { useWebSocket } from '../../../Contexts/WebsocketContext';
import { useAuth } from '../../../Contexts/AuthContext';

function ChatInput({ user, setChatItem }) {
	const [text, setText] = useState('');
	const [attachment, setAttachment] = useState(null);
	const [audioBlob, setAudioBlob] = useState(null);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const parentDivRef = useRef(null);
	const emojibtnRef = useRef(null);
	const inputRef = useRef(null);
	const socket = useWebSocket();
	const { loggedInUser } = useAuth();
	useEffect(() => {
		// Add event listener when the component mounts
		document.addEventListener('mousedown', handleClickOutside);

		// Clean up the event listener when the component unmounts
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);
	// to disable input field , to send audio
	useEffect(() => {
		if (audioBlob) {
			sendAudio();
		}

		if (attachment && attachment.length > 0) {
			const count = attachment.length - 1;
			if (count == 1) {
				inputRef.current.value =
					attachment[0].name + ' and ' + count + ' other file';
			} else if (count > 1) {
				inputRef.current.value =
					attachment[0].name + ' and ' + count + ' other files';
			} else {
				inputRef.current.value = attachment[0].name;
			}
			inputRef.current.disabled = true;
		} else {
			inputRef.current.disabled = false;
		}
	}, [audioBlob, attachment]);

	const sendCameraImage = (image) => {
		// setCameraImage(image);
		const reader = new FileReader();
		reader.onload = () => {
			const message = {
				type: 'image',
				image: {
					image: reader.result,
					caption: image.caption,
				},
				from: loggedInUser.email,
				to: user.email,
				time: new Date().toLocaleString(),
				status: 'sending',
			};
			addMessage(message).then((newChatItem) => {
				setChatItem((old) => [...old, newChatItem]);
				socket.forwardToWebSocket(newChatItem);
			});
		};
		reader.readAsDataURL(image.image);
	};

	const sendMessage = () => {
		// for attachments,
		if (attachment && attachment.length > 0) {
			attachment.forEach((file) => {
				const reader = new FileReader();
				reader.onload = () => {
					const message = {
						type: 'attachment',
						attachment: {
							data: reader.result,
							filename: file.name,
							type: file.type,
						},
						from: loggedInUser.email,
						to: user.email,
						time: new Date().toLocaleString(),
						status: 'sending',
					};
					addMessage(message).then((newChatItem) => {
						setChatItem((old) => [...old, newChatItem]);
						socket.forwardToWebSocket(newChatItem);
					});
				};
				reader.readAsDataURL(file);
			});
			setAttachment([]);
		}

		if (text) {
			const message = {
				type: 'text',
				text: text,
				from: loggedInUser.email,
				to: user.email,
				time: new Date().toLocaleString(),
				status: 'sending',
			};

			addMessage(message).then((newChatItem) => {
				setChatItem((old) => [...old, newChatItem]);
				socket.forwardToWebSocket(newChatItem);
			});
			setText('');
		}
	};

	const sendAudio = () => {
		const reader = new FileReader();
		reader.onload = () => {
			const message = {
				type: 'audio',
				audio: reader.result,
				from: loggedInUser.email,
				to: user.email,
				time: new Date().toLocaleString(),
				status: 'sending',
			};
			addMessage(message).then((newChatItem) => {
				setChatItem((old) => [...old, newChatItem]);
				socket.forwardToWebSocket(newChatItem);
			});
		};
		reader.readAsDataURL(audioBlob);
		setAudioBlob(null);
	};

	const handleClickOutside = (event) => {
		if (
			parentDivRef.current &&
			!parentDivRef.current.contains(event.target) &&
			!emojibtnRef.current.contains(event.target)
		) {
			setShowEmojiPicker(false);
		}
	};

	const emojiPickerToggle = () => {
		setShowEmojiPicker(!showEmojiPicker);
	};

	const onEmojiClick = (item) => {
		const inputElement = inputRef.current;
		if (inputElement) {
			const { selectionStart, selectionEnd } = inputElement;
			const textBeforeCursor = text.substring(0, selectionStart);
			const textAfterCursor = text.substring(selectionEnd);

			const newText = textBeforeCursor + item.emoji + textAfterCursor;

			// Calculate the new cursor position after the inserted emoji
			const newCursorPosition = selectionStart + item.emoji.length;

			// Set the new text and cursor position
			setText(newText);
			inputElement.setSelectionRange(
				newCursorPosition,
				newCursorPosition
			);
		}
	};

	return (
		<div className='flex overflow-visible'>
			<div
				ref={parentDivRef}
				className={`absolute bottom-10 left-0 ${
					showEmojiPicker ? '' : 'hidden'
				}`}>
				<EmojiPicker
					theme='dark'
					onEmojiClick={onEmojiClick}
					className={`emoji-picker ${
						showEmojiPicker ? 'visible' : 'hidden'
					}`}
				/>
			</div>

			<div className='flex w-full items-center rounded-full bg-themeBlueSecondary'>
				{/* emoji picker button */}
				{attachment == null && (
					<svg
						onClick={emojiPickerToggle}
						ref={emojibtnRef}
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={1.5}
						stroke='currentColor'
						className='w-6 h-6 mt-2 ms-2 mb-2 cursor-pointer'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z'
						/>
					</svg>
				)}
				{/*text Input box  */}
				<div className='flex-1'>
					<input
						placeholder='Message'
						onChange={(event) => {
							setText(event.target.value);
							socket.forwardToWebSocket({
								type: 'typing',
								item: 'the user is typing now',
								to: user.email,
								time: new Date().toLocaleString(),
								// status: 'sending',
							});
						}}
						onKeyDown={(event) => {
							if (event.key === 'Enter' && text.trim() !== '') {
								sendMessage();
							}
						}}
						type='text'
						className='w-full bg-transparent border-none focus:ring-transparent caret-themeGreen'
						name=''
						id=''
						value={text}
						ref={inputRef}
					/>
				</div>

				{/* Attachment icon and button, file input */}
				<div className='mx-2'>
					<FileInput
						setAttachment={setAttachment}
						attachment={attachment}
					/>
				</div>

				{/* Camera Icon and button */}
				{text === '' && attachment == null && (
					<div className='mx-2 me-4'>
						<CameraInput
							user={user}
							sendCameraImage={sendCameraImage}
						/>
					</div>
				)}
			</div>
			{/* Audio input and send button */}
			{text === '' && attachment == null ? (
				<AudioInputButton
					file={setAudioBlob}
					key={'1'}
					icon={
						// mic Icon
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='w-6 h-6 scale-100 ease-linear duration-200 transition-all'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z'
							/>
						</svg>
					}
				/>
			) : (
				<ChatMessageSendButton
					onclick={sendMessage}
					key={'2'}
					icon={
						// send Icon
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='w-6 h-6 scale-100 ease-linear duration-200 transition-all'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5'
							/>
						</svg>
					}
				/>
			)}
		</div>
	);
}

export default ChatInput;
