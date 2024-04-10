import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';

import { login } from '../slices/auth.js';
import routes from '../routes.js';

const LoginForm = () => {
  const dispatch = useDispatch();
  const [authFailed, setAuthFailed] = useState(false);
  const inputRef = useRef();
  const location = useLocation();
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
    onSubmit: async (values) => {
      setAuthFailed(false);

      try {
        const res = await axios.post(routes.loginPath(), values);
        dispatch(login(res.data));
        const { from } = location.state || { from: { pathname: routes.chatPagePath() } };
        navigate(from);
      } catch (err) {
        if (!err.isAxiosError) {
          // placeholder
          return;
        }

        if (err.response?.status === 401) {
          setAuthFailed(true);
          inputRef.current.select();
        } else {
          // placeholder
        }
      }
    },
  });

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-sm-8 col-md-6 col-xxl-4">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <Form onSubmit={formik.handleSubmit} className="mt-3">
                <h1 className="text-center mb-4">
                  {t('login.header')}
                </h1>
                <Form.Group className="form-floating mb-3">
                  <Form.Control
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    name="username"
                    id="username"
                    isInvalid={authFailed}
                    ref={inputRef}
                    placeholder={t('login.username')}
                    required
                  />
                  <Form.Label htmlFor="username">
                    {t('login.username')}
                  </Form.Label>
                </Form.Group>
                <Form.Group className="form-floating mb-4">
                  <Form.Control
                    type="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    name="password"
                    id="password"
                    isInvalid={authFailed}
                    placeholder={t('login.password')}
                    required
                  />
                  <Form.Label htmlFor="password">
                    {t('login.password')}
                  </Form.Label>
                  {
                    authFailed
                    && (
                      <Form.Control.Feedback type="invalid" tooltip>
                        {t('login.authFailed')}
                      </Form.Control.Feedback>
                    )
                  }
                </Form.Group>
                <div className="text-center">
                  <Button type="submit" variant="outline-primary" className="w-50">
                    {t('login.submit')}
                  </Button>
                </div>
              </Form>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>{`${t('login.newToChat')} `}</span>
                <Link to={routes.signupPagePath()}>
                  {t('login.signup')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
