import React, { useEffect, useState, useRef } from 'react';
import {
  Alert,
  Button,
  Form,
  FloatingLabel,
  Card,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';

import routes from '../routes';
import { handleAxiosErrors } from '../utils';
import { actions as authActions } from '../slices/auth';

const SignUpForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isSubmitting, setSubmitting] = useState(false);
  const [signUpError, setSignUpError] = useState(null);
  const usernameInputRef = useRef();
  const navigate = useNavigate();

  const schema = yup.object().shape({
    username: yup.string()
      .min(3, t('signup.usernameConstraints'))
      .max(20, t('signup.usernameConstraints'))
      .required(t('signup.required')),
    password: yup.string()
      .min(6, t('signup.passMin'))
      .required(t('signup.required')),
    passwordConfirmation: yup.string()
      .required(t('signup.required'))
      .oneOf([yup.ref('password'), null], t('signup.mustMatch')),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema: schema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: ({ username, password }) => {
      setSubmitting(true);

      axios.post(
        routes.signupPath(),
        { username, password },
      )
        .then((response) => {
          setSignUpError(null);
          dispatch(authActions.login(response.data));
          navigate(routes.chatPagePath());
        })
        .catch((reason) => {
          handleAxiosErrors(reason, t, (status) => {
            if (status === 409) {
              setSignUpError(t('signup.alreadyExists'));
            }

            return status === 409;
          });
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  useEffect(() => {
    usernameInputRef.current.focus();
  }, []);

  return (
    <div className="d-flex justify-content-center m-0 p-0 h-100">
      <div className="align-self-center col-12 col-sm-8 col-md-6 col-xxl-4">
        <Card className="px-5 pb-5 pt-4">
          <Card.Header className="bg-white border-0 mb-3">
            <Card.Title className="text-center fs-1">{t('signup.header')}</Card.Title>
          </Card.Header>
          <Card.Body className="p-0">
            <Form noValidate onSubmit={formik.handleSubmit}>
              <Form.Group className="mb-3" controlId="username">
                <FloatingLabel
                  label={t('signup.username')}
                  controlId="username"
                >
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder=""
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.username && !!(formik.errors.username)}
                    ref={usernameInputRef}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {formik.errors.username}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <FloatingLabel
                  label={t('signup.password')}
                  controlId="password"
                >
                  <Form.Control
                    type="password"
                    name="password"
                    value={formik.values.password}
                    placeholder=""
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.password && !!(formik.errors.password)}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {formik.errors.password}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="mb-4 pb-1" controlId="passwordConfirmation">
                <FloatingLabel
                  label={t('signup.confirm')}
                  controlId="passwordConfirmation"
                >
                  <Form.Control
                    type="password"
                    name="passwordConfirmation"
                    value={formik.values.passwordConfirmation}
                    placeholder=""
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.passwordConfirmation
                      && !!(formik.errors.passwordConfirmation)
                    }
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {formik.errors.passwordConfirmation}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
              {signUpError && (
                <Alert variant="danger">
                  {signUpError}
                </Alert>
              )}
              <div className="text-center">
                <Button
                  type="submit"
                  className="w-75"
                  disabled={isSubmitting}
                  variant="outline-primary"
                >
                  {t('signup.submit')}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default SignUpForm;
