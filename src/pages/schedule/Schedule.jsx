import React, { useState } from 'react'
import { Configuration, OpenAIApi } from 'openai';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './Schedule.css'
import TodoList from "../../components/TodoList/TodoList";
import ScheduleList from '../../components/ScheduleList/ScheduleList';

export default function Schedule({ apiKey }) {
    const config = new Configuration({ apiKey: apiKey, })
    const openai = new OpenAIApi(config)

    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [todo, setTodo] = useState([])
    const [schedule, setSchedule] = useState({})
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

    function parseFirstPrompt() {
        let scheduleRequest = `You are now an assistant who helps a student plan a work schedule for the period between ${startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} and ${endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}. Here is the list of tasks:\n\n`

        todo.forEach(item => {
            scheduleRequest += `- ${item['task']} (Deadline: ${item['DDL']}, Workload: ${item['workload']})\n`
        })
        scheduleRequest += `\nPlease design a schedule for my preparation work so that I will work on a portion of each task every day. Each task should be completed on or before the deadline, and I will not need to work on it after the deadline. If the workload is lighter, the preparation time is shorter. Return the schedule in a JSON format. For example, {"1/4": ["Task A (Day 1)", "Task B (Day 1)"], ...}. After giving me the schedule, I will reply with a description of special situations or my working style. Please adjust the previous schedule and give me an updated schedule.`

        return scheduleRequest
    }

    function updateSchedule(result) {
        const scheduleJson = '{' + result.split('{').pop().split('}')[0] + '}'
        setSchedule(JSON.parse(scheduleJson))
        console.log('Schedule Updated')
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
        const newChatHistory = [{
            role: "user",
            content: parseFirstPrompt()
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