const flame = document.getElementById('flame-group');
const candleDiv = document.getElementById('candle-div');
const btn = document.getElementById('startBtn');
const birthdaySection = document.getElementById('birthday-message');
const statusText = document.getElementById('status');

btn.addEventListener('click', async () => {
    try {
        // 1. Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // 2. Make the flame visible
        if (flame) {
            flame.style.display = 'block'; 
        }
        
        // 3. Update UI
        btn.style.display = 'none';
        statusText.innerText = "Blow on your microphone now!";

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
                
                // Show the birthday message
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
        console.error("Mic error:", err);
        alert("Microphone access is required for the candle to work!");
    }
}); // This closing bracket was likely missing!
