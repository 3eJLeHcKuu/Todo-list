import React, { useState } from 'react'

export const TodoForm = ({ addTodo }) => {
  const [value, setValue] = useState('')

  const handleSubmit = e => {
    e.preventDefault();

    if (value.trim().length > 2) {
      addTodo(value)
      setValue('')
    } else {
      alert('Undefined value!!!');
    }
  };
  return (
    <form className='TodoForm' onSubmit={handleSubmit} >
      <input
        type="text" className='todo-input'
        value={value}
        placeholder='What do you want to buy ?'
        onChange={(e) => setValue(e.target.value)}
      />
      <button type='submit' className='todo-btn'>
        Make choice
      </button>
    </form>
  )
}
