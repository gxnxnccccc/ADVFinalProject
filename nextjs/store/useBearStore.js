// store/useBearStore.js
import { create } from "zustand";

/* 
  https://github.com/pmndrs/zustand
  Global state-management
*/

const useBearStore = create((set) => ({
  // App name state
  appName: "MOVIEPOP",  // Initialized with a default value
  setAppName: (name) => set({ appName: name }),

  // Login state
  isLoggedIn: false,  // Default login state is false
  setIsLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),  // Function to set login state

  // Admin state (if needed)
  isAdmin: false,  // Default admin state
  setIsAdmin: (admin) => set({ isAdmin: admin }),  // Function to set admin state

  // User details state
  username: null,  // Store username
  setUsername: (username) => set({ username }),  // Function to set username

  email: null,  // Store email
  setEmail: (email) => set({ email }),  // Function to set email

  gender: null,  // Store gender
  setGender: (gender) => set({ gender }),  // Function to set gender

  phoneNumber: null,  // Store phone number
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),  // Function to set phone number
}));

export default useBearStore;