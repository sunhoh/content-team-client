'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { BlogTask } from '@/types';

interface TaskContextValue {
  tasks: BlogTask[];
  addTask: (task: BlogTask) => void;
  updateTask: (id: string, patch: Partial<BlogTask>) => void;
  deleteTask: (id: string) => void;
  selectedTask: BlogTask | null;
  setSelectedTask: (task: BlogTask | null) => void;
}

const TaskContext = createContext<TaskContextValue | null>(null);

const STORAGE_KEY = 'content_team_tasks';

function loadTasks(): BlogTask[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const tasks: BlogTask[] = JSON.parse(raw);
    return tasks.map((t) =>
      t.status === 'processing' ? { ...t, status: 'failed', stage: '연결 끊김' } : t
    );
  } catch {
    return [];
  }
}

function saveTasks(tasks: BlogTask[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<BlogTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<BlogTask | null>(null);

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  const addTask = useCallback((task: BlogTask) => {
    setTasks((prev) => {
      const next = [task, ...prev];
      saveTasks(next);
      return next;
    });
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<BlogTask>) => {
    setTasks((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...patch } : t));
      saveTasks(next);
      return next;
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => {
      const next = prev.filter((t) => t.id !== id);
      saveTasks(next);
      return next;
    });
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, selectedTask, setSelectedTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTask must be used within TaskProvider');
  return ctx;
}
