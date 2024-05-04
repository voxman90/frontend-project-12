/* eslint prefer-arrow-callback: 0 */

import React, { useEffect, useRef, forwardRef } from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  Dropdown,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { modalType, actions as uiActions } from '../slices/ui';
import { channelsSelectors, actions as channelsActions } from '../slices/channels';

const ChannelItem = forwardRef(function ChannelItem({
  data, isActive, onClick, handleRemove, handleRename,
}, activeChannelRef) {
  const { name, removable } = data;
  const { t } = useTranslation();

  return (
    <li>
      <ButtonGroup className="w-100" ref={activeChannelRef}>
        <Button
          variant={(isActive) ? 'secondary' : 'light'}
          className="w-100 rounded-0 text-start text-truncate"
          onClick={(isActive) ? null : onClick}
        >
          {`# ${name}`}
        </Button>
        {
          (removable)
            ? (
              <Dropdown as={ButtonGroup}>
                <Dropdown.Toggle
                  variant={(isActive) ? 'secondary' : 'light'}
                  id="bg-nested-dropdown"
                >
                  <span className="visually-hidden">
                    {t('channels.menu')}
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleRemove}>
                    {t('channels.remove')}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleRename}>
                    {t('channels.rename')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : null
        }
      </ButtonGroup>
    </li>
  );
});

const ChannelsPanel = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const activeChannelItem = useRef(null);

  const channels = useSelector(channelsSelectors.selectAll);
  const activeChannelId = useSelector((state) => state.channels.activeChannelId);

  useEffect(() => {
    activeChannelItem.current?.scrollIntoView();
  }, [activeChannelId]);

  return (
    <Card className="rounded-0 border-0 h-100 bg-light">
      <Card.Header className="rounded-0 border-0 bg-light ps-4 py-4 mb-3 flex-shrink-0 overflow-hidden">
        <div className="d-flex justify-content-between align-items-baseline">
          <b className="text-capitalize">
            {t('channels.channels')}
          </b>
          <Button
            variant="light"
            className="text-primary rounded-1 border border-primary ms-2 add-channel-button"
            onClick={() => dispatch(uiActions.openModal({ type: modalType.addChannel }))}
          >
            +
          </Button>
        </div>
      </Card.Header>
      <Card.Body className="p-0 overflow-auto">
        <ul className="list-unstyled">
          {
            channels.map((data) => {
              const channelId = data.id;

              return (
                <ChannelItem
                  key={channelId}
                  data={data}
                  isActive={channelId === activeChannelId}
                  ref={(channelId === activeChannelId) ? activeChannelItem : null}
                  onClick={() => dispatch(channelsActions.setActiveChannel(channelId))}
                  handleRemove={() => dispatch(uiActions.openModal({
                    channelId,
                    type: modalType.deleteChannel,
                  }))}
                  handleRename={() => dispatch(uiActions.openModal({
                    channelId,
                    type: modalType.renameChannel,
                  }))}
                />
              );
            })
          }
        </ul>
      </Card.Body>
    </Card>
  );
};

export default ChannelsPanel;
