const candleDiv = document.getElementById('candle-div');
const btn = document.getElementById('startBtn');
const birthdaySection = document.getElementById('birthday-message');
const statusText = document.getElementById('status');

btn.addEventListener('click', async () => {
    try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Update UI to tell the user what to do
        btn.style.display = 'none';
        statusText.innerText = "Blow on your microphone to make a wish!";

        // Set up Audio Analysis
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        analyser.fftSize = 256;
        source.connect(analyser);
        
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        function detectBlow() {
            analyser.getByteFrequencyData(dataArray);
            // Calculate average volume
            let volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

            // Sensitivity threshold (55)
            if (volume > 55) { 
                // 1. Hide the candle and status
                candleDiv.style.display = 'none';
                statusText.style.display = 'none';
                
                // 2. Show the birthday message
                birthdaySection.style.display = 'flex'; 
                birthdaySection.style.opacity = '1';
                
                console.log("Wish made! Birthday message revealed.");

                // 3. Stop the microphone to save battery/privacy
                stream.getTracks().forEach(track => track.stop());
                return; 
            }
            requestAnimationFrame(detectBlow);
        }
        detectBlow();
        
    } catch (err) {
        console.error(err);
        alert("Microphone access is required for the candle to work!");
    }
});
