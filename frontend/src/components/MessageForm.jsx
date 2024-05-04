import React, {
  useRef,
  useEffect,
  useState,
  useContext,
} from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import axios from 'axios';

import { LeoProfanityContext } from '../context/filter';
import routes from '../routes';
import { handleAxiosErrors } from '../utils';

const MessageForm = () => {
  const { t } = useTranslation();
  const [isSubmitting, setSubmitting] = useState(false);
  const inputRef = useRef();
  const filter = useContext(LeoProfanityContext);

  const { username, token } = useSelector((state) => state.auth);
  const channelId = useSelector((state) => state.channels.activeChannelId);

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    onSubmit: async (values) => {
      setSubmitting(true);

      const message = {
        body: filter.clean(values.message),
        channelId,
        username,
      };

      axios.post(
        routes.messagesPath(channelId),
        message,
        { headers: { Authorization: `Bearer ${token}` } },
      )
        .then(() => {
          formik.resetForm();
        })
        .catch((reason) => {
          handleAxiosErrors(reason, t);
        })
        .finally(() => {
          setSubmitting(false);
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
      <InputGroup>
        <Form.Control
          id="message"
          name="message"
          value={formik.values.message}
          placeholder={t('chat.enterMessage')}
          onChange={formik.handleChange}
          ref={inputRef}
          aria-label={t('chat.newMessage')}
          required
        />
        <Form.Label htmlFor="message" className="d-none">
          {t('chat.enterMessage')}
        </Form.Label>
        <Button
          type="submit"
          variant="outline-primary"
          disabled={isSubmitting}
        >
          {t('chat.send')}
        </Button>
      </InputGroup>
    </Form>
  );
};

export default MessageForm;
