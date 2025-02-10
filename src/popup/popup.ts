import { ImgurResponse } from '../types/imgur';

document.addEventListener('DOMContentLoaded', () => {
  const imageContainer = document.getElementById('imageContainer') as HTMLDivElement;
  const refreshButton = document.getElementById('refreshButton') as HTMLButtonElement;
  const loadingSpinner = document.getElementById('loadingSpinner') as HTMLDivElement;
  const errorMessage = document.getElementById('errorMessage') as HTMLDivElement;

  async function displayRandomImage() {
    try {
      // Disable button and keyboard controls during loading
      refreshButton.disabled = true;
      loadingSpinner.style.display = 'block';
      errorMessage.style.display = 'none';
      // Note: removed imageContainer.style.display = 'none' to keep previous meme visible

      const response = await chrome.runtime.sendMessage({ action: 'getRandomImage' })
        .catch(err => {
          if (err.message.includes('Receiving end does not exist')) {
            throw new Error('Extension background script is not running. Please try reloading the extension.');
          }
          throw err;
        });

      if (!response.success) {
        throw new Error(response.error);
      }

      const imgurData: ImgurResponse = response.data;
      
      // Create title element
      const titleElement = document.createElement('h3');
      titleElement.textContent = imgurData.title;

      // Clear previous content only after new content is ready
      imageContainer.innerHTML = '';
      imageContainer.appendChild(titleElement);

      // Check if it's a video or image
      if (imgurData.cover.mime_type?.startsWith('video/')) {
        // Create video element
        const videoElement = document.createElement('video');
        videoElement.controls = false;
        videoElement.autoplay = true;
        videoElement.style.maxWidth = '100%';
        videoElement.style.height = 'auto';

        // Create source element
        const sourceElement = document.createElement('source');
        sourceElement.src = imgurData.cover.url;
        sourceElement.type = imgurData.cover.mime_type;

        videoElement.appendChild(sourceElement);
        imageContainer.appendChild(videoElement);
      } else {
        // Create image element
        const imgElement = document.createElement('img');
        imgElement.src = imgurData.cover.url;
        imgElement.alt = imgurData.title;
        imgElement.style.maxWidth = '100%';
        imgElement.style.height = 'auto';
        imageContainer.appendChild(imgElement);
      }

      loadingSpinner.style.display = 'none';
      imageContainer.style.display = 'block';
      refreshButton.disabled = false;  // Re-enable button after loading
    } catch (error) {
      console.error('Error:', error);
      loadingSpinner.style.display = 'none';
      errorMessage.style.display = 'block';
      errorMessage.textContent = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      refreshButton.disabled = false;  // Re-enable button on error
    }
  }

  refreshButton.addEventListener('click', displayRandomImage);

  // Add keyboard event listener for Enter and Space keys
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      displayRandomImage();
    }
  });

  displayRandomImage(); // Load initial image
}); 