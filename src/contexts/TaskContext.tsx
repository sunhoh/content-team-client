'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ContentTask } from '@/types';

interface TaskContextValue {
  tasks: ContentTask[];
  addTask: (task: ContentTask) => void;
  updateTask: (id: string, patch: Partial<ContentTask>) => void;
  deleteTask: (id: string) => void;
  selectedTask: ContentTask | null;
  setSelectedTask: (task: ContentTask | null) => void;
}

const TaskContext = createContext<TaskContextValue | null>(null);

const STORAGE_KEY = 'content_team_tasks';

function loadTasks(): ContentTask[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const tasks: ContentTask[] = JSON.parse(raw);
    return tasks.map((t) =>
      t.status === 'processing' ? { ...t, status: 'failed', stage: '연결 끊김' } : t
    );
  } catch {
    return [];
  }
}

function saveTasks(tasks: ContentTask[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<ContentTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<ContentTask | null>(null);

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  const addTask = useCallback((task: ContentTask) => {
    setTasks((prev) => {
      const next = [task, ...prev];
      saveTasks(next);
      return next;
    });
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<ContentTask>) => {
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
