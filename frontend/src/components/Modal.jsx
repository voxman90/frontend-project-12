import React, { useRef } from 'react';
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
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const channels = useSelector(channelsSelectors.selectAll);
  const channelsNames = channels.map(({ channelName }) => channelName);

  const formik = useFormik({
    initialValues: {
      channelName: '',
    },
    validationSchema: yup.object({
      channelName: yup.string()
        .required(t('modals.required'))
        .min(3, t('modals.min'))
        .max(20, t('modals.max'))
        .notOneOf(channelsNames, t('modals.uniq')),
    }),
    onSubmit: ({ channelName }) => {
      axios.post(
        routes.channelsPath(),
        { name: channelName },
        { headers: { Authorization: `Bearer ${token}` } },
      ).then((response) => {
        const newChannelId = response.data.id;
        dispatch(uiActions.setActiveChannel(newChannelId));
        dispatch(uiActions.closeModal());
      }).catch((reason) => {
        console.error(reason);
        inputRef.focus();
      });
    },
  });

  return (
    <>
      <ModalBootstrap.Header>
        <ModalBootstrap.Title>{t('modals.add')}</ModalBootstrap.Title>
        <CloseButton onClick={() => dispatch(uiActions.closeModal())} />
      </ModalBootstrap.Header>
      <Form onSubmit={formik.handleSubmit}>
        <ModalBootstrap.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label className="d-none">{t('modals.channelName')}</Form.Label>
            <Form.Control
              type="text"
              name="channelName"
              placeholder=""
              ref={inputRef}
              autoFocus
              disabled={formik.isSubmitting}
              value={formik.values.channelName}
              onChange={formik.handleChange}
            />
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

  const formik = useFormik({
    initialValues: {},
    onSubmit: () => {
      axios.delete(
        routes.channelPath(channelId),
        { headers: { Authorization: `Bearer ${token}` } },
      )
        .then(() => dispatch(uiActions.closeModal()))
        .catch((reason) => console.error(reason));
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
          >
            {t('modals.confirm')}
          </Button>
        </ModalBootstrap.Footer>
      </Form>
    </>
  );
};

const RenameChannelModal = ({ t, token, channelId }) => {
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const channels = useSelector((state) => state.channels.entities);
  const channelsNames = Object.values(channels).map(({ channelName }) => channelName);

  const formik = useFormik({
    initialValues: {
      newChannelName: '',
    },
    validationSchema: yup.object({
      newChannelName: yup.string()
        .required(t('modalss.required'))
        .min(3, t('modalss.min'))
        .max(20, t('modalss.max'))
        .notOneOf(channelsNames, t('modalss.uniq')),
    }),
    onSubmit: ({ newChannelName }) => {
      axios.patch(
        routes.channelPath(channelId),
        { name: newChannelName },
        { headers: { Authorization: `Bearer ${token}` } },
      ).then(() => {
        dispatch(uiActions.closeModal());
      }).catch((reason) => {
        console.error(reason);
        inputRef.focus();
      });
    },
  });

  return (
    <>
      <ModalBootstrap.Header>
        <ModalBootstrap.Title>{t('modals.rename')}</ModalBootstrap.Title>
        <CloseButton onClick={() => dispatch(uiActions.closeModal())} />
      </ModalBootstrap.Header>
      <Form onSubmit={formik.handleSubmit}>
        <ModalBootstrap.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label className="d-none">{t('modals.editChannelName')}</Form.Label>
            <Form.Control
              type="text"
              name="newChannelName"
              placeholder=""
              autoFocus
              disabled={formik.isSubmitting}
              value={formik.values.newChannelName}
              onChange={formik.handleChange}
            />
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
      onHide={() => dispatch(uiActions.closeModal())}
    >
      <ModalContent t={t} channelId={channelId} token={token} />
    </ModalBootstrap>
  );
};

export default Modal;
