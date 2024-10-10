// Function to create and trigger a download for an image
function downloadImage(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
  // Function to extract image URLs and download the photos
  async function fetchAndDownloadPhotos(numberOfPhotos) {
    const imageUrls = new Set(); // Use a Set to avoid duplicate URLs
    let previousImageCount = 0;
    let scrollAttempts = 0;
    const maxScrollAttempts = 5; // Stop after 5 consecutive scrolls without new photos
  
    // Scroll to the bottom of the page and load more images
    async function autoScroll() {
      window.scrollTo(0, document.body.scrollHeight); // Scroll to the bottom
      return new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds for the content to load
    }
  
    // Keep scrolling and gathering images until we've loaded enough photos or reached the end
    while (imageUrls.size < numberOfPhotos && scrollAttempts < maxScrollAttempts) {
      const images = Array.from(document.querySelectorAll('img'));
      images.forEach(img => {
        const src = img.src;
        if (src.startsWith('https://') && !src.includes('profile') && !src.includes('emoji') && !src.includes('static')) {
          imageUrls.add(src); // Add unique image URLs to the Set
        }
      });
  
      console.log(`Loaded ${imageUrls.size} images so far...`);
  
      // Check if no new photos were added in this scroll
      if (imageUrls.size === previousImageCount) {
        scrollAttempts++; // Increase scroll attempt count if no new images were found
      } else {
        scrollAttempts = 0; // Reset count if new images were found
      }
      previousImageCount = imageUrls.size;
  
      // Exit if we've gathered enough images
      if (imageUrls.size >= numberOfPhotos) break;
  
      await autoScroll(); // Scroll to load more images
    }
  
    // Download the collected photos
    const imageArray = Array.from(imageUrls).slice(0, numberOfPhotos); // Get only the requested number of photos
    for (let i = 0; i < imageArray.length; i++) {
      const url = imageArray[i];
      const filename = `photo_${i + 1}.jpg`;
      console.log(`Downloading: ${filename} from ${url}`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay to avoid rate-limiting
      downloadImage(url, filename); // Trigger download
    }
  
    console.log(`Downloaded ${imageArray.length} photos.`);
    if (scrollAttempts >= maxScrollAttempts) {
      console.log("No new photos found after several scrolls. Stopping.");
    } else {
      console.log(`Downloaded all available photos or reached the requested limit.`);
    }
  }
  
  // Start the process by asking how many photos to download
  const numberOfPhotos = parseInt(prompt("How many photos do you want to download?", "50"), 10);
  fetchAndDownloadPhotos(numberOfPhotos);
  