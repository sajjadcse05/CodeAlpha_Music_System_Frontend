// Complete structural track schema 
const trackList = [
    {
        title: "Summer Breeze",
        artist: "Chill Lab",
        path: "D:\\Music Player\\tracks\\summer_breeze.mp3", // Replace with your file path
        cover: "https://picsum.photos/250?random=1"
    },
    {
        title: "Neon Horizon",
        artist: "RetroWave X",
        path: "D:\\Music Player\\tracks\\neon_horizon.mp3",  // Replace with your file path
        cover: "https://picsum.photos/250?random=2"
    },
    {
        title: "Midnight Coffee",
        artist: "Lofi Beats Studio",
        path: "D:\\Music Player\\tracks\\midnight_coffee.mp3", // Replace with your file path
        cover: "https://picsum.photos/250?random=3"
    }
];

// App State Management
let currentTrackIndex = 0;
let isPlaying = false;
const audioInstance = new Audio();

// DOM Node Selection Hooks
const trackArt = document.getElementById('track-art');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');

const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const totalDurationDisplay = document.getElementById('total-duration');

const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon');
const playlistQueue = document.getElementById('playlist-queue');

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
    loadTrack(currentTrackIndex);
    renderPlaylist();
    audioInstance.volume = volumeSlider.value;
});

// Load structural track details into context
function loadTrack(index) {
    const currentTrack = trackList[index];
    
    audioInstance.src = currentTrack.path;
    trackTitle.textContent = currentTrack.title;
    trackArtist.textContent = currentTrack.artist;
    trackArt.src = currentTrack.cover;

    // Reset timelines
    progressBar.value = 0;
    currentTimeDisplay.textContent = "0:00";
    totalDurationDisplay.textContent = "0:00";

    // Update operational UI cues on the active side list
    updateActivePlaylistItem();
}

// Play / Pause toggles
function togglePlay() {
    if (!isPlaying) {
        startPlayback();
    } else {
        pausePlayback();
    }
}

function startPlayback() {
    audioInstance.play()
        .then(() => {
            isPlaying = true;
            playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
        })
        .catch(err => console.log("Playback interaction deferred until client triggers DOM event: ", err));
}

function pausePlayback() {
    audioInstance.pause();
    isPlaying = false;
    playBtn.innerHTML = `<i class="fas fa-play"></i>`;
}

// Directional cycling controls
function prevTrack() {
    currentTrackIndex--;
    if (currentTrackIndex < 0) {
        currentTrackIndex = trackList.length - 1;
    }
    loadTrack(currentTrackIndex);
    if (isPlaying) startPlayback();
}

function nextTrack() {
    currentTrackIndex++;
    if (currentTrackIndex >= trackList.length) {
        currentTrackIndex = 0;
    }
    loadTrack(currentTrackIndex);
    if (isPlaying) startPlayback();
}

// Format raw seconds into a cleaner MM:SS output format
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Time metadata processing hooks
audioInstance.addEventListener('loadedmetadata', () => {
    totalDurationDisplay.textContent = formatTime(audioInstance.duration);
});

audioInstance.addEventListener('timeupdate', () => {
    if (!isNaN(audioInstance.duration)) {
        const progressPercentage = (audioInstance.currentTime / audioInstance.duration) * 100;
        progressBar.value = progressPercentage;
        currentTimeDisplay.textContent = formatTime(audioInstance.currentTime);
    }
});

// Manual scrubber/slider overrides
progressBar.addEventListener('input', () => {
    if (audioInstance.duration) {
        const targetTime = (progressBar.value / 100) * audioInstance.duration;
        audioInstance.currentTime = targetTime;
    }
});

// Volume controls
volumeSlider.addEventListener('input', (e) => {
    const value = e.target.value;
    audioInstance.volume = value;
    
    // Dynamically adjust icon styling based on output sound volume thresholds
    if (parseFloat(value) === 0) {
        volumeIcon.className = "fas fa-volume-mute";
    } else if (value < 0.5) {
        volumeIcon.className = "fas fa-volume-down";
    } else {
        volumeIcon.className = "fas fa-volume-up";
    }
});

// Bonus: Handle dynamic track autoplay on track completion
audioInstance.addEventListener('ended', () => {
    nextTrack(); // Shifts indexing automatically forward
});

// Bonus: Build and render playlist options programmatically
function renderPlaylist() {
    playlistQueue.innerHTML = "";
    trackList.forEach((track, idx) => {
        const itemLi = document.createElement('li');
        itemLi.dataset.index = idx;
        
        // Provide standard static durations placeholders or track labels seamlessly
        itemLi.innerHTML = `
            <div>
                <div>${track.title}</div>
                <div style="font-size:0.75rem; color:#888;">${track.artist}</div>
            </div>
            <span class="track-duration">---</span>
        `;
        
        // Playlist selection trigger
        itemLi.addEventListener('click', () => {
            currentTrackIndex = idx;
            loadTrack(currentTrackIndex);
            startPlayback();
        });
        
        playlistQueue.appendChild(itemLi);
    });
    updateActivePlaylistItem();
}

function updateActivePlaylistItem() {
    const items = playlistQueue.querySelectorAll('li');
    items.forEach((item, idx) => {
        if (idx === currentTrackIndex) {
            item.classList.add('active-track');
        } else {
            item.classList.remove('active-track');
        }
    });
}

// Standard Event Listeners mappings
playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);