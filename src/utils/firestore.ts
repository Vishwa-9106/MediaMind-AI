import { doc, getDoc, setDoc, DocumentData } from "firebase/firestore";
import { db } from "@/firebase/config";
import { User } from "firebase/auth";

// Define TypeScript interfaces
export interface UserData {
  uid: string;
  email: string | null;
  createdAt: Date;
  displayName: string | null;
  photoURL: string | null;
  [key: string]: any;
}

/**
 * Get user document from Firestore
 * @param {string} userId 
 * @returns {Promise<UserData | null>}
 */
export const getUserDocument = async (userId: string): Promise<UserData | null> => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    } else {
      return null;
    }
  } catch (error: any) {
    console.error("Error fetching user document:", error);
    // Return null instead of throwing error to allow app to continue
    return null;
  }
};

/**
 * Create user document in Firestore
 * @param {string} userId 
 * @param {string | null} email 
 * @returns {Promise<UserData>}
 */
export const createUserDocument = async (userId: string, email: string | null): Promise<UserData> => {
  try {
    const userData: UserData = {
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
  } catch (error: any) {
    console.error("Error creating user document:", error);
    // Return basic user data instead of throwing error
    return {
      uid: userId,
      email: email,
      createdAt: new Date(),
      displayName: null,
      photoURL: null
    };
  }
};

/**
 * Update user document in Firestore
 * @param {string} userId 
 * @param {Partial<UserData>} data 
 * @returns {Promise<void>}
 */
export const updateUserDocument = async (userId: string, data: Partial<UserData>): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, data, { merge: true });
  } catch (error: any) {
    console.error("Error updating user document:", error);
    // Silently fail for update operations
  }
};