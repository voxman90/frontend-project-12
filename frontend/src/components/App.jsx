import React from 'react';
import { useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';

import '../assets/App.css';
import ChatPage from './ChatPage';
import LoginForm from './LoginForm';
import Page404 from './Page404';
import Navbar from './Navbar';
import routes from '../routes';

const App = () => {
  const isAuthorisedUser = useSelector((state) => state.auth.token);

  return (
    <Router>
      <div className="d-flex flex-column h-100">
        <Navbar />
        <Routes>
          <Route path="*" element={<Page404 />} />
          <Route path={routes.loginPagePath()} element={<LoginForm />} />
          <Route path="/" element={isAuthorisedUser ? <Outlet /> : <Navigate to={routes.loginPagePath()} />}>
            <Route path="" element={<ChatPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
