import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Card } from 'react-bootstrap';

import MessageForm from './MessageForm';
import { messagesSelectors } from '../slices/messages';
import { channelsSelectors } from '../slices/channels';

const ChannelHeader = ({ channelName, messageCount, t }) => (
  <Card.Header className="rounded-0 p-3">
    <b>{`# ${channelName}`}</b>
    <br />
    <span className="text-muted">
      {`${messageCount} ${t('chat.messageCount', { count: messageCount })}`}
    </span>
  </Card.Header>
);

const MessagesPanel = () => {
  const { t } = useTranslation();

  const activeChannelId = useSelector((state) => state.ui.activeChannelId);
  const activeChannelName = useSelector((state) => (
    channelsSelectors.selectById(state, activeChannelId)?.name
  ));
  const messages = useSelector(messagesSelectors.selectAll);
  const activeChannelMessages = messages.filter(({ channelId }) => channelId === activeChannelId);
  const messageCount = activeChannelMessages.length;

  return (
    <Card className="rounded-0 border-0 h-100">
      <ChannelHeader
        channelName={activeChannelName}
        messageCount={messageCount}
        t={t}
      />
      <Card.Body className="overflow-auto">
        {
          Object.values(activeChannelMessages).map(({ username, body, id }) => (
            <div key={id} className="text-break"><b>{username}</b>{`: ${body}`}</div>
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
