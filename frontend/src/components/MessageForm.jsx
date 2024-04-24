import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import axios from 'axios';
// import cn from 'classnames';
import { Button, Form, InputGroup } from 'react-bootstrap';

import { actions as uiActions, msgFormStatus } from '../slices/ui';
import routes from '../routes';

const sendMsg = async (authToken, channelId, msgData) => {
  const headers = { Authorization: `Bearer ${authToken}` };

  return axios.post(
    routes.messagesPath(channelId),
    msgData,
    { headers },
  );
};

const MessageForm = () => {
  const { t } = useTranslation();
  const inputRef = useRef();
  const dispatch = useDispatch();
  const { username, token } = useSelector((state) => state.auth);
  const channelId = useSelector((state) => state.ui.activeChannelId);

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    onSubmit: async (formData) => {
      dispatch(uiActions.setMsgFormStatus(msgFormStatus.pending));

      const message = {
        body: formData.message,
        channelId,
        username,
      };

      sendMsg(token, channelId, message)
        .then(() => {
          formik.resetForm();
          dispatch(uiActions.setMsgFormStatus(msgFormStatus.success));
        })
        .catch((reason) => {
          console.error(reason);
          dispatch(uiActions.setMsgFormStatus(msgFormStatus.failure));
        })
        .finally(() => {
          dispatch(uiActions.setMsgFormStatus(msgFormStatus.ready));
        });
    },
  });

  useEffect(() => {
    inputRef.current.focus();
  }, [channelId, formik.isSubmitting]);

  return (
    <Form
      onSubmit={formik.handleSubmit}
      className="d-flex flex-row align-items-center"
    >
      <InputGroup className="mb-3">
        <Form.Control
          onChange={formik.handleChange}
          value={formik.values.message}
          name="message"
          id="message"
          ref={inputRef}
          disabled={formik.isSubmitting}
          placeholder={t('chat.newMessage')}
        />
        <Form.Label className="d-none">
          {t('chat.newMessage')}
        </Form.Label>
        <Button
          type="submit"
          variant="outline-primary"
        >
          {t('chat.send')}
        </Button>
      </InputGroup>
    </Form>
  );
};

export default MessageForm;
