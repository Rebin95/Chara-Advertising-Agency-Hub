// src/taskService.js
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';

// زیادکردنی تاسکی نوێ
export async function addTask(userId, taskData) {
  try {
    const docRef = await addDoc(collection(db, 'tasks'), {
      userId: userId,
      ...taskData,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding task: ", error);
    throw error;
  }
}

// وەرگرتنی هەموو تاسکەکانی یوسەرێک
export async function getUserTasks(userId) {
  try {
    const q = query(
      collection(db, 'tasks'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const tasks = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    return tasks;
  } catch (error) {
    console.error("Error getting tasks: ", error);
    throw error;
  }
}

// نوێکردنەوەی تاسک
export async function updateTask(taskId, updates) {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error updating task: ", error);
    throw error;
  }
}

// سڕینەوەی تاسک
export async function deleteTask(taskId) {
  try {
    await deleteDoc(doc(db, 'tasks', taskId));
  } catch (error) {
    console.error("Error deleting task: ", error);
    throw error;
  }
}