import React from 'react';
import { Button, Navbar as NavbarComponent } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { logout } from '../slices/auth.js';
import routes from '../routes.js';

const Navbar = () => {
  const dispatch = useDispatch();
  const isAuthorisedUser = useSelector((state) => state.auth.token);

  const { t } = useTranslation();

  return (
    <NavbarComponent className="shadow-sm bg-white">
      <div className="container">
        <NavbarComponent.Brand>
          <Link to={routes.chatPagePath()}>
            {t('hexletChat')}
          </Link>
        </NavbarComponent.Brand>
        {
          isAuthorisedUser
          && (
            <Button onClick={() => dispatch(logout())}>
              {t('logout')}
            </Button>
          )
        }
      </div>
    </NavbarComponent>
  );
};

export default Navbar;
