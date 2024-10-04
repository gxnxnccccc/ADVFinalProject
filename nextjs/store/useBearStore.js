// store/useBearStore.js
import { create } from "zustand";

/* 
  https://github.com/pmndrs/zustand
  Global state-management
*/

const useBearStore = create((set) => ({
  // App name state
  appName: "MOVIEPOP",  // Reverted back to MOVIEPOP
  setAppName: (name) => set({ appName: name }),

  // Login state
  isLoggedIn: false,  // Initialize login state as false by default
  setIsLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),  // Function to update login state

  // Admin state
  isAdmin: false,  
  setIsAdmin: (admin) => set({ isAdmin }),  

  // User details state
  username: null,  
  setUsername: (username) => set({ username }),

  email: null,  
  setEmail: (email) => set({ email }),

  gender: null,  
  setGender: (gender) => set({ gender }),

  phoneNumber: null,  
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
}));

export default useBearStore;