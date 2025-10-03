'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, TrashIcon, CheckIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

type Priority = 'low' | 'medium' | 'high';

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
};

type FilterType = 'all' | 'active' | 'completed';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply theme class to html element
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.remove('light');
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        const todosWithDates = parsedTodos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        }));
        setTodos(todosWithDates);
      } catch (error) {
        console.error('Failed to parse todos', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, isLoading]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: uuidv4(),
      text: inputValue,
      completed: false,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
    setInputValue('');
    setPriority('medium');
    setDueDate('');
  };

  const startEditing = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, text: editText, updatedAt: new Date() } 
        : todo
    ));
    setEditingId(null);
  };

  const togglePriority = (id: string) => {
    const priorityOrder: Priority[] = ['low', 'medium', 'high'];
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { 
            ...todo, 
            priority: priorityOrder[
              (priorityOrder.indexOf(todo.priority) + 1) % priorityOrder.length
            ] as Priority,
            updatedAt: new Date()
          } 
        : todo
    ));
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'border-red-500';
      case 'medium': return 'border-yellow-500';
      case 'low': return 'border-green-500';
      default: return 'border-gray-300';
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id 
          ? { ...todo, completed: !todo.completed, updatedAt: new Date() } 
          : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const activeTodosCount = todos.filter((todo) => !todo.completed).length;
  const completedTodosCount = todos.length - activeTodosCount;
  
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      {/* Background blur elements */}
      <div className="fixed inset-0 -z-10">
        <div className="bg-blur-1"></div>
      </div>

      {/* Main content */}
      <div className="container-wrapper">
        <div className="content-wrapper">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-8"
          >
            <header className="mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold">Todo List</h1>
                  <p className="text-sm text-white text-opacity-80">
                    {activeTodosCount} {activeTodosCount === 1 ? 'task' : 'tasks'} to complete
                  </p>
                </div>
                <motion.button
                  onClick={() => setDarkMode(!darkMode)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-6 rounded-full bg-white bg-opacity-30 hover:bg-opacity-40 transition-all shadow-2xl"
                  style={{
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {darkMode ? (
                    <SunIcon style={{ width: '48px', height: '48px' }} className="text-yellow-300" />
                  ) : (
                    <MoonIcon style={{ width: '48px', height: '48px' }} className="text-blue-100" />
                  )}
                </motion.button>
              </div>
            </header>

            <motion.form
              onSubmit={addTodo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="What needs to be done?"
                    className="input-glass flex-1"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="btn-primary whitespace-nowrap"
                    disabled={!inputValue.trim()}
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Add Task</span>
                  </motion.button>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="input-glass text-sm flex-1 max-w-[120px]"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="input-glass text-sm flex-1 max-w-[160px]"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </motion.form>

            <motion.div
              className="glass overflow-hidden animate-fade-in"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="divide-y divide-white divide-opacity-10">
                <AnimatePresence>
                  {filteredTodos.length > 0 ? (
                    filteredTodos.map((todo, index) => (
                      <motion.div
                        key={todo.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        className={`task-item glass-light p-4 flex items-start group border-l-4 ${getPriorityColor(todo.priority)}`}
                      >
                        <div className="flex items-start w-full">
                          <div className="flex items-start flex-1 min-w-0">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => toggleTodo(todo.id)}
                              className={`checkbox-custom mt-1 mr-3 ${todo.completed ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                              aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                            >
                              {todo.completed && <CheckIcon className="h-3 w-3 text-white" />}
                            </motion.button>
                            
                            <div className="flex-1 min-w-0">
                              {editingId === todo.id ? (
                                <input
                                  type="text"
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  onBlur={() => saveEdit(todo.id)}
                                  onKeyDown={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                                  className="bg-transparent border-b border-white border-opacity-30 w-full focus:outline-none focus:border-opacity-70 pb-1"
                                  autoFocus
                                />
                              ) : (
                                <span
                                  className={`block ${todo.completed ? 'opacity-60 line-through' : 'opacity-90'} cursor-pointer`}
                                  onDoubleClick={() => startEditing(todo.id, todo.text)}
                                >
                                  {todo.text}
                                </span>
                              )}
                              <div className="flex flex-wrap gap-2 mt-1 text-xs text-white text-opacity-60">
                                <span className="inline-flex items-center">
                                  {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                                </span>
                                {todo.dueDate && (
                                  <span className="inline-flex items-center">
                                    Due: {format(new Date(todo.dueDate), 'MMM d, yyyy')}
                                  </span>
                                )}
                                <span className="text-xs text-white text-opacity-40">
                                  Updated: {format(new Date(todo.updatedAt), 'MMM d, h:mm a')}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 ml-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => togglePriority(todo.id)}
                              className="p-1 text-white text-opacity-50 hover:text-opacity-100 transition-colors"
                              aria-label="Change priority"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                              </svg>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => deleteTodo(todo.id)}
                              className="p-1 text-white text-opacity-50 hover:text-opacity-100 hover:text-red-300 transition-colors"
                              aria-label="Delete task"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      className="p-8 text-center text-white text-opacity-60"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {filter === 'all'
                        ? 'No tasks yet. Add your first task above! '
                        : `No ${filter} tasks.`}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="filter-controls">
                <div className="text-sm">
                  {activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'} left
                </div>

                <div className="filter-tabs">
                  {(['all', 'active', 'completed'] as FilterType[]).map((filterType) => (
                    <button
                      key={filterType}
                      onClick={() => setFilter(filterType)}
                      className={filter === filterType ? 'active' : ''}
                    >
                      {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                    </button>
                  ))}
                </div>

                {completedTodosCount > 0 && (
                  <button
                    onClick={clearCompleted}
                    className="text-sm hover:text-red-300 transition-colors"
                  >
                    Clear completed ({completedTodosCount})
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
