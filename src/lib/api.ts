import axios from 'axios';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { auth } from "@/firebase/config";
import { toast } from "sonner";

// Mock API base URL - replace with actual backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface UploadResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  filename: string;
  fileType: string;
  uploadedAt: string;
}

export interface ProcessingStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message?: string;
}

export interface ResultData {
  id: string;
  filename: string;
  fileType: string;
  uploadedAt: string;
  results: {
    simpleSummary: string;
    detailedExplanation: string;
    childFriendly: string;
    storytelling: string;
  };
  thumbnail?: string;
}

// Upload file to backend
export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  // Mock response for now
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `mock-${Date.now()}`,
        status: 'pending',
        filename: file.name,
        fileType: file.type,
        uploadedAt: new Date().toISOString(),
      });
    }, 1000);
  });

  // Actual implementation:
  // const response = await api.post<UploadResponse>('/upload', formData, {
  //   headers: { 'Content-Type': 'multipart/form-data' },
  // });
  // return response.data;
};

// Upload via URL/link
export const uploadFromUrl = async (url: string): Promise<UploadResponse> => {
  // Mock response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `mock-url-${Date.now()}`,
        status: 'pending',
        filename: url.split('/').pop() || 'link',
        fileType: 'url',
        uploadedAt: new Date().toISOString(),
      });
    }, 1000);
  });

  // Actual implementation:
  // const response = await api.post<UploadResponse>('/upload/url', { url });
  // return response.data;
};

// Check processing status
export const checkStatus = async (id: string): Promise<ProcessingStatus> => {
  // Mock response with progressive status
  return new Promise((resolve) => {
    setTimeout(() => {
      const random = Math.random();
      resolve({
        id,
        status: random > 0.3 ? 'completed' : 'processing',
        progress: random > 0.3 ? 100 : Math.floor(Math.random() * 80) + 10,
        message: random > 0.3 ? 'Analysis complete!' : 'AI is analyzing your content...',
      });
    }, 500);
  });

  // Actual implementation:
  // const response = await api.get<ProcessingStatus>(`/status/${id}`);
  // return response.data;
};

// Get result by ID
export const getResult = async (id: string): Promise<ResultData> => {
  // Mock response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        filename: 'sample-video.mp4',
        fileType: 'video/mp4',
        uploadedAt: new Date().toISOString(),
        results: {
          simpleSummary: 'This video demonstrates a beautiful sunset over mountains with calm ambient music. The scene transitions from day to evening, showcasing natural colors and peaceful atmosphere.',
          detailedExplanation: `# Detailed Analysis

## Visual Content
The video captures a stunning natural landscape featuring:
- Mountain silhouettes against a vibrant sky
- Color transitions from golden yellows to deep oranges and purples
- Smooth camera panning showing the breadth of the scene

## Audio Elements
- Ambient nature sounds including bird calls
- Gentle wind rustling through trees
- Soft instrumental music in the background

## Technical Aspects
- Resolution: 1920x1080 (Full HD)
- Frame rate: 30 fps
- Duration: Approximately 45 seconds
- Camera movement: Slow horizontal pan

## Mood and Atmosphere
The overall tone is peaceful and contemplative, ideal for meditation or relaxation content.`,
          childFriendly: `🌅 **A Beautiful Sunset Story**

Imagine you're standing on top of a big hill, and the sun is saying goodnight! 

The sky turns into a magical painting with colors like:
- 🧡 Orange (like a juicy orange!)
- 💜 Purple (like grape juice!)
- 💛 Yellow (like a banana!)

You can hear little birds singing their bedtime songs and feel a gentle breeze on your face. It's like nature is giving everyone a big, warm hug before going to sleep!

✨ This video helps us remember that every ending (like sunset) is beautiful and peaceful.`,
          storytelling: `**The Mountain's Evening Tale**

As the ancient peaks stood sentinel over the valley, the day began its graceful farewell. The sun, that tireless wanderer across the sky, painted its final masterpiece of the day.

First came the gold—warm and generous, spilling across the clouds like liquid amber. Then the oranges deepened, telling stories of distant deserts and autumn leaves. Finally, the purples emerged, mysterious and calm, whispering promises of starlit nights to come.

The mountains themselves seemed to exhale, releasing the warmth they'd gathered throughout the day. Birds called to one another in that special language they use only at dusk, coordinating their evening routines.

This wasn't just a sunset—it was a daily ceremony, a reminder that every ending holds its own kind of beauty, and that tomorrow will bring another beginning.`,
        },
        thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      });
    }, 800);
  });

  // Actual implementation:
  // const response = await api.get<ResultData>(`/result/${id}`);
  // return response.data;
};

// Get upload history
export const getHistory = async (): Promise<ResultData[]> => {
  // Mock response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'history-1',
          filename: 'presentation.pdf',
          fileType: 'application/pdf',
          uploadedAt: new Date(Date.now() - 3600000).toISOString(),
          results: {
            simpleSummary: 'Business presentation about Q4 results...',
            detailedExplanation: '',
            childFriendly: '',
            storytelling: '',
          },
          thumbnail: 'https://images.unsplash.com/photo-1554224311-beee4ead8fce?w=400&h=300&fit=crop',
        },
        {
          id: 'history-2',
          filename: 'mountain-sunset.jpg',
          fileType: 'image/jpeg',
          uploadedAt: new Date(Date.now() - 7200000).toISOString(),
          results: {
            simpleSummary: 'Beautiful landscape photo of mountains at sunset...',
            detailedExplanation: '',
            childFriendly: '',
            storytelling: '',
          },
          thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        },
        {
          id: 'history-3',
          filename: 'tutorial-video.mp4',
          fileType: 'video/mp4',
          uploadedAt: new Date(Date.now() - 86400000).toISOString(),
          results: {
            simpleSummary: 'Educational video explaining quantum physics basics...',
            detailedExplanation: '',
            childFriendly: '',
            storytelling: '',
          },
          thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
        },
      ]);
    }, 500);
  });

  // Actual implementation:
  // const response = await api.get<ResultData[]>('/history');
  // return response.data;
};

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// GitHub Auth Provider
const githubProvider = new GithubAuthProvider();

// Email/Password Sign In
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    toast.success("Successfully signed in!");
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    console.error("Sign in error:", error);
    toast.error(error.message || "Failed to sign in");
    return { success: false, error };
  }
};

// Email/Password Sign Up
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    toast.success("Account created successfully!");
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    console.error("Sign up error:", error);
    toast.error(error.message || "Failed to create account");
    return { success: false, error };
  }
};

// Google Sign In
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    toast.success("Successfully signed in with Google!");
    return { success: true, user: result.user };
  } catch (error: any) {
    console.error("Google sign in error:", error);
    toast.error(error.message || "Failed to sign in with Google");
    return { success: false, error };
  }
};

// GitHub Sign In
export const signInWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    toast.success("Successfully signed in with GitHub!");
    return { success: true, user: result.user };
  } catch (error: any) {
    console.error("GitHub sign in error:", error);
    toast.error(error.message || "Failed to sign in with GitHub");
    return { success: false, error };
  }
};

// Sign Out
export const signOutUser = async () => {
  try {
    await signOut(auth);
    toast.success("Successfully signed out!");
    return { success: true };
  } catch (error: any) {
    console.error("Sign out error:", error);
    toast.error(error.message || "Failed to sign out");
    return { success: false, error };
  }
};

// Listen for auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export default api;