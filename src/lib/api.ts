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
  resultText?: string;
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

// Helpers to persist latest analysis locally per id
const saveResult = (data: ResultData) => {
  try { sessionStorage.setItem(`result:${data.id}`, JSON.stringify(data)); } catch {}
};
const loadResult = (id: string): ResultData | null => {
  try {
    const raw = sessionStorage.getItem(`result:${id}`);
    return raw ? JSON.parse(raw) as ResultData : null;
  } catch { return null; }
};

// Upload file to backend
export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  // Call backend proxy -> Gemini
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    let details: any = undefined;
    try {
      details = await response.json();
    } catch {
      try { details = await response.text(); } catch {}
    }
    const msg = typeof details === 'string' ? details : (details?.error || 'Upload failed');
    throw new Error(msg);
  }
  const data = await response.json();
  // Build and persist a real ResultData for the Result page
  const id = `job-${Date.now()}`;
  const resultData: ResultData = {
    id,
    filename: file.name,
    fileType: file.type || 'application/octet-stream',
    uploadedAt: new Date().toISOString(),
    results: {
      simpleSummary: data?.results?.simpleSummary ?? data.resultText ?? '',
      detailedExplanation: data?.results?.detailedExplanation ?? data.resultText ?? '',
      childFriendly: data?.results?.childFriendly ?? data.resultText ?? '',
      storytelling: data?.results?.storytelling ?? data.resultText ?? '',
    },
  };
  saveResult(resultData);
  return {
    id,
    status: data.status || 'completed',
    filename: file.name,
    fileType: file.type,
    uploadedAt: new Date().toISOString(),
    resultText: data?.results?.simpleSummary ?? data.resultText,
  };
};

// Upload via URL/link
export const uploadFromUrl = async (url: string): Promise<UploadResponse> => {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  if (!response.ok) {
    let details: any = undefined;
    try {
      details = await response.json();
    } catch {
      try { details = await response.text(); } catch {}
    }
    const msg = typeof details === 'string' ? details : (details?.error || 'URL analyze failed');
    throw new Error(msg);
  }
  const data = await response.json();
  const id = `job-url-${Date.now()}`;
  const resultData: ResultData = {
    id,
    filename: url.split('/').pop() || 'link',
    fileType: 'url',
    uploadedAt: new Date().toISOString(),
    results: {
      simpleSummary: data?.results?.simpleSummary ?? data.resultText ?? '',
      detailedExplanation: data?.results?.detailedExplanation ?? data.resultText ?? '',
      childFriendly: data?.results?.childFriendly ?? data.resultText ?? '',
      storytelling: data?.results?.storytelling ?? data.resultText ?? '',
    },
  };
  saveResult(resultData);
  return {
    id,
    status: data.status || 'completed',
    filename: url.split('/').pop() || 'link',
    fileType: 'url',
    uploadedAt: new Date().toISOString(),
    resultText: data?.results?.simpleSummary ?? data.resultText,
  };
};

// Check processing status
export const checkStatus = async (id: string): Promise<ProcessingStatus> => {
  // If we have a stored result for this id, mark as completed immediately
  const existing = loadResult(id);
  if (existing) {
    return {
      id,
      status: 'completed',
      progress: 100,
      message: 'Analysis complete!'
    };
  }
  // Fallback to a short progressing mock
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, status: 'processing', progress: 50, message: 'Processing...' });
    }, 300);
  });
};

// Get result by ID
export const getResult = async (id: string): Promise<ResultData> => {
  const stored = loadResult(id);
  if (stored) return stored;
  // If nothing stored, return a minimal empty result to avoid demo content
  return {
    id,
    filename: 'unknown',
    fileType: 'application/octet-stream',
    uploadedAt: new Date().toISOString(),
    results: {
      simpleSummary: '',
      detailedExplanation: '',
      childFriendly: '',
      storytelling: '',
    },
  };
};

// Get upload history
export const getHistory = async (): Promise<ResultData[]> => {
  try {
    const items: ResultData[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('result:')) {
        try {
          const raw = sessionStorage.getItem(key);
          if (raw) {
            const data = JSON.parse(raw) as ResultData;
            items.push(data);
          }
        } catch {}
      }
    }
    items.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    return items;
  } catch {
    return [];
  }
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