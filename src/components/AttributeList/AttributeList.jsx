import React from 'react'
import './AttributeList.css'

export default function AttributeList({ data, inputAttribute }) {
    return (
        <ul>
            {Object.entries(data).map(([key, value]) => (
            <li className='item'>
                <label>{key}: </label>
                <input
                    type='text'
                    id={key}
                    key={key}
                    value={value}
                    onChange={inputAttribute}
                />
            </li>
            ))}
        </ul>
    )
}