import React, { useState, useEffect } from 'react';

export default function List() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [task, setTask] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!task.trim()) {
      setError('Task cannot be empty');
      return;
    }

    if (tasks.includes(task.trim())) {
      setError('Task already exists');
      return;
    }

    setTasks([...tasks, task.trim()]);
    setTask('');
    setError('');
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const startEditing = (index) => {
    setIsEditing(index);
    setEditText(tasks[index]);
  };

  const saveEdit = (index) => {
    if (!editText.trim()) {
      setError('Edited task cannot be empty');
      return;
    }

    if (tasks.includes(editText.trim()) && tasks[index] !== editText.trim()) {
      setError('Task already exists');
      return;
    }

    const updatedTasks = tasks.map((t, i) => (i === index ? editText.trim() : t));
    setTasks(updatedTasks);
    setIsEditing(null);
    setEditText('');
    setError('');
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setEditText('');
    setError('');
  };

  return (
    <div className='h-screen flex justify-center items-center bg-gray-100'>
      <div className="bg-slate-600 w-[40rem] p-10 flex flex-col gap-3 rounded shadow-lg">
        <div className="flex gap-3">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter a task"
            aria-label="Task input"
            className='w-full outline-none px-3 py-2 rounded'
          />
          <button
            onClick={addTask}
            className='border-0 bg-blue-600 text-white px-10 py-2 rounded hover:bg-blue-400'>
            Add
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <ul className="list-none mt-5 space-y-2">
          {tasks.length > 0 ? (
            tasks.map((t, index) => (
              <li
                key={index}
                className="flex justify-between bg-gray-700 text-white p-2 rounded"
              >
                {isEditing === index ? (
                  <>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-grow bg-gray-700 outline-none px-2 py-1 rounded"
                    />
                    <button
                      onClick={() => saveEdit(index)}
                      className="text-green-500 hover:underline ml-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-yellow-500 hover:underline ml-2"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span>{t}</span>
                    <div>
                      <button
                        onClick={() => startEditing(index)}
                        className="text-blue-400 hover:underline mr-2"
                        aria-label={`Edit task: ${t}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTask(index)}
                        className="text-red-500 hover:underline"
                        aria-label={`Delete task: ${t}`}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))
          ) : (
            <li className="text-white text-center">No tasks added yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}