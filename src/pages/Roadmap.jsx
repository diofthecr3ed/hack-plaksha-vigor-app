

import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = "AIzaSyB1EGQT8xVL0K_g9dXSyd44_oRxlSvW8-8";

const Home = () => {
  const [generatedText, setGeneratedText] = useState('');
  const [prompt, setPrompt] = useState('');

  const handleInputChange = (event) => {
    setPrompt(event.target.value);
  };

  async function generateText(prompt) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
    try {
      // Concatenate user input with additional string
      const modifiedPrompt = `${prompt} at IIT Delhi, India (don't use stars and give the answer in bullet points and don't do any formatting on the tex)`;
  
      // Use streaming for faster conversations
      const result = await model.generateContentStream([modifiedPrompt]);
  
      let text = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        text += chunkText;
      }
  
      setGeneratedText(text); // Update the generated text state
    } catch (error) {
      console.error("Error generating text:", error);
      setGeneratedText("Error generating text. Please try again.");
    }
  }

  return (
    <div className="contain">
      <h1 className="heading1">Ask me anything about this college!</h1>
      <div className="template2">
        <input
          className="input-container input-bar"
          type="text"
          value={prompt}
          onChange={handleInputChange}
          placeholder="Enter a prompt"
        />
        <button onClick={() => generateText(prompt)} className="skillbutton submitbutton">ASK</button>
      </div>
      <div className="response">
        <p className="gentext">Response:</p>
        <ul className="gentext2">
          {generatedText.split('\n').map((line, index) => (
            <li key={index}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;

