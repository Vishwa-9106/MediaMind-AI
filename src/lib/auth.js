import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut
} from "firebase/auth";
import { auth } from "@/firebase/config";
import { getUserDocument, createUserDocument } from "@/utils/firestore";

/**
 * Sign in with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export const signInWithEmail = async (email, password) => {
  try {
    // Sign in with email and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Fetch user data from Firestore
    const userData = await getUserDocument(user.uid);
    
    return { 
      success: true, 
      user: {
        uid: user.uid,
        email: user.email,
        ...userData
      }
    };
  } catch (error) {
    console.error("Sign in error:", error);
    
    // Handle specific error cases
    switch (error.code) {
      case 'auth/user-not-found':
        return { success: false, error: "No user found with this email." };
      case 'auth/wrong-password':
        return { success: false, error: "Incorrect password." };
      case 'auth/invalid-email':
        return { success: false, error: "Invalid email address." };
      case 'auth/user-disabled':
        return { success: false, error: "This user account has been disabled." };
      default:
        return { success: false, error: error.message || "Failed to sign in." };
    }
  }
};

/**
 * Sign up with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export const signUpWithEmail = async (email, password) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user document in Firestore
    const userData = await createUserDocument(user.uid, user.email);
    
    return { 
      success: true, 
      user: {
        uid: user.uid,
        email: user.email,
        ...userData
      }
    };
  } catch (error) {
    console.error("Sign up error:", error);
    
    // Handle specific error cases
    switch (error.code) {
      case 'auth/email-already-in-use':
        return { success: false, error: "This email is already in use." };
      case 'auth/invalid-email':
        return { success: false, error: "Invalid email address." };
      case 'auth/weak-password':
        return { success: false, error: "Password should be at least 6 characters." };
      default:
        return { success: false, error: error.message || "Failed to create account." };
    }
  }
};

/**
 * Sign out the current user
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error: error.message || "Failed to sign out." };
  }
};