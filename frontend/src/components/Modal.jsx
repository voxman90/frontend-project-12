import React, {
  useEffect,
  useRef,
  useState,
  useContext,
} from 'react';
import {
  Button,
  Modal as ModalBootstrap,
  Form,
  CloseButton,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { LeoProfanityContext } from '../context/filter';
import { actions as uiActions, modalType } from '../slices/ui';
import { channelsSelectors, actions as channelsActions } from '../slices/channels';
import routes from '../routes';
import { handleAxiosErrors } from '../utils';

const getValidationScheme = (fieldName, names, t) => yup.object().shape({
  [fieldName]: yup.string()
    .required(t('modals.required'))
    .trim()
    .notOneOf(names, t('modals.uniq'))
    .min(3, t('modals.min'))
    .max(20, t('modals.max')),
});

const AddChannelModal = ({ t, token }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);
  const filter = useContext(LeoProfanityContext);

  const channels = useSelector(channelsSelectors.selectAll);
  const channelsNames = channels.map(({ name }) => filter.clean(name));
  console.log(channelsNames);

  const formik = useFormik({
    initialValues: {
      channelName: '',
    },
    validationSchema: getValidationScheme('channelName', channelsNames, t),
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: ({ channelName }) => {
      setSubmitting(true);
      const trimmedChannelName = channelName.trim();
      axios.post(
        routes.channelsPath(),
        { name: filter.clean(trimmedChannelName) },
        { headers: { Authorization: `Bearer ${token}` } },
      )
        .then((response) => {
          const newChannelId = response.data.id;
          toast.success(t('modals.created'));
          dispatch(channelsActions.setActiveChannel(newChannelId));
          dispatch(uiActions.closeModal());
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
  }, [formik.isSubmitting]);

  return (
    <>
      <ModalBootstrap.Header>
        <ModalBootstrap.Title>{t('modals.add')}</ModalBootstrap.Title>
        <CloseButton onClick={() => dispatch(uiActions.closeModal())} />
      </ModalBootstrap.Header>
      <Form noValidate onSubmit={formik.handleSubmit}>
        <ModalBootstrap.Body>
          <Form.Group className="mb-3" controlId="channelName">
            <Form.Floating>
              <Form.Control
                type="text"
                name="channelName"
                placeholder=""
                value={formik.values.channelName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.channelName && !!formik.errors.channelName}
                ref={inputRef}
              />
              <Form.Label>{t('modals.channelName')}</Form.Label>
              <Form.Control.Feedback type="invalid" tooltip>
                {formik.errors.channelName}
              </Form.Control.Feedback>
            </Form.Floating>
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
        .then(() => {
          toast.success(t('modals.removed'));
          dispatch(uiActions.closeModal());
        })
        .catch((reason) => {
          handleAxiosErrors(reason, t);
        })
        .finally(() => {
          setSubmitting(false);
        });
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
  const filter = useContext(LeoProfanityContext);

  const channels = useSelector(channelsSelectors.selectAll);
  const channelsNames = channels.map(({ name }) => filter.clean(name));

  const formik = useFormik({
    initialValues: {
      newChannelName: '',
    },
    validationSchema: getValidationScheme('newChannelName', channelsNames, t),
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: ({ newChannelName }) => {
      setSubmitting(true);
      const trimmedChannelName = newChannelName.trim();
      axios.patch(
        routes.channelPath(channelId),
        { name: filter.clean(trimmedChannelName) },
        { headers: { Authorization: `Bearer ${token}` } },
      )
        .then(() => {
          toast.success(t('modals.renamed'));
          dispatch(uiActions.closeModal());
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
  }, [formik.isSubmitting]);

  return (
    <>
      <ModalBootstrap.Header>
        <ModalBootstrap.Title>{t('modals.rename')}</ModalBootstrap.Title>
        <CloseButton onClick={() => dispatch(uiActions.closeModal())} />
      </ModalBootstrap.Header>
      <Form noValidate onSubmit={formik.handleSubmit}>
        <ModalBootstrap.Body>
          <Form.Group className="mb-3" controlId="newChannelName">
            <Form.Floating>
              <Form.Control
                type="text"
                name="newChannelName"
                placeholder=""
                value={formik.values.newChannelName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.newChannelName && !!formik.errors.newChannelName}
                ref={inputRef}
              />
              <Form.Label>{t('modals.channelName')}</Form.Label>
              <Form.Control.Feedback type="invalid" tooltip>
                {formik.errors.newChannelName}
              </Form.Control.Feedback>
            </Form.Floating>
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
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { isShown, type, channelId } = useSelector((state) => state.ui.modal);
  const token = useSelector((state) => state.auth.token);

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
