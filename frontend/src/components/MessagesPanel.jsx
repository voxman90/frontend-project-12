import React from 'react';
import { useSelector } from 'react-redux';
// import cn from 'classnames';

const Message = (channelData) => (
  <div>{channelData}</div>
);

const MessagesPanel = () => {
  const messages = useSelector((state) => state.messages);

  return (
    Object.values(messages.entities).map((messagesData) => (
      <Message key={messagesData.id} messagesData={messagesData} />
    ))
  );
};

export default MessagesPanel;
