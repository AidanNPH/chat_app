import React, { useState } from 'react'
import { Configuration, OpenAIApi } from 'openai'
import './Image.css'
import AttributeList from '../../components/AttributeList/AttributeList'

function parseFirstPrompt(prompt) {
    return `You are now responsible for improving text-to-image generation prompts. I will give you the prompt at the end of this message. Please help improve the prompt by telling me what more detailed attributes of the image you need and suggesting one content for each of these attributes. Try to make these attributes are not related. For replying to me for the first time, return two JSONs but no other words. The first JSON should contain the attributes and corresponding suggested content. For example, { "scene": "mountain", "weather": "sunny", ... }. The second JSON should contain the complete prompt updated with your suggested content. That is { "prompt": <new_prompt> }. Afterward, if I reply to you stating a JSON with updated content, update the prompt with the content in my JSON and return it to me. Here is the prompt: ${prompt}`
}

export default function Image({ apiKey }) {
    const config = new Configuration({ apiKey: apiKey, })
    const openai = new OpenAIApi(config)

    const [inputPrompt, setInputPrompt] = useState('')
    const [finalPrompt, setFinalPrompt] = useState('')
    const [details, setDetails] = useState({})
    const [imageURL, setImageURL] = useState('https://upload.wikimedia.org/wikipedia/commons/1/15/Cat_August_2010-4.jpg')

    const [chatHistory, setChatHistory] = useState([]);
    const [first, setFirst] = useState('')
    const [second, setSecond] = useState('')

    function handleInputPrompt(event) { 
        setInputPrompt(event.target.value)
    }

    async function handleGetIdea(event) {
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

        const responseString = response.split('}')
        const firstJson = JSON.parse(responseString[0] + '}')
        const secondJson = JSON.parse(responseString[1] + '}')
        setDetails(firstJson)
        setFinalPrompt(secondJson['prompt'])
        setFirst(responseString[0])
        setSecond(responseString[1])
    }

    function handleInputAttribute(event) {
        const id = event.target.id;
        const value = event.target.value;
        setDetails({...details, [id]: value})
    }

    async function handleGenerateImage(event) {
        const result = await openai.createImage({
            prompt: finalPrompt,
            n: 1,
            size: '256x256',
        });
        const url = result.data.data[0].url;
        setImageURL(url);
        console.log(finalPrompt);
        console.log(url);
    }

    async function handleUpdatePrompt(event) {
        const prompt = JSON.stringify(details)

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

        const promptJson = JSON.parse(response)
        setFinalPrompt(promptJson['prompt'])
    }

    return (
        <div className='imagePage'>
            <div className='prompt'>
                <div className='mainPrompt'>
                    <label>Please input your prompt</label>
                    <div className='promptInput'>
                        <input
                            type='text'
                            id='input-prompt'
                            value={inputPrompt}
                            onChange={handleInputPrompt}
                        />
                        <button onClick={handleGetIdea}>Get Idea</button>
                    </div>
                </div>
                <div className='details'>
                    <span>Describe the scene with more details to improve the prompt</span>
                    {Object.keys(details).length > 0 &&
                        <div>
                            <AttributeList data={details} inputAttribute={handleInputAttribute} />
                        </div>
                    }
                    {Object.keys(details).length < 1 && <p>(Please input the first prompt!)</p>}
                    {Object.keys(details).length > 0 &&
                        <button onClick={handleUpdatePrompt}>Update Prompt</button>
                    }
                </div>
                <div className='generate'>
                    <h3>The improved prompt is</h3>
                    <span>{finalPrompt}</span>
                    <button onClick={handleGenerateImage}>Generate Image</button>
                </div>
            </div>
            <div className='image'>
                <h2>Result</h2>
                <img src={imageURL} />
            </div>
        </div>
    )
}