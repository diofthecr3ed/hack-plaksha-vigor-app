const API_KEY = "AIzaSyB1EGQT8xVL0K_g9dXSyd44_oRxlSvW8-8";
const readline = require("readline");

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to ask if the user has another question
function askAnotherQuestion() {
  rl.question("Do you have another question? (yes/no): ", function(answer) {
    if (answer.toLowerCase() === "yes") {
      getUserInput(); // If yes, ask for another prompt
    } else {
      console.log("Thank you. Good day!"); // If no, say goodbye
      rl.close();
    }
  });
}

// Function to get user input
function getUserInput() {
  rl.question("Enter a prompt: ", function(prompt) {
    generateText(prompt);
  });
}

// Function to generate text based on user prompt
async function generateText(prompt) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    // Concatenate user input with additional string
    const modifiedPrompt = `${prompt} IIT delhi`;

    const result = await model.generateContent(modifiedPrompt);
    const response = await result.response;
    const text = response.text();
    console.log("Generated Text:", text);
    askAnotherQuestion(); // After generating text, ask if the user has another question
  } catch (error) {
    console.error("Error generating text:", error);
    askAnotherQuestion(); // If error occurs, ask if the user has another question
  }
}

// Start the process by getting user input
getUserInput();