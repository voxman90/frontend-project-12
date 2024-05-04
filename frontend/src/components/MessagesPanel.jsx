import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Card, Button } from 'react-bootstrap';
import { CaretDownFill } from 'react-bootstrap-icons';

import { messagesSelectors } from '../slices/messages';
import { channelsSelectors } from '../slices/channels';

import MessageForm from './MessageForm';

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
  const lastMessageRef = useRef(null);
  const messageContainer = useRef(null);
  const [isUserScrolled, setUserScrolled] = useState(false);

  const authUsername = useSelector((state) => state.auth.username);
  const activeChannelId = useSelector((state) => state.channels.activeChannelId);
  const activeChannelName = useSelector((state) => (
    channelsSelectors.selectById(state, activeChannelId)?.name
  ));
  const messages = useSelector(messagesSelectors.selectAll);
  const activeChannelMessages = messages.filter(({ channelId }) => channelId === activeChannelId);
  const messageCount = activeChannelMessages.length;
  const lastMessageIndex = messageCount - 1;

  useEffect(() => {
    messageContainer.current.addEventListener(
      'scroll',
      (event) => {
        const { scrollHeight, scrollTop, clientHeight } = event.target;
        const isTenPercentScrolled = (
          (scrollHeight - scrollTop - clientHeight) / scrollHeight > 0.1
        );

        setUserScrolled(isTenPercentScrolled);
      },
    );
  }, []);

  useEffect(() => {
    const lastMessageUsername = messages.at(-1).username;

    if (
      !isUserScrolled
      || (authUsername === lastMessageUsername)
    ) {
      lastMessageRef.current?.scrollIntoView();
    }
  }, [messageCount]);

  return (
    <Card className="rounded-0 border-0 h-100">
      <ChannelHeader
        channelName={activeChannelName}
        messageCount={messageCount}
        t={t}
      />
      <Card.Body className="overflow-auto px-5 pt-4 pb-0" ref={messageContainer}>
        <ul className="list-unstyled">
          {
            Object.values(activeChannelMessages).map(({ username, body, id }, i) => (
              <li
                key={id}
                className="text-break mb-2"
                ref={(i === lastMessageIndex) ? lastMessageRef : null}
              >
                <b>{username}</b>
                {`: ${body}`}
              </li>
            ))
          }
        </ul>
        {
          (isUserScrolled)
            ? (
              <Button
                variant="outline-primary"
                className="rounded-circle position-absolute scroll-bottom-button"
                onClick={() => {
                  lastMessageRef.current?.scrollIntoView();
                }}
              >
                <CaretDownFill width={20} height={20} />
              </Button>
            )
            : null
        }
      </Card.Body>
      <Card.Footer className="rounded-0 border-0 bg-white py-3 px-5">
        <MessageForm />
      </Card.Footer>
    </Card>
  );
};

export default MessagesPanel;
