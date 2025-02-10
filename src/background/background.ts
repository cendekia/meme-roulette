import { ImgurResponse } from '../types/imgur';

const IMGUR_API_URL = 'https://api.imgur.com/post/v1/posts';
const CLIENT_ID = '546c25a59c58ad7';

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);

  if (request.action === 'getRandomImage') {
    console.log('Fetching random image...');
    fetchRandomImage()
      .then(response => {
        console.log('Fetch successful:', response);
        sendResponse({ success: true, data: response });
      })
      .catch(error => {
        console.error('Fetch failed:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Required for async response
  }
});

async function fetchRandomImage(): Promise<ImgurResponse> {
  try {
    const params = new URLSearchParams({
      'client_id': CLIENT_ID,
      'filter[section]': 'eq:random',
      'include': 'adtiles,adconfig,cover,tags',
      'page': '1',
      'sort': 'random'
    });

    const response = await fetch(`${IMGUR_API_URL}?${params}`, {
      headers: {
        'Authorization': `Client-ID ${CLIENT_ID}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.length) {
      throw new Error('No images found');
    }

    // Return a random item from the response
    return data[Math.floor(Math.random() * data.length)];
  } catch (error) {
    console.error('Error fetching random image:', error);
    throw error;
  }
} 