import React, { useState } from 'react';

export const TodoForm = ({ addTodo, todos, showNotification }) => {
    const [value, setValue] = useState('');

    const handleSubmit = e => {
        e.preventDefault();

        const trimmedValue = value.trim();
        const lowerCaseValue = trimmedValue.toLowerCase();

        const checks = [
            {
                test: trimmedValue.length > 2,
                message: 'Please enter at least 3 characters.',
            },
            {
                test: !/[^a-zA-Zа-яА-ЯёЁ\s]/.test(trimmedValue),
                message: 'Only letters (Latin and Cyrillic)',
            },
            {
                test: !/^(.)\1{2,}$/.test(lowerCaseValue),
                message: 'The task cannot consist of repeated letters',
            },
            {
                test: !todos.some(todo => todo.task.toLowerCase() === lowerCaseValue),
                message: 'This task already exists in your list',
            }
        ];

        for (const { test, message } of checks) {
            if (!test) {
                showNotification(message);
                return;
            }
        }
        addTodo(trimmedValue);
        setValue('');
    };

    return (
        <form className='TodoForm' onSubmit={handleSubmit}>
            <input
                type="text"
                className='todo-input'
                value={value}
                placeholder='What do you want to buy?'
                onChange={(e) => setValue(e.target.value)}
            />
            <button type='submit' className='todo-btn'>
                Make choice
            </button>
        </form>
    );
};
