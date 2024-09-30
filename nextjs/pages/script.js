import { useEffect } from 'react';

export default function ScriptPage() {
  useEffect(() => {
    // Ensure this only runs on the client side (browser)
    if (typeof window !== 'undefined') {
      const container = document.getElementById('container');
      const registerBtn = document.getElementById('register');
      const loginBtn = document.getElementById('login');

      if (registerBtn && loginBtn && container) {
        registerBtn.addEventListener('click', () => {
          container.classList.add('active');
        });

        loginBtn.addEventListener('click', () => {
          container.classList.remove('active');
        });
      }
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div>
      {/* Your HTML structure should be here, including the elements with IDs 'container', 'register', and 'login' */}
      <div id="container">
        <button id="register">Register</button>
        <button id="login">Login</button>
      </div>
    </div>
  );
}