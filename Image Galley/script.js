

let currentIndex = 0;
let visibleImages = [...images];
let activeFilter = 'all';

const galleryContainer = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

// Gallery start
function init() {
    renderGallery();
}

// Gallery render show images 
function renderGallery() {
    galleryContainer.innerHTML = '';
    visibleImages.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.onclick = () => openLightbox(index);
        item.innerHTML = `
            <img src="${image.src}" alt="${image.title}" loading="lazy">
            <div class="overlay">
                <div class="overlay-text">${image.title}</div>
                <div class="category-badge">${getCategoryEmoji(image.category)} ${image.category.toUpperCase()}</div>
            </div>
        `;
        galleryContainer.appendChild(item);
    });

    
    if (visibleImages.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = '😔 No images found in this category';
        galleryContainer.appendChild(noResults);
    }

    updateStats();
}


function getCategoryEmoji(category) {
    const emojis = { nature: '🌿', car: '🚗', travel: '✈️' };
    return emojis[category] || '📷';
}

// Filter and show image based on category 
function filterGallery(category) {
    activeFilter = category;
    visibleImages = category === 'all' ? [...images] : images.filter(img => img.category === category);
    
    // Active  button highlight 
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderGallery();
}

// Stats update 
function updateStats() {
    const count = visibleImages.length;
    const text = activeFilter === 'all' 
        ? `Showing all ${count} images`
        : `Showing ${count} ${activeFilter} image${count !== 1 ? 's' : ''}`;
    document.getElementById('image-count').textContent = text;
    document.getElementById('total-images').textContent = visibleImages.length;
}

// Lightbox open 
function openLightbox(index) {
    currentIndex = index;
    lightbox.classList.add('active');
    updateLightbox();
    document.body.style.overflow = 'hidden';
}

// Lightbox close
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Lightbox image update 
function updateLightbox() {
    lightboxImg.src = visibleImages[currentIndex].src;
    document.getElementById('current-index').textContent = currentIndex + 1;
}


function nextImage() {
    currentIndex = (currentIndex + 1) % visibleImages.length;
    updateLightbox();
}

// show previous image 
function prevImage() {
    currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
    updateLightbox();
}

// Keyboard controls - arrow keys and  Escape use 
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Escape') closeLightbox();
});


lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});


init();