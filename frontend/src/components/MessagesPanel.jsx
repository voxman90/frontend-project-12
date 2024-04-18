import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Card } from 'react-bootstrap';
// import cn from 'classnames';

import MessageForm from './MessageForm';
import { actions as messagesActions } from '../slices/messages';
import { SocketContext } from '../context/socket';

const Message = ({ messageData }) => {
  const { username, body } = messageData;

  return (
    <div><b>{username}</b>{`: ${body}`}</div>
  );
};

const ChannelHeader = ({ channelName, messageCount, t }) => (
  <Card.Header className="rounded-0">
    <b>{`# ${channelName}`}</b>
    <br />
    <span>{`${messageCount} ${t('chat.messageCount', { count: messageCount })}`}</span>
  </Card.Header>
);

const MessagesPanel = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const activeChannelId = useSelector((state) => state.ui.activeChannelId);
  const channelName = useSelector((state) => state.channels.entities[activeChannelId].name);
  const messagesObj = useSelector((state) => state.messages.entities);
  const activeChannelMessages = Object.values(messagesObj)
    .filter(({ channelId }) => channelId === activeChannelId);
  const messageCount = activeChannelMessages.length;

  socket.on('newMessage', (payload) => {
    dispatch(messagesActions.addMessage(payload));
  });

  return (
    <Card className="rounded-0 border-0 h-100">
      <ChannelHeader
        channelName={channelName}
        messageCount={messageCount}
        t={t}
      />
      <Card.Body>
        {
          Object.values(activeChannelMessages).map((data) => (
            <Message key={data.id} messageData={data} />
          ))
        }
      </Card.Body>
      <Card.Footer className="rounded-0">
        <MessageForm />
      </Card.Footer>
    </Card>
  );
};

export default MessagesPanel;
