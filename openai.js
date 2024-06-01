
// Load environment variables
import { config } from 'dotenv';
config();

// Import necessary modules
import OpenAI from 'openai';

// Initialize OpenAI instance with API key
console.log('process.env.OPENAI_API_KEY',process.env.OPENAI_API_KEY)
const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Function to interact with OpenAI's GPT-3 model
export async function createChatCompletion(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' }, 
        { role: 'user', content: prompt }
      ]
    });

    return completion.data;
  } catch (error) {
    throw new Error('Error completing prompt with OpenAI:', error);
  }
}
