import React from 'react';
import TextItem from './ChatItems/TextItem';
import ImageItem from './ChatItems/ImageItem';
import AudioItem from './ChatItems/AudioItem';
import AttachmentItem from './ChatItems/AttachmentItem';

function ChatItem({ chatItem }) {
	if (chatItem.type === 'text') {
		return <TextItem chatItem={chatItem} />;
	}
	if (chatItem.type === 'image') {
		return <ImageItem chatItem={chatItem} />;
	}
	if (chatItem.type === 'audio') {
		return <AudioItem chatItem={chatItem} />;
	}
	if (chatItem.type === 'attachment') {
		return <AttachmentItem chatItem={chatItem} />;
	}
}

export default ChatItem;
