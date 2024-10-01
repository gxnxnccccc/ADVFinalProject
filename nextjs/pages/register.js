import React, { useState } from 'react';
// import './style.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faGooglePlusG, faFacebookF, faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

const LoginPage = () => {
  // State to toggle between Sign In and Sign Up
  const [isSignInActive, setIsSignInActive] = useState(true);

  // State for form inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  // State for notifications
  const [notification, setNotification] = useState('');

  const handleSignInClick = () => {
    setIsSignInActive(true);
  };

  const handleSignUpClick = () => {
    setIsSignInActive(false);
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password_hash: loginPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      setNotification('Login successful!');
      // Handle successful login (e.g., redirect)
    } catch (error) {
      setNotification(error.message);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (registerPassword !== registerConfirmPassword) {
      setNotification('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: registerName,
          email: registerEmail,
          password_hash: registerPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      const data = await response.json();
      setNotification('Registration successful!');
      // Handle successful registration (e.g., redirect)
    } catch (error) {
      setNotification(error.message);
    }
  };

  return (
    <div className={`container ${isSignInActive ? '' : 'active'}`} id="container">
      {/* Sign Up Form */}
      <div className="form-container sign-up">
        <form onSubmit={handleSignUpSubmit}>
          <h1>Create Account</h1>
          <span>or use your email for registration</span>
          <input
            type="text"
            placeholder="Name"
            value={registerName}
            onChange={(e) => setRegisterName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirmed Password"
            value={registerConfirmPassword}
            onChange={(e) => setRegisterConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
          <p>{notification}</p>
        </form>
      </div>

      {/* Sign In Form */}
      <div className="form-container sign-in">
        <form onSubmit={handleSignInSubmit}>
          <h1>Sign In</h1>
          <span>or use your email and password</span>
          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          />
          <a href="#">Forgot Your Password?</a>
          <button type="submit">Sign In</button>
          <p>{notification}</p>
        </form>
      </div>

      {/* Toggle Container */}
      <div className="toggle-container">
        <div className="toggle">
          {/* Left Panel for Sign In */}
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of the site's features</p>
            <button className="hidden" onClick={handleSignInClick} id="login">
              Sign In
            </button>
          </div>

          {/* Right Panel for Sign Up */}
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>Register with your personal details to use all of the site's features</p>
            <button className="hidden" onClick={handleSignUpClick} id="register">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;