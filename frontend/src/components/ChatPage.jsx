import React, { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

import { actions as authActions } from '../slices/auth';
import { actions as channelsActions } from '../slices/channels';
import { actions as messagesActions } from '../slices/messages';
import routes from '../routes';
import { handleAxiosErrors } from '../utils';
import ChannelsPanel from './ChannelsPanel';
import MessagesPanel from './MessagesPanel';
import Modal from './Modal';

const fetchData = async (path, authToken) => axios.get(
  path,
  { headers: { Authorization: `Bearer ${authToken}` } },
)
  .then((response) => response.data);

const ChatPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const authToken = useSelector((state) => state.auth.token);
  const isChannelsLoaded = useSelector((state) => state.channels.isChannelsLoaded);

  useEffect(() => {
    if (!isChannelsLoaded) {
      const fetchChannelsData = () => fetchData(routes.channelsPath(), authToken);
      const fetchMessaagesData = () => fetchData(routes.messagesPath(), authToken);

      Promise.all([
        fetchChannelsData(),
        fetchMessaagesData(),
      ]).then(([channelsData, messagesData]) => {
        dispatch(channelsActions.addChannels(channelsData));
        dispatch(messagesActions.addMessages(messagesData));
        dispatch(channelsActions.setChannelsLoaded());
      }).catch((reason) => {
        handleAxiosErrors(reason, t, (status) => {
          if (status === 401) {
            toast.error(t('errors.unauthorizedEntry'));
            dispatch(authActions.logout());
            navigate(routes.chatPagePath());
          }

          return status === 401;
        });
      });
    }
  }, [isChannelsLoaded]);

  return (
    <div className="container overflow-hidden my-4 p-0 h-100 shadow rounded">
      <Modal />
      {
        !isChannelsLoaded
          ? (
            <div className="d-flex justify-content-center h-100">
              <Spinner animation="border" role="status" className="align-self-center">
                <span className="visually-hidden">
                  {t('loading')}
                </span>
              </Spinner>
            </div>
          )
          : (
            <div className="row p-0 m-0 h-100">
              <div className="col-4 col-md-2 p-0 border-end h-100">
                <ChannelsPanel />
              </div>
              <div className="col-8 col-md-10 p-0 h-100">
                <MessagesPanel />
              </div>
            </div>
          )
      }
    </div>
  );
};

export default ChatPage;
