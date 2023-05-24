import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import './ScheduleList.css'

export default function ScheduleList({ schedule }) {
    return (
        <div className='listContainer'>
            <h2>Suggested Schedule</h2>
            <InfiniteScroll
                dataLength={Object.keys(schedule).length}
                style={{
                    height: '77vh'
                }}
            >
                {Object.entries(schedule).map(([key, value]) => (
                    <div className='oneDayList'>
                        <span className='date'>{key}</span>
                        <ul>
                            {value.map((task) => (
                                <li key={task}>{task}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </InfiniteScroll>
        </div>
    )
}