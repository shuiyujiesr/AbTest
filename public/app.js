const image1 = document.getElementById('image1');
const image2 = document.getElementById('image2');
const imageName1 = document.getElementById('imageName1');
const imageName2 = document.getElementById('imageName2');
const finalImage = document.getElementById('finalImage');
const conclusionMessage = document.getElementById('conclusionMessage');

let images = [];
let currentIndex = 0;
let selectedImage = null;

// Fetch the list of image files from the server
axios.get('/images')
  .then(response => {
    images = response.data;
    displayImages();
  })
  .catch(error => {
    console.error('Error fetching images:', error);
  });

// Display two images side by side
function displayImages() {
  if (currentIndex >= images.length - 1) {
    showConclusion();
    return;
  }

  image1.src = `/public/images/${images[currentIndex]}`;
  image1.alt = images[currentIndex];
  imageName1.textContent = images[currentIndex];

  image2.src = `/public/images/${images[currentIndex + 1]}`;
  image2.alt = images[currentIndex + 1];
  imageName2.textContent = images[currentIndex + 1];
}

// Handle image selection
function selectImage(image) {
  selectedImage = image;
  currentIndex++;
  displayImages();
}

// Show the conclusion page
function showConclusion() {
  image1.style.display = 'none';
  image2.style.display = 'none';
  imageName1.style.display = 'none';
  imageName2.style.display = 'none';

  finalImage.src = selectedImage.src;
  finalImage.alt = selectedImage.alt;
  conclusionMessage.textContent = 'Testing completed. The final selected image is shown above.';
}

// Add event listeners to the images
image1.addEventListener('click', () => selectImage(image1));
image2.addEventListener('click', () => selectImage(image2));