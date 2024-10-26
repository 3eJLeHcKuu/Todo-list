import React, { useState, useEffect } from 'react';
import { TodoForm } from './TodoForm';
import { v4 as uuidv4 } from 'uuid';
import { Todo } from './Todo';
import { EditTodoForm } from './EditTodoForm';
import { saveAs } from 'file-saver';
uuidv4();

const stringToWin1251 = (str) => {
    const byteArray = [];

    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);

        if (charCode < 128) {
            // ASCII characters (0-127) are the same in both UTF-8 and Windows-1251
            byteArray.push(charCode);
        } else if (charCode >= 1040 && charCode <= 1103) {
            // Cyrillic characters (1040-1103) need conversion to Windows-1251
            byteArray.push(charCode - 848); // 1040-1103 to 192-255
        } else {
            // Handle unsupported characters with '?'
            byteArray.push(0x3F); // '?'
        }
    }

    return new Uint8Array(byteArray);
};

const exportTodosToFile = (todos) => {
    if (todos.length === 0) {
        alert('Make a choice');
        return;
    }

    // Formatting the text for the todo list
    const txt = todos.map(todo => `${todo.task} - ${todo.completed ? 'Purchased' : 'Not purchased'}`).join('\n');

    // Convert the string to a byte array in Windows-1251 encoding
    const byteArrayWin1251 = stringToWin1251(txt);

    // Create a Blob with the byte array
    const blob = new Blob([byteArrayWin1251], { type: 'text/plain; charset=windows-1251' });

    // Use saveAs to trigger the download
    saveAs(blob, 'Purchase_list.txt');
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
            <button className='export-button' onClick={() => exportTodosToFile(todos)}>Download List</button>
        </div>
    );
};
