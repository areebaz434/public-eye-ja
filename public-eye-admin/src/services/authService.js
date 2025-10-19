import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

/**
 * Login for admin users only
 */
export const loginAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Check if user is admin
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (!userDoc.exists()) {
      await signOut(auth);
      throw new Error('User profile not found');
    }
    
    const userData = userDoc.data();
    
    // Verify admin role
    if (userData.role !== 'admin') {
      await signOut(auth);
      throw new Error('Access denied. Admin privileges required.');
    }
    
    return { success: true, user: { ...userData, uid: userCredential.user.uid } };
  } catch (error) {
    console.error('Admin login error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Logout admin
 */
export const logoutAdmin = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Listen to auth state changes
 */
export const onAdminAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && userDoc.data().role === 'admin') {
        callback({ ...userDoc.data(), uid: user.uid });
      } else {
        await signOut(auth);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

/**
 * Get current admin user
 */
export const getCurrentAdmin = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists() && userDoc.data().role === 'admin') {
      return { ...userDoc.data(), uid: user.uid };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting current admin:', error);
    return null;
  }
};