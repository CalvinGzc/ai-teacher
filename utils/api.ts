const API_KEY = 'sk-7ce2b6f67a534c588ace2eb8709c51db';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendChatMessage(messages: Message[]) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling AI API:', error);
    throw error;
  }
} 