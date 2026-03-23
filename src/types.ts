/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'in-progress' | 'completed';

export type Semester = 'sem1' | 'sem2';

export interface Module {
  id: string;
  code: string;
  name: string;
  credits: number;
  color: string;
  semester?: Semester;
  description?: string;
  icon?: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Deadline {
  id: string;
  moduleId: string;
  title: string;
  dueDate: string;
  reminderDate?: string;
  type: 'assignment' | 'exam' | 'quiz';
  status: Status;
  priority: Priority;
  description?: string;
  tasks?: SubTask[];
}

export interface Note {
  id: string;
  moduleId?: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface InboxItem {
  id: string;
  text: string;
  createdAt: string;
  processed: boolean;
}

export interface SASState {
  modules: Module[];
  deadlines: Deadline[];
  notes: Note[];
  inbox: InboxItem[];
}
