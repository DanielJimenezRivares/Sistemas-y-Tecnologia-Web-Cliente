async function generateRandomText(wordCount) {
    try {
        const response = await fetch(`https://random-word-api.herokuapp.com/word?number=${wordCount}`);
        const words = await response.json();
        return words.join(' ');
    } catch (error) {
        console.error('Error fetching random words:', error);
        return 'Error generating random text';
    }
}

// Initialize the text when the page loads
window.addEventListener('DOMContentLoaded', async () => {
    const text = await generateRandomText(100);
    document.getElementById('empresaDesc').textContent = text;
});