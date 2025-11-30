document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const promptInput = document.getElementById('prompt-input');

    if (generateBtn && promptInput) {
        generateBtn.addEventListener('click', handleGenerate);
    }

    function handleGenerate() {
        const prompt = promptInput.value.trim();
        
        if (prompt === "") {
            alert("Please enter a poster idea!");
            return;
        }

        // 1. Log the prompt (for backend processing simulation)
        console.log("Generating poster for prompt:", prompt);

        // 2. Disable button and show loading state
        const originalText = generateBtn.innerHTML;
        generateBtn.disabled = true;
        generateBtn.innerHTML = `Generating... <i class="fas fa-spinner fa-spin ms-2"></i>`;

        // 3. Simulate an API call/processing time
        // In a real application, this would be where your fetch() call goes.
        setTimeout(() => {
            // Revert button state after simulation
            generateBtn.disabled = false;
            generateBtn.innerHTML = originalText;
            
            // Optional: Clear the input after successful generation
            // promptInput.value = "";
            
            // In the future, this is where you would update the gallery with new images.
            console.log("Generation complete!");
            alert(`Posters generated successfully for: "${prompt}"`);

        }, 2000); // 2 second delay for demonstration
    }
});