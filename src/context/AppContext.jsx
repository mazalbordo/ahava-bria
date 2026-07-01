import { createContext, useContext, useState, useEffect } from 'react';
import {
  collection, doc, getDocs, setDoc, addDoc,
  updateDoc, deleteDoc, onSnapshot, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { INITIAL_STAGES, INITIAL_EVENTS, INITIAL_TASKS, INITIAL_VIDEOS } from '../data/initialData';

const AppContext = createContext(null);

const ADMIN_USER = {
  id: 'admin-mazal',
  username: 'mazal',
  password: 'mazal2024',
  name: 'מזל בורדו',
  role: 'admin',
};

async function seedIfEmpty() {
  const snap = await getDocs(collection(db, 'videos'));
  if (!snap.empty) return;
  const batch = [];
  for (const v of INITIAL_VIDEOS) batch.push(setDoc(doc(db, 'videos', v.id), v));
  for (const e of INITIAL_EVENTS) batch.push(setDoc(doc(db, 'events', e.id), e));
  for (const t of INITIAL_TASKS) batch.push(setDoc(doc(db, 'tasks', t.id), t));
  batch.push(setDoc(doc(db, 'users', 'client-sarah'), {
    username: 'sarah', password: '1234', name: 'שרה כהן',
    role: 'client', currentStage: 2, joinDate: '2024-01-15', notes: 'לקוחה ותיקה',
  }));
  batch.push(setDoc(doc(db, 'users', 'client-dana'), {
    username: 'dana', password: '1234', name: 'דנה לוי',
    role: 'client', currentStage: 1, joinDate: '2024-03-01', notes: '',
  }));
  await Promise.all(batch);
}

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const s = localStorage.getItem('ab_session');
    return s ? JSON.parse(s) : null;
  });
  const [loading, setLoading]       = useState(true);
  const [users, setUsers]           = useState([]);
  const [events, setEvents]         = useState([]);
  const [tasks, setTasks]           = useState([]);
  const [videos, setVideos]         = useState([]);
  const [posts, setPosts]           = useState([]);
  const [comments, setComments]     = useState([]);

  const stages = INITIAL_STAGES;

  useEffect(() => {
    seedIfEmpty().finally(() => setLoading(false));
    const uns = [
      onSnapshot(collection(db, 'users'),    s => setUsers(s.docs.map(d => ({ id: d.id, ...d.data() })))),
      onSnapshot(collection(db, 'events'),   s => setEvents(s.docs.map(d => ({ id: d.id, ...d.data() })))),
      onSnapshot(collection(db, 'tasks'),    s => setTasks(s.docs.map(d => ({ id: d.id, ...d.data() })))),
      onSnapshot(collection(db, 'videos'),   s => setVideos(s.docs.map(d => ({ id: d.id, ...d.data() })))),
      onSnapshot(collection(db, 'posts'),    s => setPosts(s.docs.map(d => ({ id: d.id, ...d.data() })))),
      onSnapshot(collection(db, 'comments'), s => setComments(s.docs.map(d => ({ id: d.id, ...d.data() })))),
    ];
    return () => uns.forEach(u => u());
  }, []);

  async function login(username, password) {
    if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
      localStorage.setItem('ab_session', JSON.stringify(ADMIN_USER));
      setCurrentUser(ADMIN_USER);
      return { success: true };
    }
    const snap = await getDocs(collection(db, 'users'));
    const found = snap.docs.find(d => {
      const data = d.data();
      return data.username === username.trim() && data.password === password;
    });
    if (found) {
      const user = { id: found.id, ...found.data() };
      localStorage.setItem('ab_session', JSON.stringify(user));
      setCurrentUser(user);
      return { success: true };
    }
    return { success: false, error: 'שם משתמש או סיסמה שגויים' };
  }

  function logout() {
    localStorage.removeItem('ab_session');
    setCurrentUser(null);
  }

  async function addUser(data) {
    const ref = doc(collection(db, 'users'));
    const userData = { ...data, role: 'client', joinDate: new Date().toISOString().split('T')[0] };
    await setDoc(ref, userData);
    return { id: ref.id, ...userData };
  }
  async function updateUser(id, data) {
    await updateDoc(doc(db, 'users', id), data);
    if (currentUser?.id === id) {
      const updated = { ...currentUser, ...data };
      localStorage.setItem('ab_session', JSON.stringify(updated));
      setCurrentUser(updated);
    }
  }
  async function deleteUser(id) { await deleteDoc(doc(db, 'users', id)); }

  async function addEvent(data)        { await addDoc(collection(db, 'events'), { ...data, createdAt: serverTimestamp() }); }
  async function updateEvent(id, data) { await updateDoc(doc(db, 'events', id), data); }
  async function deleteEvent(id)       { await deleteDoc(doc(db, 'events', id)); }

  async function addTask(data)         { await addDoc(collection(db, 'tasks'), { ...data, completed: false, createdAt: serverTimestamp() }); }
  async function updateTask(id, data)  { await updateDoc(doc(db, 'tasks', id), data); }
  async function deleteTask(id)        { await deleteDoc(doc(db, 'tasks', id)); }
  async function toggleTask(id) {
    const t = tasks.find(t => t.id === id);
    if (t) await updateDoc(doc(db, 'tasks', id), { completed: !t.completed });
  }

  async function addVideo(data)        { await addDoc(collection(db, 'videos'), { ...data, uploadDate: new Date().toISOString().split('T')[0] }); }
  async function updateVideo(id, data) { await updateDoc(doc(db, 'videos', id), data); }
  async function deleteVideo(id)       { await deleteDoc(doc(db, 'videos', id)); }

  async function addPost(type, content) {
    await addDoc(collection(db, 'posts'), {
      type, content,
      authorId: currentUser.id,
      authorName: currentUser.displayName || currentUser.name,
      isAdmin: currentUser.role === 'admin',
      createdAt: serverTimestamp(),
    });
  }
  async function deletePost(id) {
    await deleteDoc(doc(db, 'posts', id));
    const toDelete = comments.filter(c => c.postId === id);
    await Promise.all(toDelete.map(c => deleteDoc(doc(db, 'comments', c.id))));
  }
  async function addComment(postId, content) {
    await addDoc(collection(db, 'comments'), {
      postId, content,
      authorId: currentUser.id,
      authorName: currentUser.displayName || currentUser.name,
      isAdmin: currentUser.role === 'admin',
      createdAt: serverTimestamp(),
    });
  }
  async function deleteComment(id) { await deleteDoc(doc(db, 'comments', id)); }

  async function sendCrisisReport(answers) {
    await addDoc(collection(db, 'crisisReports'), {
      userId: currentUser?.id, userName: currentUser?.name,
      ...answers, timestamp: serverTimestamp(), seen: false,
    });
  }
  async function saveDailyEntry(type, data) {
    const today = new Date().toISOString().split('T')[0];
    const ref = doc(db, 'checkins', `${currentUser?.id}_${today}_${type}`);
    await setDoc(ref, { userId: currentUser?.id, date: today, type, ...data }, { merge: true });
  }

  function getClientEvents(clientId) { return events.filter(e => e.clientId === 'all' || e.clientId === clientId); }
  function getClientTasks(clientId)  { return tasks.filter(t => t.clientId === clientId); }
  function getPostComments(postId)   {
    return comments
      .filter(c => c.postId === postId)
      .sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
  }

  const clients = users.filter(u => u.role === 'client');

  return (
    <AppContext.Provider value={{
      currentUser, loading, login, logout,
      users, clients, addUser, updateUser, deleteUser,
      stages,
      events, addEvent, updateEvent, deleteEvent, getClientEvents,
      tasks, addTask, updateTask, deleteTask, toggleTask, getClientTasks,
      videos, addVideo, updateVideo, deleteVideo,
      posts, addPost, deletePost,
      comments, addComment, deleteComment, getPostComments,
      sendCrisisReport, saveDailyEntry,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() { return useContext(AppContext); }