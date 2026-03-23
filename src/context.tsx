import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Module, Deadline, Note, InboxItem, SASState } from './types';
import { 
  db, 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut 
} from './firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { onAuthStateChanged, User, GoogleAuthProvider } from 'firebase/auth';
import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from './googleCalendar';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface SASContextType extends SASState {
  user: User | null;
  loading: boolean;
  error: string | null;
  accessToken: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  addModule: (module: Omit<Module, 'id'>) => void;
  updateModule: (id: string, module: Partial<Omit<Module, 'id'>>) => void;
  deleteModule: (id: string) => void;
  addDeadline: (deadline: Omit<Deadline, 'id'>) => void;
  updateDeadline: (id: string, deadline: Partial<Omit<Deadline, 'id'>>) => void;
  deleteDeadline: (id: string) => void;
  updateDeadlineStatus: (id: string, status: Deadline['status']) => void;
  addNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<Omit<Note, 'id' | 'updatedAt'>>) => void;
  deleteNote: (id: string) => void;
  addInboxItem: (text: string) => void;
  processInboxItem: (id: string) => void;
}

const SASContext = createContext<SASContextType | undefined>(undefined);

export function SASProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('google_access_token'));
  const [state, setState] = useState<SASState>({
    modules: [],
    deadlines: [],
    notes: [],
    inbox: [],
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setState({ modules: [], deadlines: [], notes: [], inbox: [] });
      return;
    }

    const modulesPath = `users/${user.uid}/modules`;
    const unsubModules = onSnapshot(collection(db, modulesPath), (snapshot) => {
      const modules = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Module));
      setState(prev => ({ ...prev, modules }));
    }, (error) => handleFirestoreError(error, OperationType.LIST, modulesPath));

    const deadlinesPath = `users/${user.uid}/deadlines`;
    const unsubDeadlines = onSnapshot(collection(db, deadlinesPath), (snapshot) => {
      const deadlines = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Deadline));
      setState(prev => ({ ...prev, deadlines }));
    }, (error) => handleFirestoreError(error, OperationType.LIST, deadlinesPath));

    const notesPath = `users/${user.uid}/notes`;
    const unsubNotes = onSnapshot(collection(db, notesPath), (snapshot) => {
      const notes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note));
      setState(prev => ({ ...prev, notes }));
    }, (error) => handleFirestoreError(error, OperationType.LIST, notesPath));

    const inboxPath = `users/${user.uid}/inbox`;
    const unsubInbox = onSnapshot(collection(db, inboxPath), (snapshot) => {
      const inbox = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InboxItem));
      setState(prev => ({ ...prev, inbox }));
    }, (error) => handleFirestoreError(error, OperationType.LIST, inboxPath));

    return () => {
      unsubModules();
      unsubDeadlines();
      unsubNotes();
      unsubInbox();
    };
  }, [user]);

  const login = async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken || null;
      if (token) {
        setAccessToken(token);
        localStorage.setItem('google_access_token', token);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'An unknown error occurred during login.');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setAccessToken(null);
      localStorage.removeItem('google_access_token');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const addModule = async (module: Omit<Module, 'id'>) => {
    if (!user) return;
    const path = `users/${user.uid}/modules`;
    try {
      await addDoc(collection(db, path), module);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const updateModule = async (id: string, moduleUpdate: Partial<Omit<Module, 'id'>>) => {
    if (!user) return;
    const path = `users/${user.uid}/modules/${id}`;
    try {
      await updateDoc(doc(db, path), moduleUpdate);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const deleteModule = async (id: string) => {
    if (!user) return;
    const path = `users/${user.uid}/modules/${id}`;
    try {
      await deleteDoc(doc(db, path));
      // Deadlines and notes cleanup should ideally be handled by a cloud function or batch,
      // but for this applet we'll just delete the module. 
      // Security rules will prevent access to orphaned data.
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const addDeadline = async (deadline: Omit<Deadline, 'id'>) => {
    if (!user) return;
    const path = `users/${user.uid}/deadlines`;
    try {
      let googleEventId: string | undefined;
      
      if (accessToken) {
        try {
          const event = await createCalendarEvent(accessToken, {
            summary: deadline.title,
            description: deadline.description || '',
            start: { date: deadline.dueDate },
            end: { date: deadline.dueDate },
          });
          googleEventId = event.id;
        } catch (error) {
          console.error('Failed to sync with Google Calendar:', error);
        }
      }

      await addDoc(collection(db, path), {
        ...deadline,
        googleEventId
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const updateDeadline = async (id: string, deadlineUpdate: Partial<Omit<Deadline, 'id'>>) => {
    if (!user) return;
    const path = `users/${user.uid}/deadlines/${id}`;
    try {
      const currentDeadline = state.deadlines.find(d => d.id === id);
      if (accessToken && currentDeadline?.googleEventId) {
        try {
          await updateCalendarEvent(accessToken, currentDeadline.googleEventId, {
            summary: deadlineUpdate.title || currentDeadline.title,
            description: deadlineUpdate.description || currentDeadline.description || '',
            start: { date: deadlineUpdate.dueDate || currentDeadline.dueDate },
            end: { date: deadlineUpdate.dueDate || currentDeadline.dueDate },
          });
        } catch (error) {
          console.error('Failed to update Google Calendar:', error);
        }
      }
      await updateDoc(doc(db, path), deadlineUpdate);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const deleteDeadline = async (id: string) => {
    if (!user) return;
    const path = `users/${user.uid}/deadlines/${id}`;
    try {
      const currentDeadline = state.deadlines.find(d => d.id === id);
      if (accessToken && currentDeadline?.googleEventId) {
        try {
          await deleteCalendarEvent(accessToken, currentDeadline.googleEventId);
        } catch (error) {
          console.error('Failed to delete from Google Calendar:', error);
        }
      }
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const updateDeadlineStatus = async (id: string, status: Deadline['status']) => {
    if (!user) return;
    const path = `users/${user.uid}/deadlines/${id}`;
    try {
      await updateDoc(doc(db, path), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const addNote = async (note: Omit<Note, 'id' | 'updatedAt'>) => {
    if (!user) return;
    const path = `users/${user.uid}/notes`;
    try {
      await addDoc(collection(db, path), {
        ...note,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const updateNote = async (id: string, noteUpdate: Partial<Omit<Note, 'id' | 'updatedAt'>>) => {
    if (!user) return;
    const path = `users/${user.uid}/notes/${id}`;
    try {
      await updateDoc(doc(db, path), {
        ...noteUpdate,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const deleteNote = async (id: string) => {
    if (!user) return;
    const path = `users/${user.uid}/notes/${id}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const addInboxItem = async (text: string) => {
    if (!user) return;
    const path = `users/${user.uid}/inbox`;
    try {
      await addDoc(collection(db, path), {
        text,
        createdAt: new Date().toISOString(),
        processed: false
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const processInboxItem = async (id: string) => {
    if (!user) return;
    const path = `users/${user.uid}/inbox/${id}`;
    try {
      await updateDoc(doc(db, path), { processed: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  return (
    <SASContext.Provider value={{
      ...state,
      user,
      loading,
      error,
      accessToken,
      login,
      logout,
      addModule,
      updateModule,
      deleteModule,
      addDeadline,
      updateDeadline,
      deleteDeadline,
      updateDeadlineStatus,
      addNote,
      updateNote,
      deleteNote,
      addInboxItem,
      processInboxItem
    }}>
      {children}
    </SASContext.Provider>
  );
}

export function useSAS() {
  const context = useContext(SASContext);
  if (!context) throw new Error('useSAS must be used within a SASProvider');
  return context;
}
