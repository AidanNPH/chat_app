import React, { useState } from 'react'
import './TodoList.css'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function TodoList({ todo, createNewTask, deleteItem }) {
    const [newTask, setNewTask] = useState('')
    const [newDDL, setNewDDL] = useState(new Date())
    const [newWorkload, setNewWorkload] = useState('Light')

    function handleChangeTask(event) {
        setNewTask(event.target.value)
    }

    function handleChangeDDL(date) {
        setNewDDL(date)
    }

    function handleChangeNewWorkload(event) {
        setNewWorkload(event.target.value)
    }

    function handleCreateNewTask(event) {
        if (!newTask || !newDDL || !newWorkload) {
            alert('Cannot Create Task! (Task name, deadline, or workload not specified.)')
        } else {
            const options = { year: 'numeric', month: 'long', day: 'numeric' }
            createNewTask(newTask, newDDL.toLocaleDateString('en-US', options), newWorkload)
            setNewTask('')
            setNewDDL(new Date())
            setNewWorkload('Light')
        }
    }

    return (
        <div className='tableContainer'>
            <div className='newTaskForm'>
                <h3>Add your task</h3>
                <div className='taskInfo'>
                    <input
                        className='cell'
                        type='text'
                        value={newTask}
                        onChange={handleChangeTask}
                    />
                    <DatePicker
                        className='cell'
                        selected={newDDL}
                        onChange={handleChangeDDL}
                    />
                    <select
                        className='cell'
                        value={newWorkload}
                        onChange={handleChangeNewWorkload}
                    >
                        <option>Light</option>
                        <option>Medium</option>
                        <option>Heavy</option>
                    </select>
                </div>
                <button
                    className='newButton'
                    onClick={handleCreateNewTask}
                >Add Task</button>
            </div>
            <table>
                <tr>
                    <th className='firstColumn'>Task</th>
                    <th className='secondColumn'>Deadline</th>
                    <th className='thirdColumn'>Workload</th>
                </tr>
                {todo.map((task) => (
                    <tr>
                        <td className='firstColumn'>
                            {task['task']}
                        </td>
                        <td className='secondColumn'>
                            {task['DDL']}
                        </td>
                        <td className='thirdColumn'>
                            {task['workload']}
                        </td>
                        <td
                            className='fourthColumn'
                            data-value={task['task']}
                            onClick={deleteItem}
                        >x</td>
                    </tr>
                ))}
            </table>
        </div>
    )
}