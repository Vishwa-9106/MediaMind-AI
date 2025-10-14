import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

/**
 * Get user document from Firestore
 * @param {string} userId 
 * @returns {Promise<object|null>}
 */
export const getUserDocument = async (userId) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user document:", error);
    throw new Error("Failed to fetch user data.");
  }
};

/**
 * Create user document in Firestore
 * @param {string} userId 
 * @param {string} email 
 * @returns {Promise<object>}
 */
export const createUserDocument = async (userId, email) => {
  try {
    const userData = {
      uid: userId,
      email: email,
      createdAt: new Date(),
      // Add any other default fields you want for new users
      displayName: null,
      photoURL: null
    };
    
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, userData);
    
    return userData;
  } catch (error) {
    console.error("Error creating user document:", error);
    throw new Error("Failed to create user profile.");
  }
};

/**
 * Update user document in Firestore
 * @param {string} userId 
 * @param {object} data 
 * @returns {Promise<void>}
 */
export const updateUserDocument = async (userId, data) => {
  try {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, data, { merge: true });
  } catch (error) {
    console.error("Error updating user document:", error);
    throw new Error("Failed to update user profile.");
  }
};