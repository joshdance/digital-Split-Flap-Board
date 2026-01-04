// Character mapping to image files
const charMap = {
    'A': 'A.png', 'B': 'B.png', 'C': 'C.png', 'D': 'D.png', 'E': 'E.png',
    'F': 'F.png', 'G': 'G.png', 'H': 'H.png', 'I': 'I.png', 'J': 'J.png',
    'K': 'K.png', 'L': 'L.png', 'M': 'M.png', 'N': 'N.png', 'O': 'O.png',
    'P': 'P.png', 'Q': 'Q.png', 'R': 'R.png', 'S': 'S.png', 'T': 'T.png',
    'U': 'U.png', 'V': 'V.png', 'W': 'W.png', 'X': 'X.png', 'Y': 'Y.png',
    'Z': 'Z.png',
    '0': '0.png', '1': '1.png', '2': '2.png', '3': '3.png', '4': '4.png',
    '5': '5.png', '6': '6.png', '7': '7.png', '8': '8.png', '9': '9.png',
    ' ': 'blank.png',
    '@': 'at.png',
    '!': 'bang.png',
    ':': 'colon.png',
    '#': 'hashtag.png',
    '-': 'hyphen.png',
    '.': 'period.png',
    ';': 'semicolon.png',
    '/': 'slash.png'
};

// All available characters for animation cycle
const allChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
                  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
                  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                  ' ', '!', '@', '#', '-', '.', ':', ';', '/'];

// Audio for flipping sound
let flapAudio;
let soundEnabled = true;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load audio
    flapAudio = new Audio('OatFoundry.mp3');
    flapAudio.volume = 0.3;

    // Event listeners
    document.getElementById('displayBtn').addEventListener('click', displayText);
    document.getElementById('textInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            displayText();
        }
    });
    document.getElementById('soundToggle').addEventListener('change', (e) => {
        soundEnabled = e.target.checked;
    });

    // Display initial message
    displayText('HELLO');
});

function displayText(text) {
    const input = text || document.getElementById('textInput').value.toUpperCase();
    if (!input) return;

    const board = document.getElementById('board');
    board.innerHTML = '';

    // Create flap containers for each character
    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        const flapContainer = createFlapContainer();
        board.appendChild(flapContainer);

        // Animate each flap with a delay
        setTimeout(() => {
            animateFlap(flapContainer, char);
        }, i * 200);
    }

    // Clear input
    if (!text) {
        document.getElementById('textInput').value = '';
    }
}

function createFlapContainer() {
    const container = document.createElement('div');
    container.className = 'flap-container';

    const topFlap = document.createElement('div');
    topFlap.className = 'flap flap-top';
    const topImg = document.createElement('img');
    topImg.src = 'blank.png';
    topFlap.appendChild(topImg);

    const bottomFlap = document.createElement('div');
    bottomFlap.className = 'flap flap-bottom';
    const bottomImg = document.createElement('img');
    bottomImg.src = 'blank.png';
    bottomFlap.appendChild(bottomImg);

    container.appendChild(topFlap);
    container.appendChild(bottomFlap);

    return container;
}

function animateFlap(container, targetChar) {
    const topFlap = container.querySelector('.flap-top');
    const bottomFlap = container.querySelector('.flap-bottom');
    const topImg = topFlap.querySelector('img');
    const bottomImg = bottomFlap.querySelector('img');

    // Get the image for the target character
    const targetImage = charMap[targetChar] || 'blank.png';

    // Find the index of target character
    let targetIndex = allChars.indexOf(targetChar);
    if (targetIndex === -1) targetIndex = allChars.indexOf(' ');

    // Cycle through characters
    let currentIndex = 0;
    const cycleSpeed = 50; // milliseconds per character
    const cycleThroughChars = Math.min(10, targetIndex + 1); // Show at least a few flips

    let flipCount = 0;
    const maxFlips = cycleThroughChars;

    const flipInterval = setInterval(() => {
        container.classList.add('flipping');

        // Play sound
        if (soundEnabled) {
            const sound = flapAudio.cloneNode();
            sound.volume = 0.2;
            sound.play().catch(() => {}); // Ignore errors
        }

        setTimeout(() => {
            container.classList.remove('flipping');

            flipCount++;
            if (flipCount >= maxFlips) {
                // Final character
                topImg.src = targetImage;
                bottomImg.src = targetImage;
                clearInterval(flipInterval);
            } else {
                // Show intermediate character
                const charIndex = Math.floor((currentIndex / maxFlips) * targetIndex) % allChars.length;
                const charImg = charMap[allChars[charIndex]] || 'blank.png';
                topImg.src = charImg;
                bottomImg.src = charImg;
                currentIndex++;
            }
        }, 150);

    }, 300);
}
