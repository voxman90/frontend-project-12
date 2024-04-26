import React, { useEffect, useState, useRef } from 'react';
// import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import {
  Button,
  Form,
  FloatingLabel,
  Card,
} from 'react-bootstrap';
import axios from 'axios';
import * as yup from 'yup';

import routes from '../routes';

const SignUpForm = () => {
  const { t } = useTranslation();
  // const dispatch = useDispatch();
  const [isSubmitting, setSubmitting] = useState(false);
  const usernameInputRef = useRef();

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
    onChange: () => {
      setSubmitting(true);

      axios.post(
        routes.signupPath(),
        {},
      )
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
      <Card className="align-self-center flex-grow-0 p-5">
        <Card.Header className="bg-white border-0">
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
                  isInvalid={!!formik.errors.username}
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
                  isInvalid={!!formik.errors.password}
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  {formik.errors.password}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-4" controlId="passwordConfirmation">
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
                  isInvalid={!!formik.errors.passwordConfirmation}
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  {formik.errors.passwordConfirmation}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <Button
              type="submit"
              className="w-100"
              disabled={isSubmitting}
              variant="outline-primary"
            >
              {t('signup.submit')}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SignUpForm;
