import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ButtonGroup,
  Card,
  Dropdown,
  DropdownButton,
} from 'react-bootstrap';
import { PlusSquare } from 'react-bootstrap-icons';

import { modalType, actions as uiActions } from '../slices/ui';
import { channelsSelectors } from '../slices/channels';

const ChannelItem = ({
  data, isActive, onClick, handleRemove, handleRename,
}) => {
  const { name, removable } = data;
  const { t } = useTranslation();

  return (
    <li>
      <ButtonGroup className="w-100">
        <Button
          variant={(isActive) ? 'secondary' : 'light'}
          className="rounded-0 text-start"
          onClick={(isActive) ? null : onClick}
        >
          {`# ${name}`}
        </Button>
        {
          (removable)
            ? (
              <DropdownButton
                variant={(isActive) ? 'secondary' : 'light'}
                as={ButtonGroup}
                title=""
                id="bg-nested-dropdown"
              >
                <Dropdown.Item onClick={handleRemove}>
                  {t('channels.remove')}
                </Dropdown.Item>
                <Dropdown.Item onClick={handleRename}>
                  {t('channels.rename')}
                </Dropdown.Item>
              </DropdownButton>
            ) : null
        }
      </ButtonGroup>
    </li>
  );
};

const ChannelsPanel = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const channels = useSelector(channelsSelectors.selectAll);
  const activeChannelId = useSelector((state) => state.ui.activeChannelId);

  return (
    <Card className="rounded-0 border-0 h-100">
      <Card.Header className="rounded-0">
        <div className="d-flex justify-content-between align-items-baseline">
          <b className="text-capitalize">{t('channels.channels')}</b>
          <Button
            variant="light"
            className="text-primary"
            onClick={() => dispatch(uiActions.openModal({ type: modalType.addChannel }))}
          >
            <PlusSquare width="20" height="20" />
          </Button>
        </div>
      </Card.Header>
      <ul className="list-unstyled">
        {
          channels.map((data) => {
            const channelId = data.id;

            return (
              <ChannelItem
                key={channelId}
                data={data}
                isActive={channelId === activeChannelId}
                onClick={() => dispatch(uiActions.setActiveChannel(channelId))}
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
    </Card>
  );
};

export default ChannelsPanel;
