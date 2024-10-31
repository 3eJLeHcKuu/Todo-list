import React, { useState, useEffect } from 'react';
import { TodoForm } from './TodoForm';
import { v4 as uuidv4 } from 'uuid';
import { Todo } from './Todo';
import { EditTodoForm } from './EditTodoForm';
import { Notification } from './Notification';
import { saveAs } from 'file-saver';

const stringToWin1251 = (str) => {
    return new Uint8Array([...str].map((char) => {
        const charCode = char.charCodeAt(0);
        if (charCode < 128) return charCode;
        if (charCode >= 1040 && charCode <= 1103) return charCode - 848;
        return 0x3F; // Replacement character
    }));
};

const exportTodosToFile = (todos, showNotification, isEditing) => {
    if (todos.length === 0) return showNotification('Not ready to download!', 'error');
    if (isEditing) return showNotification('Cannot download while editing tasks!', 'error');

    const txt = todos.map(todo => `${todo.task} - ${todo.completed ? 'Purchased' : 'Not purchased'}`).join('\n');
    const blob = new Blob([stringToWin1251(txt)], { type: 'text/plain; charset=windows-1251' });
    saveAs(blob, 'Purchase_list.txt');
};

export const TodoWrapper = () => {
    const [todos, setTodos] = useState(() => {
        const savedTodos = localStorage.getItem('todos');
        return savedTodos ? JSON.parse(savedTodos) : [];
    });
    const [notification, setNotification] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const showNotification = (message, type = "error") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const addTodo = (task) => {
        setTodos((prevTodos) => [...prevTodos, { id: uuidv4(), task, completed: false, isEditing: false }]);
    };

    const toggleComplete = (id) => {
        setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
    };

    const deleteTodo = (id) => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    };

    const editTodo = (id) => {
        setIsEditing(true);
        setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo)));
    };

    const editTask = (task, id) => {
        setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? { ...todo, task, isEditing: false } : todo)));
        setIsEditing(false);
    };

    return (
        <div className='TodoWrapper'>
            <h1>Time to shop</h1>
            <TodoForm addTodo={addTodo} todos={todos} showNotification={showNotification} />
            {todos.map((todo) => (
                todo.isEditing ? (
                    <EditTodoForm key={todo.id} editTodo={editTask} task={todo} todos={todos} showNotification={showNotification} />
                ) : (
                    <Todo key={todo.id} task={todo} toggleComplete={toggleComplete} deleteTodo={deleteTodo} editTodo={editTodo} />
                )
            ))}
            <button className='export-button' onClick={() => exportTodosToFile(todos, showNotification, isEditing)}>
                Download List
            </button>
            {notification && (
                <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
            )}
        </div>
    );
};
