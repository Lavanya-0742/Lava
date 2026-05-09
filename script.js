const flame = document.getElementById('flame-group');
const candleDiv = document.getElementById('candle-div');
const btn = document.getElementById('startBtn');
const birthdaySection = document.getElementById('birthday-message');
const statusText = document.getElementById('status');

btn.addEventListener('click', async () => {
    try {
        // 1. Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // 2. MAKE THE FLAME VISIBLE
        if (flame) {
            flame.style.display = 'block'; 
            // This is the "match" that lights the candle
flame.style.setProperty('display', 'block', 'important');
        }
        
        // 3. Update UI
        btn.style.display = 'none';
        statusText.innerText = "Now, blow on your microphone!";

        // 4. Set up Audio Analysis
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        analyser.fftSize = 256;
        source.connect(analyser);
        
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        function detectBlow() {
            analyser.getByteFrequencyData(dataArray);
            let volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

            // Sensitivity threshold
            if (volume > 55) { 
                // Hide candle and status
                candleDiv.style.display = 'none';
                statusText.style.display = 'none';
                
                // Show the birthday message (the photo and text)
                birthdaySection.style.display = 'flex'; 
                birthdaySection.style.opacity = '1';
                
                // Stop the microphone
                stream.getTracks().forEach(track => track.stop());
                return; 
            }
            requestAnimationFrame(detectBlow);
        }
        detectBlow();
        
    } catch (err) {
        console.error(err);
        alert("Microphone access is required to blow out the candle!");
    }
    btn.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Use the exact ID from your HTML
        const flameGroup = document.getElementById('flame-group');
        if (flameGroup) {
            flameGroup.style.display = 'block'; // Force it to show
            console.log("Flame should be visible now!");
        }

        btn.style.display = 'none';
        statusText.innerText = "Blow now!";
        
        // ... rest of your audio logic ...
});
