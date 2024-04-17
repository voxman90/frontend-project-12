import React, { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import { actions as channelsActions } from '../slices/channels';
import { actions as messagesActions } from '../slices/messages';
import { actions as uiActions } from '../slices/ui';
import routes from '../routes';
import ChannelsPanel from './ChannelsPanel';
import MessagesPanel from './MessagesPanel';

const fetchData = async (path, authToken) => axios.get(
  path,
  { headers: { Authorization: `Bearer ${authToken}` } },
).then((response) => response.data);

const ChatPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const authToken = useSelector((state) => state.auth.token);
  const isChatContentLoaded = useSelector((state) => state.ui.isChatContentLoaded);

  useEffect(() => {
    if (!isChatContentLoaded) {
      const fetchChannelsData = () => fetchData(routes.channelsPath(), authToken);
      const fetchMessaagesData = () => fetchData(routes.messagesPath(), authToken);

      Promise.all([
        fetchChannelsData(),
        fetchMessaagesData(),
      ]).then(([channelsData, messagesData]) => {
        const dispatchData = () => {
          dispatch(channelsActions.addChannels(channelsData));
          dispatch(messagesActions.addMessages(messagesData));
          dispatch(uiActions.setChatContentLoaded());
        };

        dispatch(dispatchData);
      }).catch((reason) => {
        console.error(reason);
      });
    }
  }, [isChatContentLoaded]);

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        {
          !isChatContentLoaded
            ? (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">{t('loading')}</span>
              </Spinner>
            )
            : (
              <div className="card shadow-sm h-75">
                <div className="card-body row">
                  <div className="d-flex flex-row">
                    <div className="border-end px-0 bg-light col-4">
                      <ChannelsPanel />
                    </div>
                    <div className="col-8">
                      <MessagesPanel />
                    </div>
                  </div>
                </div>
              </div>
            )
        }
      </div>
    </div>
  );
};

export default ChatPage;
