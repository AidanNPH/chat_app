import React from 'react'
import './TodoList.css'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function TodoList({ todo, handleChangeTodo }) {
    console.log(todo)
    function deleteItem() {
        console.log('deleted')
    }

    return (
        <div className='tableContainer'>
            <table>
                <tr>
                    <th className='firstColumn'>Task</th>
                    <th className='secondColumn'>Deadline</th>
                    <th className='thirdColumn'>Workload</th>
                </tr>
                {todo.map((task) => (
                    <tr>
                        <td className='firstColumn'>
                            <input className='cell' type='text' />
                        </td>
                        <td className='secondColumn'>
                            <DatePicker className='cell' />
                        </td>
                        <td className='thirdColumn'>
                            <select className='cell'>
                                <option>Light</option>
                                <option>Medium</option>
                                <option>Heavy</option>
                            </select>
                        </td>
                        <td className='fourthColumn' onClick={deleteItem}>x</td>
                    </tr>
                ))}
            </table>
            <button className='newButton'>New Task</button>
        </div>
    )
}