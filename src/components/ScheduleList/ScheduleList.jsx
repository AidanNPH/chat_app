import React from 'react'
import './ScheduleList.css'

export default function ScheduleList({ schedule }) {
    return (
        <div className='listContainer'>
            <h2>Suggested Schedule</h2>
            {Object.entries(schedule).map(([key, value]) => (
                <div className='oneDayList'>
                    <span className='date'>{key}</span>
                    <ul>
                    {value.map((task) => (<li>{task}</li>))}
                    </ul>
                </div>
            ))}
        </div>
    )
}