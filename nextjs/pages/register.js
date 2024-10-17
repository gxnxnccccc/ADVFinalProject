import React, { useState } from 'react';
import { useRouter } from 'next/router';
import useBearStore from "@/store/useBearStore";  // Import Zustand store


const LoginPage = () => {
  const [isSignInActive, setIsSignInActive] = useState(true);

  // Form states for login
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);  // Remember Me state
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Zustand function to update login state
  const setIsLoggedIn = useBearStore((state) => state.setIsLoggedIn);  // Add this line

  const handleSignInClick = () => {
    setIsSignInActive(true);
  };

  const handleSignUpClick = () => {
    setIsSignInActive(false);
  };

  // Handle login form submission
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (loginUsername === '' || loginPassword === '') return;
    console.log({
      username: loginUsername,
      password_hash: loginPassword,
      remember_me: rememberMe,
  });
  console.log(1)
    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginUsername,  // 'username' should match FastAPI model
          password_hash: loginPassword,  // 'password_hash' should match FastAPI model
          remember_me: rememberMe  // 'remember_me' should match FastAPI model
        }),
        credentials: 'include',  // Include credentials (cookies) in the request
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login failed:", errorData);
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      console.log("Login successful:", data);

      // Store JWT token in localStorage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('username', loginUsername); 
      localStorage.setItem('user_id', data.user_id);
      localStorage.setItem("watchlist", data.watchlist);
      
      setNotification(data.message);

      setIsLoggedIn(true);  // Set login state to true after successful login

      // Redirect based on role
      if (data.role === 'Admin') {
        router.push('/dashboard/dashboard_index');  // Admin goes to dashboard
      } else {
        router.push('/');  // Regular users go to homepage
      }

    } catch (error) {
      console.error("Error during login:", error);
      console.log(error)
      setNotification(error.message);
    }
  };

  const checkLoginStatus = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/check-cookie', {
        method: 'GET',
        credentials: 'include',  // Include credentials (cookies) in the request
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User is logged in:", data);
        // Handle the logged in state here
      } else {
        console.log("User is not logged in");
      }

    } catch (error) {
      console.error("Error checking login status:", error);
    }
  };

  // Handle registration form submission
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true); // Set submitting to true

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
      router.push('/register');  // Redirect to login after registration
    } catch (error) {
      setNotification(error.message);
    } finally {
      setIsSubmitting(false); // Reset submitting status in finally block
    }
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token');  // Remove token from localStorage
    setIsLoggedIn(false);  // Set login state to false when logged out
    router.push('/login');  // Redirect to login page
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
              color: '#333',
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
                color: '#333',
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
                color: '#333',
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
              color: '#333',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            required
            style={{
              color: '#333',
            }}
          />
          <input
            type="password"
            placeholder="Confirmed Password"
            value={registerConfirmPassword}
            onChange={(e) => setRegisterConfirmPassword(e.target.value)}
            required
            style={{
              color: '#333',
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
              color: '#333',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
            style={{
              color: '#333',
            }}
          />

          {/* Remember Me Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '10px' }}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}  // Toggle Remember Me state
              style={{ marginRight: '5px' }}  // Adjust margin between checkbox and label
            />
            <label htmlFor="rememberMe" style={{ color: '#333' }}>Remember Me</label>
          </div>

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