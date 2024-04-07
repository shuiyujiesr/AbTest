// Array to store the fetched image file names
const images = [];

// Index of the currently selected image
let selectedImageIndex = 0;

// Variable to store the position of the selected image
let selectedImagePosition = '';

// Directly store the path of the last selected image
let selectedImagePath = '';

// Function to fetch the list of image files from the server
async function fetchImages() {
  try {
    const response = await fetch('/images');
    const data = await response.json();
    images.push(...data);
    displayImages();
    updateCountdown(); // Initialize countdown after images are fetched
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

// Function to display the images for comparison
function displayImages() {
  const image1 = document.getElementById('image1');
  const image2 = document.getElementById('image2');
  const image1Name = document.getElementById('image1-name');
  const image2Name = document.getElementById('image2-name');

  if (selectedImageIndex >= images.length - 1) {
    showConclusion();
    return;
  }

  if (selectedImagePosition === '') {
    image1.src = `./public/images/${images[selectedImageIndex]}`;
    image1Name.textContent = getImageName(images[selectedImageIndex]);
    image2.src = `./public/images/${images[selectedImageIndex + 1]}`;
    image2Name.textContent = getImageName(images[selectedImageIndex + 1]);
  } else if (selectedImagePosition === 'left') {
    image2.src = `./public/images/${images[selectedImageIndex + 1]}`;
    image2Name.textContent = getImageName(images[selectedImageIndex + 1]);
    selectedImagePath = image1.src; // Update the path of the selected image
  } else if (selectedImagePosition === 'right') {
    image1.src = `./public/images/${images[selectedImageIndex + 1]}`;
    image1Name.textContent = getImageName(images[selectedImageIndex + 1]);
    selectedImagePath = image2.src; // Update the path of the selected image
  }

  image1.onclick = () => {
    selectedImagePosition = 'left';
    selectedImageIndex++;
    selectedImagePath = image1.src; // Update the path of the last selected image
    displayImages();
    updateCountdown();
  };

  image2.onclick = () => {
    selectedImagePosition = 'right';
    selectedImageIndex++;
    selectedImagePath = image2.src; // Update the path of the last selected image
    displayImages();
    updateCountdown();
  };
}

// Function to update the countdown of images left
function updateCountdown() {
  // Calculate the remaining images
  const imagesLeft = images.length - selectedImageIndex - 1;
  document.getElementById('countdown').textContent = `Images left: ${imagesLeft}`;
}

// Function to send the test result to the server
async function sendTestResult(userName, selectedImagePath) {
  try {
    const response = await fetch('/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userName, selectedImagePath }),
    });

    if (response.ok) {
      console.log('Test result stored successfully');
    } else {
      console.error('Error storing test result:', response.statusText);
    }
  } catch (error) {
    console.error('Error storing test result:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('fullscreen-overlay');
  const images = document.querySelectorAll('.image-wrapper img'); // Select all images

  images.forEach(img => {
    img.addEventListener('mouseenter', () => overlay.style.display = 'block'); // Show overlay on hover
    img.addEventListener('mouseleave', () => overlay.style.display = 'none'); // Hide overlay when not hovering
  });
});


// Function to show the conclusion
function showConclusion() {
  document.getElementById('image-container').style.display = 'none';
  document.getElementById('conclusion-container').style.display = 'block';
  document.getElementById('title').style.display = 'none';
  document.getElementById('countdown').style.display = 'none';

  // Get the user's name from the input field
  const nameInput = document.getElementById('name-input');
  const userName = nameInput.value.trim();

  // Send the test result to the server
  sendTestResult(userName, selectedImagePath);

  // Add event listener to the home button
  document.getElementById('home-button').addEventListener('click', returnToHome);
}

// Function to return to the home screen
function returnToHome() {
    // Refresh the page
    location.reload();
  }

// Function to extract the image name from the file path
function getImageName(imagePath) {
  return imagePath.split('/').pop();
}

// Function to start the A/B test
function startTest() {
  const nameInput = document.getElementById('name-input');
  const userName = nameInput.value.trim();

  if (userName !== '') {
    document.getElementById('name-input-container').style.display = 'none';
    document.getElementById('test-container').style.display = 'block';
    fetchImages();
  }
}

// Add event listener to the start button
document.getElementById('start-button').addEventListener('click', startTest);