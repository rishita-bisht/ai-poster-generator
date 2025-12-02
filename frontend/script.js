// DOM Elements
const generateBtn = document.getElementById('generateBtn');
const promptInput = document.getElementById('promptInput');
const toast = document.getElementById('toast');
const toggleAdvanced = document.getElementById('toggleAdvanced');
const advancedOptions = document.getElementById('advancedOptions');

// Advanced Options Elements
const aspectRatio = document.getElementById('aspectRatio');
const quality = document.getElementById('quality');
const colorScheme = document.getElementById('colorScheme');
const variations = document.getElementById('variations');

// Style Pills Functionality
const stylePills = document.querySelectorAll('.style-pill');

stylePills.forEach(pill => {
    pill.addEventListener('click', function() {
        // Remove active class from all pills
        stylePills.forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked pill
        this.classList.add('active');
        
        // Optional: Log selected style
        console.log('Selected style:', this.dataset.style);
    });
});

// Gallery Filter Buttons
const filterButtons = document.querySelectorAll('.btn-control');

filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove active class from all buttons
        filterButtons.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Get filter type
        const filter = this.dataset.filter;
        console.log('Gallery filter:', filter);
        
        // Here you would implement actual filtering logic
        // For example: filterGallery(filter);
    });
});

// Advanced Options Toggle
toggleAdvanced.addEventListener('click', function() {
    advancedOptions.classList.toggle('collapsed');
    
    // Toggle chevron icon
    const chevronIcon = this.querySelector('.fa-chevron-down, .fa-chevron-up');
    if (chevronIcon) {
        if (chevronIcon.classList.contains('fa-chevron-down')) {
            chevronIcon.classList.remove('fa-chevron-down');
            chevronIcon.classList.add('fa-chevron-up');
        } else {
            chevronIcon.classList.remove('fa-chevron-up');
            chevronIcon.classList.add('fa-chevron-down');
        }
    }
});

// Toast Notification Function
function showToast(message = 'Success!', description = 'Your posters are being generated', type = 'success') {
    const toastIcon = toast.querySelector('i');
    const toastTitle = toast.querySelector('div > div:first-child');
    const toastDesc = toast.querySelector('div > div:last-child');
    
    // Update toast content
    toastTitle.textContent = message;
    toastDesc.textContent = description;
    
    // Update icon based on type
    if (type === 'success') {
        toastIcon.className = 'fas fa-check-circle';
        toastIcon.style.color = 'var(--success)';
    } else if (type === 'error') {
        toastIcon.className = 'fas fa-exclamation-circle';
        toastIcon.style.color = 'var(--warning)';
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Get Current Settings
function getCurrentSettings() {
    const selectedStyle = document.querySelector('.style-pill.active');
    
    return {
        prompt: promptInput.value.trim(),
        style: selectedStyle ? selectedStyle.dataset.style : 'modern',
        aspectRatio: aspectRatio.value,
        quality: quality.value,
        colorScheme: colorScheme.value,
        variations: variations.value
    };
}

// Generate Poster Function
function generatePoster() {
    const settings = getCurrentSettings();
    
    // Validate input
    if (!settings.prompt) {
        showToast('Error', 'Please enter a poster description', 'error');
        promptInput.focus();
        return;
    }
    
    // Disable button and show loading state
    const originalHTML = generateBtn.innerHTML;
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="fas fa-spinner spinner me-2"></i>Generating...';
    
    // Log settings for debugging
    console.log('Generating poster with settings:', settings);
    
    // Simulate API call
    // In a real application, this would be your fetch() call to the backend
    setTimeout(() => {
        // Re-enable button
        generateBtn.disabled = false;
        generateBtn.innerHTML = originalHTML;
        
        // Show success notification
        showToast(
            'Generation Complete!',
            `Generated ${settings.variations} ${settings.quality} quality posters`,
            'success'
        );
        
        // Optional: Clear input after successful generation
        // promptInput.value = '';
        
        // Here you would typically:
        // 1. Receive the generated images from your API
        // 2. Add them to the gallery
        // 3. Update the gallery display
        // addPostersToGallery(generatedImages);
        
    }, 2500); // 2.5 second delay for demonstration
}

// Event Listeners

// Generate button click
generateBtn.addEventListener('click', generatePoster);

// Enter key in prompt input
promptInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        generatePoster();
    }
});

