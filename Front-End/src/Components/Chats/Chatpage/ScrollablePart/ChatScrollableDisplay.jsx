import React, { useEffect, useRef, useState } from 'react';
import { getPaginatedMessages } from '../../../../HelperApi/MessageApi';
import ChatItem from '../ChatItem';
import { useAuth } from '../../../../Contexts/AuthContext';

function ChatScrollableDisplay({ chatItem, setChatItem, user }) {
	const [pageNumber, setPageNumber] = useState(1);
	const [endOfPage, setEndOfPage] = useState(false);
	const [scrollToBottom, setScrollToBottom] = useState(true);
	const [isScrollingToTop, setIsScrollingToTop] = useState(false); // Add state for scrolling to top
	const chatContainerRef = useRef(null);
	const topObserverRef = useRef(null);
	const bottomObserverRef = useRef(null);
	const { loggedInUser } = useAuth();
	const options = {
		threshold: 1,
	};

	useEffect(() => {
		fetchMessages(1);
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting && isScrollingToTop) {
				// Check if scrolling to top
				const chatContainer = chatContainerRef.current;
				chatContainer.scrollTop += 35;
				setPageNumber((prevPageNumber) => prevPageNumber + 1);
				fetchMessages(pageNumber);
				console.log(pageNumber);
			}
		}, options);

		observer.observe(topObserverRef.current);

		return () => {
			observer.disconnect();
		};
	}, [isScrollingToTop]); // Update the dependency array

	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setScrollToBottom(true);
			} else {
				setScrollToBottom(false);
			}
		}, options);

		observer.observe(bottomObserverRef.current);

		return () => {
			observer.disconnect();
		};
	}, []);

	useEffect(() => {
		if (scrollToBottom) {
			const chatContainer = chatContainerRef.current;
			if (chatContainer) {
				chatContainer.scrollTop = chatContainer.scrollHeight;
			}
		}
	}, [chatItem]);

	const fetchMessages = async (nextPageNumber) => {
		if (!endOfPage) {
			const messages = await getPaginatedMessages(
				nextPageNumber,
				15,
				loggedInUser,
				user
			);
			// console.log(messages);
			if (messages.length === 0) {
				setEndOfPage(true);
			} else {
				setChatItem((old) => [
					...messages.filter(
						(message) => !old.some((item) => item.id === message.id)
					),
					...old,
				]);
			}
		}
	};

	const handleScroll = () => {
		const chatContainer = chatContainerRef.current;
		if (chatContainer.scrollTop === 0) {
			setIsScrollingToTop(true);
		} else {
			setIsScrollingToTop(false);
		}
	};

	return (
		<div
			className={`
    flex-1 max-h-[80%] overflow-auto
    transition duration-300 ease-in-out
    ${!scrollToBottom ? 'scroll-smooth' : ''}
  `}
			ref={chatContainerRef}
			onScroll={handleScroll}>
			{/* observer content for pagination help */}
			<div
				role='status'
				ref={topObserverRef}
				className={`flex justify-center pb-4 ${
					isScrollingToTop ? '' : 'hidden'
				}`}>
				<svg
					aria-hidden='true'
					className='w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600'
					viewBox='0 0 100 101'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'>
					<path
						d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
						fill='currentColor'
					/>
					<path
						d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
						fill='currentFill'
					/>
				</svg>
				<span className='sr-only'>Loading...</span>
			</div>
			{chatItem.map((item, index) => {
				return <ChatItem chatItem={item} key={index} />;
			})}
			{chatItem.length == 0 && (
				<div className=' text-white flex flex-col justify-center items-center min-h-[70vh]'>
					<div>Say 'Hello'</div>
				</div>
			)}
			<div ref={bottomObserverRef}></div>
		</div>
	);
}

export default ChatScrollableDisplay;
