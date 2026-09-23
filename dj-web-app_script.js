// Variables for YouTube Players
let playerA;
let playerB;

// Base Volumes
let volA = 50;
let volB = 50;
let currentCrossfader = 0;

// URL extractor helper
function extractVideoId(urlOrId) {
    if (!urlOrId) return null;
    if (urlOrId.length === 11) return urlOrId;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = urlOrId.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Initialize YouTube API Players
window.onYouTubeIframeAPIReady = function() {
    playerA = new YT.Player('player-a', {
        height: '100%',
        width: '100%',
        videoId: 'dQw4w9WgXcQ', // Default video Rick Roll
        playerVars: { 'autoplay': 0, 'controls': 1 },
        events: { 'onReady': onPlayerReadyA }
    });

    playerB = new YT.Player('player-b', {
        height: '100%',
        width: '100%',
        videoId: 'kJQP7kiw5Fk', // Default video Lofi
        playerVars: { 'autoplay': 0, 'controls': 1 },
        events: { 'onReady': onPlayerReadyB }
    });
}

function onPlayerReadyA(event) {
    updateFinalVolumes();
}

function onPlayerReadyB(event) {
    updateFinalVolumes();
}

// Volume calculation logic with Crossfader
function updateFinalVolumes() {
    // Crossfader ranges from -50 to 50
    // If cf = -50: Deck A 100%, Deck B 0%
    // If cf = 0: Deck A 100%, Deck B 100%
    // If cf = 50: Deck A 0%, Deck B 100%
    let factorA = 1;
    let factorB = 1;

    if (currentCrossfader > 0) {
        factorA = (50 - currentCrossfader) / 50;
    } else if (currentCrossfader < 0) {
        factorB = (50 + currentCrossfader) / 50;
    }

    let finalVolA = volA * factorA;
    let finalVolB = volB * factorB;

    if (playerA && typeof playerA.setVolume === 'function') {
        playerA.setVolume(finalVolA);
    }
    if (playerB && typeof playerB.setVolume === 'function') {
        playerB.setVolume(finalVolB);
    }
}

// Event Listeners setup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    
    // Load Buttons
    document.getElementById('load-a').addEventListener('click', () => {
        const input = document.getElementById('search-a').value;
        const id = extractVideoId(input);
        if (id && playerA) {
            playerA.cueVideoById(id);
        } else {
            alert('ID Video / URL YouTube tidak valid di DECK A!');
        }
    });

    document.getElementById('load-b').addEventListener('click', () => {
        const input = document.getElementById('search-b').value;
        const id = extractVideoId(input);
        if (id && playerB) {
            playerB.cueVideoById(id);
        } else {
            alert('ID Video / URL YouTube tidak valid di DECK B!');
        }
    });

    // Individual Volume Faders
    document.getElementById('vol-a').addEventListener('input', (e) => {
        volA = parseInt(e.target.value);
        updateFinalVolumes();
    });

    document.getElementById('vol-b').addEventListener('input', (e) => {
        volB = parseInt(e.target.value);
        updateFinalVolumes();
    });

    // Crossfader
    document.getElementById('crossfader').addEventListener('input', (e) => {
        currentCrossfader = parseInt(e.target.value);
        updateFinalVolumes();
    });

    // Equalizer / Bass Boost Emulation Info
    document.getElementById('bass-a').addEventListener('input', () => {
        // Karena YouTube Iframe API standard tidak mengizinkan manipulasi raw audio data (Web Audio API) 
        // akibat batasan CORS, slider ini disematkan sebagai gimmick visual & kontrol filter masa depan.
    });
    document.getElementById('bass-b').addEventListener('input', () => {
        // Gimmick equalizer panel
    });

    // --- CLUB LIGHT SCREEN SYSTEM ---
    const strobeScreen = document.getElementById('strobe-screen');
    const btnOff = document.getElementById('btn-light-off');
    const btnStrobe = document.getElementById('btn-light-strobe');
    const btnRainbow = document.getElementById('btn-light-rainbow');

    function clearLightClasses() {
        strobeScreen.classList.remove('effect-strobe', 'effect-rainbow');
        btnOff.classList.remove('active');
        btnStrobe.classList.remove('active');
        btnRainbow.classList.remove('active');
    }

    btnOff.addEventListener('click', () => {
        clearLightClasses();
        btnOff.classList.add('active');
    });

    btnStrobe.addEventListener('click', () => {
        clearLightClasses();
        btnStrobe.classList.add('active');
        strobeScreen.classList.add('effect-strobe');
    });

    btnRainbow.addEventListener('click', () => {
        clearLightClasses();
        btnRainbow.classList.add('active');
        strobeScreen.classList.add('effect-rainbow');
    });
});
