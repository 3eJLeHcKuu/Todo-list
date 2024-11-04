import React, { useState, useEffect} from 'react';
import { TodoForm } from './TodoForm';
import { v4 as uuidv4 } from 'uuid';
import { Todo } from './Todo';
import { EditTodoForm } from './EditTodoForm';
import { Notification } from './Notification';
import { saveAs } from 'file-saver';

const stringToWin1251 = (str) =>
    new Uint8Array([...str].map(char => {
        const code = char.charCodeAt(0);
        return code < 128 ? code : code >= 1040 && code <= 1103 ? code - 848 : 0x3F;
    }));

const exportTodosToFile = (todos, notify, isEditing) => {
    if (!todos.length) return notify('Not ready to download', 'error');
    if (isEditing) return notify('Cannot download while editing tasks', 'error');
    const content = todos.map(({ task, completed }) =>
        `${task} - ${completed ? 'Purchased' : 'Not purchased'}`).join('\n');
    const blob = new Blob([stringToWin1251(content)], { type: 'text/plain; charset=windows-1251' });
    saveAs(blob, 'Purchase_list.txt');
};

export const TodoWrapper = () => {
    const [todos, setTodos] = useState(() => JSON.parse(localStorage.getItem('todos')) || []);
    const [notification, setNotification] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => localStorage.setItem('todos', JSON.stringify(todos)), [todos]);

    const notify = (message, type = "error") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const addTodo = task => setTodos(prev => [...prev, { id: uuidv4(), task, completed: false, isEditing: false }]);

    const toggleComplete = id => setTodos(prev => prev.map(
        todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));

    const deleteTodo = id => setTodos(prev => prev.filter(todo => todo.id !== id));

    const toggleEditTodo = id => {
        setIsEditing(true);
        setTodos(prev => prev.map(
            todo => todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
        ));
    };

    const editTask = (task, id) => {
        setTodos(prev => prev.map(
            todo => todo.id === id ? { ...todo, task, isEditing: false } : todo
        ));
        setIsEditing(false);
    };

    return (
        <div className='TodoWrapper'>
            <h1>Time to shop</h1>
            <TodoForm addTodo={addTodo} todos={todos} showNotification={notify} />
            {todos.map(todo =>
                todo.isEditing ? (
                    <EditTodoForm key={todo.id} editTodo={editTask} task={todo} todos={todos} showNotification={notify} />
                ) : (
                    <Todo key={todo.id} task={todo} toggleComplete={toggleComplete} deleteTodo={deleteTodo} editTodo={toggleEditTodo} />
                )
            )}
            <button className='export-button' onClick={() => exportTodosToFile(todos, notify, isEditing)}>
                Download List
            </button>
            {notification && (
                <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
            )}
        </div>
    );
};
