import React, { useState } from 'react'
import { Configuration, OpenAIApi } from 'openai';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './Schedule.css'
import TodoList from "../../components/TodoList/TodoList";
import ScheduleList from '../../components/ScheduleList/ScheduleList';

function parseFirstPrompt(prompt) {
    // TODO
    return `You are now responsible for improving text-to-image generation prompts. I will give you the prompt at the end of this message. Please help improve the prompt by telling me what more detailed attributes of the image you need and suggesting one content for each of these attributes. Try to make these attributes are not related. For replying to me for the first time, return two JSONs but no other words. The first JSON should contain the attributes and corresponding suggested content. For example, { "scene": "mountain", "weather": "sunny", ... }. The second JSON should contain the complete prompt updated with your suggested content. That is { "prompt": <new_prompt> }. Afterward, if I reply to you stating a JSON with updated content, update the prompt with the content in my JSON and return it to me. Here is the prompt: ${prompt}`
}

export default function Schedule({ apiKey }) {
    const config = new Configuration({ apiKey: apiKey, })
    const openai = new OpenAIApi(config)

    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [todo, setTodo] = useState([])
    const [schedule, setSchedule] = useState({
        "10/4": ["FYP final report (Day 1)", "LANG presentation (Day 1)", "LANG essay (Day 1)", "MATH homework (Day 1)"],
        "11/4": ["FYP final report (Day 2)", "LANG presentation (Day 2)", "LANG essay (Day 2)", "MATH homework (Day 2)"],
        "12/4": ["FYP final report (Day 3)", "LANG presentation (Day 3)", "LANG essay (Day 3)", "MATH homework (Day 3)"],
        "13/4": ["FYP final report (Day 4)", "LANG presentation (Day 4)", "LANG essay (Day 4)", "MATH homework (Day 4)"],
        "14/4": ["FYP final report (Day 5)", "LANG presentation (Day 5)", "LANG essay (Day 5)", "MATH homework (Day 5)"],
        "15/4": ["FYP final report (Day 6)", "LANG essay (Day 6)", "MATH homework (Day 6)"],
        "16/4": ["FYP final report (Day 7)", "LANG essay (Day 7)", "MATH homework (Day 7)"],
        "17/4": ["FYP final report (Day 8)", "LANG essay (Day 8)", "MATH homework (Day 8)"],
        "18/4": ["FYP final report (Day 9)", "LANG essay (Day 9)", "MATH homework (Day 9)"],
        "19/4": ["FYP final report (Day 10)", "LANG essay (Day 10)", "MATH homework (Day 10)"],
        "20/4": ["FYP final report (Deadline)"],
        "21/4": ["FYP presentation (Day 1)", "LANG essay (Day 11)", "MATH homework (Day 11)"],
        "22/4": ["FYP presentation (Day 2)", "LANG essay (Day 12)", "MATH homework (Day 12)"],
        "23/4": ["FYP presentation (Day 3)", "LANG essay (Day 13)", "MATH homework (Day 13)"],
        "24/4": ["FYP presentation (Day 4)", "LANG essay (Day 14)", "MATH homework (Day 14)"],
        "25/4": ["FYP presentation (Day 5)", "LANG essay (Day 15)", "MATH homework (Day 15)"],
        "26/4": ["LANG presentation (Deadline)"],
        "27/4": ["FYPpresentation (Day 6)", "LANG essay (Day 16)", "MATH homework (Day 16)"],
        "28/4": ["FYP presentation (Day 7)", "MATH homework (Deadline)"],
        "29/4": ["FYP presentation (Deadline)"],
        "30/4": ["LANG essay (Deadline)"],
    })
    const [request, setRequest] = useState('')
    const [chatHistory, setChatHistory] = useState([])

    function createNewTask(task, DDL, workload) {
        setTodo([...todo, {
            'task': task,
            'DDL': DDL,
            'workload': workload
        }])
    }

    function deleteItem(event) {
        const task = event.currentTarget.getAttribute('data-value')
        setTodo(todo.filter((item) => item.task !== task))
    }

    function updateSchedule(response) {
        // TODO: process response
        setSchedule(response)
    }

    function handleChangeStartDate(date) {
        setStartDate(date)
    }

    function handleChangeEndDate(date) {
        setEndDate(date)
    }

    function handleChangeRequest(event) {
        setRequest(event.target.value)
    }

    async function handleGenerateSchedule(event) {
        const prompt = parseFirstPrompt(inputPrompt)

        const newChatHistory = [{
            role: "user",
            content: prompt
        }]

        const result = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: newChatHistory,
            temperature: 0,
            max_tokens: 1000,
        });

        const response = result.data.choices[0].message.content;
        setChatHistory([...newChatHistory, {
            role: "assistant",
            content: response
        }])

        updateSchedule(response)
    }

    async function handleUpdateSchedule(event) {
        const prompt = request

        const newChatHistory = [...chatHistory, {
            role: "user",
            content: prompt
        }]

        const result = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: newChatHistory,
            temperature: 0,
            max_tokens: 1000,
        });

        const response = result.data.choices[0].message.content;
        setChatHistory([...newChatHistory, {
            role: "assistant",
            content: response
        }])

        updateSchedule(response)
    }

    return (
        <div className='schedulePage'>
            <div className='todo'>
                <div className='tasks'>
                    <h2>Please input your to-do tasks</h2>
                    <div className='period'>
                        <h3>Specify the period</h3>
                        <div className='periodPicker'>
                            Start: 
                            <DatePicker
                                className='startPicker'
                                selected={startDate}
                                onChange={handleChangeStartDate}
                            />
                            End:
                            <DatePicker
                                className='endPicker'
                                selected={endDate}
                                onChange={handleChangeEndDate}
                            />
                        </div>
                    </div>
                    <TodoList
                        todo={todo}
                        createNewTask={createNewTask}
                        deleteItem={deleteItem}
                    />
                    <button
                        className='button'
                        onClick={handleGenerateSchedule}
                    >Generate Schedule</button>
                </div>
                <div className='request'>
                    <label>Tell the chatbot about any personal working style or situation</label>
                    <input
                        type='text'
                        onChange={handleChangeRequest}
                    />
                    <button 
                        className='button'
                        onClick={handleUpdateSchedule}
                    >Update Schedule</button>
                </div>
            </div>
            <div className='schedule'>
                <ScheduleList schedule={schedule} />
            </div>
        </div>
    )
}