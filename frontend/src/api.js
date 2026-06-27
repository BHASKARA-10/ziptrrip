import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db, auth } from './firebase';

const getUserId = () => {
  return auth?.currentUser?.uid || 'static_test_user';
};

export async function fetchTodos() {
  if (!db) throw new Error("Firebase DB not initialized");
  const q = query(collection(db, "todos"), where("userId", "==", getUserId()));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function fetchTodo(id) {
  // If you need single fetch, you can use getDoc. For now, fetch all and filter to keep it simple, 
  // since fetchTodo is rarely used on its own without context in this app.
  const todos = await fetchTodos();
  const todo = todos.find(t => t.id === id);
  if (!todo) throw new Error("Todo not found");
  return todo;
}

export async function createTodo(data) {
  if (!db) throw new Error("Firebase DB not initialized");
  const docData = { ...data, userId: getUserId() };
  const docRef = await addDoc(collection(db, "todos"), docData);
  return { id: docRef.id, ...docData };
}

export async function updateTodo(id, data) {
  if (!db) throw new Error("Firebase DB not initialized");
  const docRef = doc(db, "todos", id);
  // Do not overwrite userId
  const updateData = { ...data };
  delete updateData.id; 
  await updateDoc(docRef, updateData);
  return { id, ...data };
}

export async function deleteTodo(id) {
  if (!db) throw new Error("Firebase DB not initialized");
  const docRef = doc(db, "todos", id);
  await deleteDoc(docRef);
  return { success: true };
}
