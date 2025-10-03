'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        // Convert string dates back to Date objects
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

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date(),
    };
    
    setTodos([...todos, todo]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Todo List</h1>
        
        {/* Add Todo Form */}
        <form onSubmit={addTodo} className="mb-6 flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add
          </button>
        </form>

        {/* Todo List */}
        <div className="space-y-3 mb-6">
          {todos.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No todos yet. Add one above!</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {todos.map((todo) => (
                <li key={todo.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`h-6 w-6 rounded-full flex items-center justify-center border-2 ${
                        todo.completed 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {todo.completed && <CheckIcon className="h-4 w-4 text-white" />}
                    </button>
                    <span 
                      className={`text-lg ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}
                    >
                      {todo.text}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                    aria-label="Delete todo"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Todo Stats and Actions */}
        {todos.length > 0 && (
          <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-4">
            <span>
              {todos.filter(todo => !todo.completed).length} items left
            </span>
            <button
              onClick={clearCompleted}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear completed
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
