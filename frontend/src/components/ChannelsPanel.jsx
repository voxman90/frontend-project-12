import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';

import { actions as uiActions } from '../slices/ui';

const ChannelsPanelHeader = ({ t }) => (
  <div className="fw-bold text-capitalize p-2">
    {t('channels.channels')}
  </div>
);

const ChannelItem = ({ data, isActive, onClick }) => {
  const { name } = data;
  const btnClass = cn('w-100 rounded-0 text-start btn', {
    'btn-secondary': isActive,
  });

  return (
    <li className="w-100">
      <button
        type="button"
        className={btnClass}
        onClick={isActive ? () => {} : onClick}
      >
        {`# ${name}`}
      </button>
    </li>
  );
};

const ChannelsPanel = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels);
  const activeChannelId = useSelector((state) => state.ui.activeChannelId);

  const ulClass = cn(
    'd-flex flex-column justify-content-start',
    'h-100 overflow-hidden',
    'list-unstyled',
  );

  return (
    <div>
      <ChannelsPanelHeader t={t} />
      <ul className={ulClass}>
        {
          Object.values(channels.entities).map((data) => {
            const channelId = data.id;

            return (
              <ChannelItem
                key={channelId}
                data={data}
                isActive={channelId === activeChannelId}
                onClick={() => dispatch(uiActions.setActiveChannel(channelId))}
              />
            );
          })
        }
      </ul>
    </div>
  );
};

export default ChannelsPanel;
