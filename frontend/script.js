document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const promptInput = document.getElementById('promptInput');
    const galleryGrid = document.getElementById('galleryGrid');
    
    console.log('✅ AI Poster Generator Loaded!');
    
    if (!generateBtn || !promptInput || !galleryGrid) {
        console.error('❌ Missing elements:', {generateBtn, promptInput, galleryGrid});
        return;
    }

    let selectedStyle = 'modern';
    let numVariations = 4;

    // Style pills
    document.querySelectorAll('.style-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.style-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            selectedStyle = pill.dataset.style;
        });
    });

    // Generate posters
    generateBtn.addEventListener('click', () => {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            alert('Please enter a poster idea!');
            return;
        }

        console.log('🎨 Generating:', prompt, selectedStyle);

        // Loading state
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Generating...';

        // Settings
        numVariations = parseInt(document.getElementById('variations')?.value || 4);

        // Generate Picsum posters
        const posters = [];
        for (let i = 0; i < numVariations; i++) {
            const seed = `${prompt.toLowerCase().replace(/[^a-z0-9]/g, '')}-${selectedStyle}-${i}`;
            posters.push(`https://picsum.photos/seed/${seed}/400/533?blur=1`);
        }

        // Show posters after delay
        setTimeout(() => {
            galleryGrid.innerHTML = posters.map((url, i) => `
                <div class="poster-card">
                    <img src="${url}" alt="AI Poster ${i+1}" class="poster-image" loading="lazy">
                    <div class="poster-overlay">
                        <div class="poster-actions">
                            <button class="btn-action" onclick="downloadPoster(${i})" title="Download">
                                <i class="fas fa-download"></i>
                            </button>
                            <button class="btn-action" title="Favorite">
                                <i class="fas fa-heart"></i>
                            </button>
                            <button class="btn-action" title="Share">
                                <i class="fas fa-share"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');

            // Reset button
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles me-2"></i>Generate';
            
            console.log(`✅ Generated ${numVariations} posters!`);
            promptInput.value = '';
            
            // Simple alert instead of toast
            setTimeout(() => alert(`✨ Generated ${numVariations} amazing posters!`), 100);
        }, 2000);
    });
});

// Global download function
function downloadPoster(index) {
    const posters = document.querySelectorAll('.poster-image');
    if (posters[index]) {
        const link = document.createElement('a');
        link.href = posters[index].src.replace('400/533', '1080/1440');
        link.download = `ai-poster-${index + 1}.jpg`;
        link.click();
        console.log('📥 Download started for poster', index + 1);
    }
}