// Poster Action Buttons
document.addEventListener('click', function(e) {
    // Download button
    if (e.target.closest('.btn-action') && e.target.closest('.btn-action').querySelector('.fa-download')) {
        e.stopPropagation();
        console.log('Download poster');
        showToast('Downloaded!', 'Poster saved to your device', 'success');
    }
    
    // Favorite button
    if (e.target.closest('.btn-action') && e.target.closest('.btn-action').querySelector('.fa-heart')) {
        e.stopPropagation();
        console.log('Favorite poster');
        const heartIcon = e.target.closest('.btn-action').querySelector('.fa-heart');
        heartIcon.classList.toggle('fas');
        heartIcon.classList.toggle('far');
        showToast('Favorited!', 'Added to your favorites', 'success');
    }
    
    // Share button
    if (e.target.closest('.btn-action') && e.target.closest('.btn-action').querySelector('.fa-share')) {
        e.stopPropagation();
        console.log('Share poster');
        showToast('Share', 'Share link copied to clipboard', 'success');
    }
});

// Gallery Functions (For Future Implementation)

/**
 * Add generated posters to the gallery
 * @param {Array} posters - Array of poster objects with image URLs
 */
function addPostersToGallery(posters) {
    const galleryGrid = document.getElementById('galleryGrid');
    
    posters.forEach(poster => {
        const posterCard = createPosterCard(poster);
        galleryGrid.insertBefore(posterCard, galleryGrid.firstChild);
    });
}

/**
 * Create a poster card element
 * @param {Object} poster - Poster object with image URL and metadata
 * @returns {HTMLElement} - Poster card element
 */
function createPosterCard(poster) {
    const card = document.createElement('div');
    card.className = 'poster-card';
    
    card.innerHTML = `
        <img src="${poster.imageUrl}" alt="${poster.prompt}" class="poster-image">
        <div class="poster-overlay">
            <div class="poster-actions">
                <button class="btn-action"><i class="fas fa-download"></i></button>
                <button class="btn-action"><i class="far fa-heart"></i></button>
                <button class="btn-action"><i class="fas fa-share"></i></button>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Filter gallery based on selected filter
 * @param {string} filter - Filter type (all, recent, favorites)
 */
function filterGallery(filter) {
    // Implementation for filtering gallery
    console.log('Filtering gallery by:', filter);
    
    // Example implementation:
    // const allCards = document.querySelectorAll('.poster-card');
    // allCards.forEach(card => {
    //     if (filter === 'all') {
    //         card.style.display = 'block';
    //     } else if (filter === 'favorites') {
    //         // Show only favorited cards
    //     } else if (filter === 'recent') {
    //         // Show only recent cards
    //     }
    // });
}

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('AI Poster Generator Pro initialized');
    
    // Optional: Load saved settings from localStorage
    // loadSavedSettings();
    
    // Optional: Load user's previously generated posters
    // loadUserPosters();
});

// Utility Functions

/**
 * Save settings to localStorage (if needed)
 */
function saveSettings() {
    const settings = getCurrentSettings();
    localStorage.setItem('posterSettings', JSON.stringify(settings));
}

/**
 * Load settings from localStorage (if needed)
 */
function loadSavedSettings() {
    const saved = localStorage.getItem('posterSettings');
    if (saved) {
        const settings = JSON.parse(saved);
        // Apply saved settings to form elements
        aspectRatio.value = settings.aspectRatio || 'portrait';
        quality.value = settings.quality || 'standard';
        colorScheme.value = settings.colorScheme || 'vibrant';
        variations.value = settings.variations || '4';
    }
}

// Export functions for use in other modules (if needed)
// export { generatePoster, addPostersToGallery, filterGallery };
