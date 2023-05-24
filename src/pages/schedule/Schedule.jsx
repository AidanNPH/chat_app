import React, { useState } from 'react'
import './Schedule.css'
import TodoList from "../../components/TodoList/TodoList";
import ScheduleList from '../../components/ScheduleList/ScheduleList';

export default function Schedule({ apiKey }) {
    const [todo, setTodo] = useState(['abc', 1, 1, 1, 1, 1])
    const [schedule, setSchedule] = useState({"1 Apr": ["This", "That"], "2 Apr": ["that", "this"]})

    function handleChangeTodo() {

    }

    return (
        <div className='schedulePage'>
            <div className='todo'>
                <div className='tasks'>
                    <h2>Please input your to-do tasks</h2>
                    <TodoList  todo={todo} handleChangeTodo={handleChangeTodo} />
                    <button className='button'>Generate Schedule</button>
                </div>
                <div className='request'>
                    <label>Tell the chatbot about any personal working style or situation</label>
                    <input type='text' />
                    <button className='button'>Update Schedule</button>
                </div>
            </div>
            <div className='schedule'>
                <ScheduleList schedule={schedule} />
            </div>
        </div>
    )
}