import React, {
  useRef,
  useEffect,
  useState,
  useContext,
} from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';

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

  const schema = yup.object().shape({
    message: yup.string()
      .trim()
      .required(t('chat.required')),
  });

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    validationSchema: schema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setSubmitting(true);
      const trimmedMessage = values.message.trim();
      const message = {
        body: filter.clean(trimmedMessage),
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
    if (formik.errors.message) {
      toast.error(formik.errors.message);
      formik.resetForm();
    }

    inputRef.current.focus();
  }, [channelId, formik.isSubmitting, formik.errors.message]);

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
          onBlur={formik.handleBlur}
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
