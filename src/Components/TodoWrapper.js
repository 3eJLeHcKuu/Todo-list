import React, { useState, useEffect } from 'react';
import { TodoForm } from './TodoForm';
import { v4 as uuidv4 } from 'uuid';
import { Todo } from './Todo';
import { EditTodoForm } from './EditTodoForm';
import { saveAs } from 'file-saver';
uuidv4();

const exportTodosToFile = (todos) => {
    if (todos.length === 0) {
        alert('Make a choice');
        return;
    }
    const json = JSON.stringify(todos, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, 'New list.json');
};

export const TodoWrapper = () => {
    const [todos, setTodos] = useState(() => {
        const savedTodos = localStorage.getItem('todos');
        return savedTodos ? JSON.parse(savedTodos) : [];
    });

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = (todo) => {
        setTodos([...todos, { id: uuidv4(), task: todo, completed: false, isEditing: false }]);
    };

    const toggleComplete = (id) => {
        setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    const editTodo = (id) => {
        setTodos(todos.map((todo) => (todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo)));
    };

    const editTask = (task, id) => {
        setTodos(todos.map((todo) => (todo.id === id ? { ...todo, task, isEditing: !todo.isEditing } : todo)));
    };

    return (
        <div className='TodoWrapper'>
            <h1>Time to shop</h1>
            <TodoForm addTodo={addTodo} />
            {todos.map((todo) =>
                todo.isEditing ? (
                    <EditTodoForm editTodo={editTask} task={todo} key={todo.id} />
                ) : (
                    <Todo
                        task={todo}
                        key={todo.id}
                        toggleComplete={toggleComplete}
                        deleteTodo={deleteTodo}
                        editTodo={editTodo}
                    />
                )
            )}
            <button className='export-button' onClick={() => exportTodosToFile(todos)}>Download List</button> {/* Передача todos в функцию */}
        </div>
    );
};
