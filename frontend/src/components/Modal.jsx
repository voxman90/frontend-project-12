import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import {
  Button,
  Modal as ModalBootstrap,
  Form,
  CloseButton,
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import * as yup from 'yup';

import { actions as uiActions, modalType } from '../slices/ui';
import { channelsSelectors } from '../slices/channels';
import routes from '../routes';

const AddChannelModal = ({ t, token }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  const channels = useSelector(channelsSelectors.selectAll);
  const channelsNames = channels.map(({ name }) => name);

  const schema = yup.object().shape({
    channelName: yup.string()
      .required(t('modals.required'))
      .min(3, t('modals.min'))
      .max(20, t('modals.max'))
      .notOneOf(channelsNames, t('modals.uniq')),
  });

  const formik = useFormik({
    initialValues: {
      channelName: '',
    },
    validationSchema: schema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: ({ channelName }) => {
      setSubmitting(true);
      axios.post(
        routes.channelsPath(),
        { name: channelName },
        { headers: { Authorization: `Bearer ${token}` } },
      )
        .then((response) => {
          const newChannelId = response.data.id;
          dispatch(uiActions.setActiveChannel(newChannelId));
          dispatch(uiActions.closeModal());
        })
        .catch((reason) => console.error(reason))
        .finally(() => setSubmitting(false));
    },
  });

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <>
      <ModalBootstrap.Header>
        <ModalBootstrap.Title>{t('modals.add')}</ModalBootstrap.Title>
        <CloseButton onClick={() => dispatch(uiActions.closeModal())} />
      </ModalBootstrap.Header>
      <Form noValidate onSubmit={formik.handleSubmit}>
        <ModalBootstrap.Body>
          <Form.Group className="mb-3" controlId="channelName">
            <Form.Label className="d-none">{t('modals.channelName')}</Form.Label>
            <Form.Control
              type="text"
              name="channelName"
              value={formik.values.channelName}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.channelName}
              ref={inputRef}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.channelName}
            </Form.Control.Feedback>
          </Form.Group>
        </ModalBootstrap.Body>
        <ModalBootstrap.Footer>
          <Button
            variant="secondary"
            onClick={() => dispatch(uiActions.closeModal())}
          >
            {t('modals.cancel')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {t('modals.submit')}
          </Button>
        </ModalBootstrap.Footer>
      </Form>
    </>
  );
};

const DeleteChannelModal = ({ t, token, channelId }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {},
    onSubmit: () => {
      setSubmitting(true);
      axios.delete(
        routes.channelPath(channelId),
        { headers: { Authorization: `Bearer ${token}` } },
      )
        .then(() => dispatch(uiActions.closeModal()))
        .catch((reason) => console.error(reason))
        .finally(() => setSubmitting(false));
    },
  });

  return (
    <>
      <ModalBootstrap.Header>
        <ModalBootstrap.Title>{t('modals.remove')}</ModalBootstrap.Title>
        <CloseButton onClick={() => dispatch(uiActions.closeModal())} />
      </ModalBootstrap.Header>
      <Form onSubmit={formik.handleSubmit}>
        <ModalBootstrap.Body>{t('modals.confirmation')}</ModalBootstrap.Body>
        <ModalBootstrap.Footer>
          <Button
            variant="secondary"
            onClick={() => dispatch(uiActions.closeModal())}
          >
            {t('modals.cancel')}
          </Button>
          <Button
            type="submit"
            variant="danger"
            disabled={isSubmitting}
          >
            {t('modals.confirm')}
          </Button>
        </ModalBootstrap.Footer>
      </Form>
    </>
  );
};

const RenameChannelModal = ({ t, token, channelId }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  const channels = useSelector(channelsSelectors.selectAll);
  const channelsNames = channels.map(({ name }) => name);

  const schema = yup.object().shape({
    newChannelName: yup.string()
      .required(t('modals.required'))
      .min(3, t('modals.min'))
      .max(20, t('modals.max'))
      .notOneOf(channelsNames, t('modals.uniq')),
  });

  const formik = useFormik({
    initialValues: {
      newChannelName: '',
    },
    validationSchema: schema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: ({ newChannelName }) => {
      setSubmitting(true);
      axios.patch(
        routes.channelPath(channelId),
        { name: newChannelName },
        { headers: { Authorization: `Bearer ${token}` } },
      )
        .then(() => dispatch(uiActions.closeModal()))
        .catch((reason) => console.error(reason))
        .finally(() => setSubmitting(false));
    },
  });

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <>
      <ModalBootstrap.Header>
        <ModalBootstrap.Title>{t('modals.rename')}</ModalBootstrap.Title>
        <CloseButton onClick={() => dispatch(uiActions.closeModal())} />
      </ModalBootstrap.Header>
      <Form noValidate onSubmit={formik.handleSubmit}>
        <ModalBootstrap.Body>
          <Form.Group className="mb-3" controlId="newChannelName">
            <Form.Label className="d-none">{t('modals.editChannelName')}</Form.Label>
            <Form.Control
              type="text"
              name="newChannelName"
              value={formik.values.newChannelName}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.newChannelName}
              ref={inputRef}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.newChannelName}
            </Form.Control.Feedback>
          </Form.Group>
        </ModalBootstrap.Body>
        <ModalBootstrap.Footer>
          <Button
            variant="secondary"
            onClick={() => dispatch(uiActions.closeModal())}
          >
            {t('modals.cancel')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {t('modals.submit')}
          </Button>
        </ModalBootstrap.Footer>
      </Form>
    </>
  );
};

const modals = {
  [modalType.addChannel]: AddChannelModal,
  [modalType.deleteChannel]: DeleteChannelModal,
  [modalType.renameChannel]: RenameChannelModal,
};

const Modal = () => {
  const { isShown, type, channelId } = useSelector((state) => state.ui.modal);
  const token = useSelector((state) => state.auth.token);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const ModalContent = modals[type];

  if (!ModalContent) {
    return null;
  }

  return (
    <ModalBootstrap
      show={isShown}
      centered
      autoFocus={false}
      onHide={() => dispatch(uiActions.closeModal())}
    >
      <ModalContent t={t} token={token} channelId={channelId} />
    </ModalBootstrap>
  );
};

export default Modal;
