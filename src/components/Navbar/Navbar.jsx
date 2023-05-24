import React from 'react'
import './Navbar.css'

export default function Navbar({ setKey }) {
    function handleChangeKey(event) {
        setKey(event.target.value)
    }

    return (
        <nav className="nav">
            <a href="/" className="title">GenAI</a>
            <div className="apikey">
                <label>OpenAI API key:</label>
                <input type="text" onChange={handleChangeKey} />
            </div>
            <ul>
                <li>
                    <a href="/image" className="page">Image Prompt</a>
                </li>
                <li>
                    <a href="/schedule" className="page">Schedule</a>
                </li>
            </ul>
        </nav>
    )
}