import React, { useState } from 'react'

export const EditTodoForm = ({ editTodo, task }) => {
  const [value, setValue] = useState(task.task)

  const handleSubmit = e => {
    e.preventDefault();

    if (value.trim().length > 2) {
      editTodo(value, task.id)
      setValue()
    } else {
      alert('Undefined value!!!');
    }
  };
  return (
    <form className='TodoForm' onSubmit={handleSubmit} >
      <input
        type="text" className='todo-input'
        value={value} placeholder='Change choice '
        onChange={(e) => setValue(e.target.value)}
      />
      <button type='submit' className='todo-btn'>
        Change choice
      </button>
    </form>
  )
}
