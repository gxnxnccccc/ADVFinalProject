import React, { useState } from 'react';
import { useRouter } from 'next/router';

const LoginPage = () => {
  const [isSignInActive, setIsSignInActive] = useState(true);

  // Form states for login
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Form states for registration
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerGender, setRegisterGender] = useState('');  
  const [registerAge, setRegisterAge] = useState('');  

  // Notification state for form feedback
  const [notification, setNotification] = useState('');

  const router = useRouter();

  const handleSignInClick = () => {
    setIsSignInActive(true);
  };

  const handleSignUpClick = () => {
    setIsSignInActive(false);
  };

  // Handle login form submission
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginUsername,
          password_hash: loginPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      setNotification(data.message);

      // Redirect based on role
      if (data.role === 'Admin') {
        router.push('/dashboard');  // Admin goes to dashboard
      } else {
        router.push('/');  // Regular users go to homepage
      }

    } catch (error) {
      setNotification(error.message);
    }
  };

  // Handle registration form submission
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
          gender: registerGender,  
          age: registerAge,  
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      const data = await response.json();
      setNotification('Registration successful!');
      router.push('/login');
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
          <input
            type="text"
            placeholder="Name"
            value={registerName}
            onChange={(e) => setRegisterName(e.target.value)}
            required
            style={{
              color: '#333',  // Replace this with the exact color code used for other fields
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <select
              value={registerGender}
              onChange={(e) => setRegisterGender(e.target.value)}
              required
              style={{
                backgroundColor: '#eee',
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '13px',
                width: '48%',
                color: '#333',  // Ensure this color matches the other input fields
              }}
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select
              value={registerAge}
              onChange={(e) => setRegisterAge(e.target.value)}
              required
              style={{
                backgroundColor: '#eee',
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '13px',
                width: '48%',
                color: '#333',  // Ensure this color matches the other input fields
              }}
            >
              <option value="">Age</option>
              {[...Array(51).keys()].slice(10).map((age) => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>
          </div>
          <input
            type="email"
            placeholder="Email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            required
            style={{
              color: '#333',  // Use the exact same color code as other input fields
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            required
            style={{
              color: '#333',  // Use the exact same color code as other input fields
            }}
          />
          <input
            type="password"
            placeholder="Confirmed Password"
            value={registerConfirmPassword}
            onChange={(e) => setRegisterConfirmPassword(e.target.value)}
            required
            style={{
              color: '#333',  // Use the exact same color code as other input fields
            }}
          />
          <button type="submit">Sign Up</button>
          <p>{notification}</p>
        </form>
      </div>

      {/* Sign In Form */}
      <div className="form-container sign-in">
        <form onSubmit={handleSignInSubmit}>
          <h1>Sign In</h1>
          <input
            type="text"
            placeholder="Username"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
            required
            style={{
              color: '#333',  // Ensure the same color code is applied here
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
            style={{
              color: '#333',  // Ensure the same color code is applied here
            }}
          />
          <button type="submit">Sign In</button>
          <p>{notification}</p>
        </form>
      </div>

      {/* Toggle between forms */}
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
