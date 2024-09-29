import React, { useState } from 'react';
// import './style.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faGooglePlusG, faFacebookF, faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

const LoginPage = () => {
  // State to toggle between Sign In and Sign Up
  const [isSignInActive, setIsSignInActive] = useState(true);
  
  // State variables for form inputs
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignInClick = () => {
    setIsSignInActive(true);
  };

  const handleSignUpClick = () => {
    setIsSignInActive(false);
  };

  // Prevent form submission reload
  const handleSignInSubmit = (e) => {
    e.preventDefault();
    // Handle sign-in logic here
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    
    // Create a user object
    const user = {
      username,
      password_hash: password, // Assuming you hash the password before sending it
      email,
    };

    try {
      const response = await fetch('http://localhost:8000/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('User created:', result);
        // Optionally, you can redirect or reset the form
      } else {
        const error = await response.json();
        console.error('Error creating user:', error.detail);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <div className={`container ${isSignInActive ? '' : 'active'}`} id="container">
      {/* Sign Up Form */}
      <div className="form-container sign-up">
        <form onSubmit={handleSignUpSubmit}>
          <h1>Create Account</h1>
          {/* <div className="social-icons">
            <a href="#" className="icon"><FontAwesomeIcon icon={faGooglePlusG} /></a>
            <a href="#" className="icon"><FontAwesomeIcon icon={faFacebookF} /></a>
            <a href="#" className="icon"><FontAwesomeIcon icon={faGithub} /></a>
            <a href="#" className="icon"><FontAwesomeIcon icon={faLinkedinIn} /></a>
          </div> */}
          <span>or use your email for registration</span>
          <input 
            type="text" 
            placeholder="Name" 
            required 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
          <input 
            type="email" 
            placeholder="Email" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>

      {/* Sign In Form */}
      <div className="form-container sign-in">
        <form onSubmit={handleSignInSubmit}>
          <h1>Sign In</h1>
          {/* <div className="social-icons">
            <a href="#1" className="icon"><FontAwesomeIcon icon={faGooglePlusG} /></a>
            <a href="#2" className="icon"><FontAwesomeIcon icon={faFacebookF} /></a>
            <a href="#3" className="icon"><FontAwesomeIcon icon={faGithub} /></a>
            <a href="#4" className="icon"><FontAwesomeIcon icon={faLinkedinIn} /></a>
          </div> */}
          <span>or use your email and password</span>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <a href="#">Forgot Your Password?</a>
          <button type="submit">Sign In</button>
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