import { auth } from '@/config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    User as FirebaseUser,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

// Convert Firebase user to app user
const convertFirebaseUser = (firebaseUser: FirebaseUser): User => ({
  id: firebaseUser.uid,
  name: firebaseUser.displayName || 'User',
  email: firebaseUser.email || '',
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const appUser = convertFirebaseUser(firebaseUser);
        setUser(appUser);
        // Store user data in AsyncStorage for persistence
        AsyncStorage.setItem('user', JSON.stringify(appUser));
      } else {
        setUser(null);
        AsyncStorage.removeItem('user');
      }
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // Validate input
      if (!email || !password) {
        return { success: false, error: 'Please fill in all fields' };
      }
      
      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Convert to app user format
      const appUser = convertFirebaseUser(firebaseUser);
      setUser(appUser);
      
      return { success: true };
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      // Handle specific Firebase auth errors
      let errorMessage = 'An error occurred during sign in';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later';
          break;
        default:
          errorMessage = error.message || 'An error occurred during sign in';
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // Validate input
      if (!name || !email || !password) {
        return { success: false, error: 'Please fill in all fields' };
      }
      
      if (password.length < 8) {
        return { success: false, error: 'Password must be at least 8 characters' };
      }

      if (!email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update profile with display name
      await updateProfile(firebaseUser, {
        displayName: name
      });
      
      // Convert to app user format
      const appUser = convertFirebaseUser(firebaseUser);
      setUser(appUser);
      
      return { success: true };
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      // Handle specific Firebase auth errors
      let errorMessage = 'An error occurred during sign up';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please choose a stronger password';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled. Please contact support';
          break;
        default:
          errorMessage = error.message || 'An error occurred during sign up';
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      if (!email || !email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      // Send password reset email
      await sendPasswordResetEmail(auth, email);
      
      return { success: true };
    } catch (error: any) {
      console.error('Forgot password error:', error);
      
      // Handle specific Firebase auth errors
      let errorMessage = 'An error occurred while processing your request';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please try again later';
          break;
        default:
          errorMessage = error.message || 'An error occurred while processing your request';
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      signIn,
      signUp,
      signOut,
      forgotPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 