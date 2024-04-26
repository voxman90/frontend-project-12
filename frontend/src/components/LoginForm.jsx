import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { actions as authActions } from '../slices/auth.js';
import routes from '../routes.js';

const LoginForm = () => {
  const dispatch = useDispatch();
  const [authFailed, setAuthFailed] = useState(false);
  const inputRef = useRef();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: (values) => {
      setAuthFailed(false);

      axios.post(
        routes.loginPath(),
        values,
      )
        .then((response) => {
          dispatch(authActions.login(response.data));
          navigate(routes.chatPagePath());
        })
        .catch((reason) => {
          const status = reason.response?.status;

          if (status === 401) {
            setAuthFailed(true);
            inputRef.current.select();
            return;
          }

          if (status) {
            toast.error(t('errors.network'));
            return;
          }

          toast.error(t('errors.unknown'));
        });
    },
  });

  return (
    <div className="d-flex justify-content-center m-0 p-0 h-100">
      <div className="align-self-center col-12 col-sm-8 col-md-6 col-xxl-4">
        <Card className="pt-4">
          <Card.Header className="bg-white border-0 mb-3">
            <Card.Title className="text-center fs-1">{t('login.header')}</Card.Title>
          </Card.Header>
          <Card.Body className="px-5 mb-4">
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group className="form-floating mb-3">
                <Form.Control
                  id="username"
                  name="username"
                  placeholder={t('login.username')}
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  isInvalid={authFailed}
                  ref={inputRef}
                  required
                />
                <Form.Label>{t('login.username')}</Form.Label>
              </Form.Group>
              <Form.Group className="form-floating mb-4" controlId="password">
                <Form.Control
                  type="password"
                  name="password"
                  value={formik.values.password}
                  placeholder={t('login.password')}
                  onChange={formik.handleChange}
                  isInvalid={authFailed}
                  required
                />
                <Form.Label>{t('login.password')}</Form.Label>
                <Form.Control.Feedback type="invalid" tooltip>
                  {t('login.authFailed')}
                </Form.Control.Feedback>
              </Form.Group>
              <div className="text-center">
                <Button type="submit" variant="outline-primary" className="w-50">
                  {t('login.submit')}
                </Button>
              </div>
            </Form>
          </Card.Body>
          <Card.Footer className="p-4">
            <div className="text-center">
              <span>
                {`${t('login.newToChat')} `}
              </span>
              <Link to={routes.signupPagePath()}>
                {t('login.signup')}
              </Link>
            </div>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
