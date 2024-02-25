const API_KEY = "AIzaSyB1EGQT8xVL0K_g9dXSyd44_oRxlSvW8-8";
const readline = require("readline");

const { GoogleGenerativeAI } = require("@google/generative-ai");

async function generateText(prompt) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    const modifiedPrompt =` ${prompt} at IIT Delhi, India (give simple text, dont use bold, italics or any other formatting on the text)`;

    // Use streaming for faster conversations
    const result = await model.generateContentStream([modifiedPrompt]);

    let text = '';
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      console.log(chunkText);
      text += chunkText;
    }

    return text; // Return the generated text
  } catch (error) {
    console.error("Error generating text:", error);
    return null; // Return null in case of an error
  }
}

// Function to get user input
function getUserInput() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("Enter a prompt: ", async function(prompt) {
    const generatedText = await generateText(prompt);
    
    if (generatedText !== null) {
      rl.question("Was the information relevant? (yes/no): ", function(answer) {
        if (answer.toLowerCase() === "yes") {
          console.log("Exiting. Goodbye!");
          rl.close();
        } else {
          getUserInput(); // Ask for a new question
        }
      });
    } else {
      getUserInput(); // Ask for a new question in case of an error
    }
  });
}

// Example usage
getUserInput();