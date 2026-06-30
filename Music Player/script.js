/* ====== DATA ======
   Using royalty-free sample audio (SoundHelix) just so play/pause/seek
   actually work end-to-end. Swap "src" with your own files anytime. */
const playlist = [
    { title: "Midnight Drift", artist: "Lunar Echo", emoji: "🌙", src: "music/song1.mp3" },
    { title: "Trending punjabi song", artist: "rahulsapkal", emoji: "⚡", src: "music/Song2.mp3" },
    { title: "Tera hi nasha", artist: "rahulsapkal", emoji: "🌆", src: "music/Song3.mp3" },
    { title: "shadow in my head", artist: "rahulsapkal", emoji: "🔮", src: "music/Song4.mp3" },
    { title: "love rap song", artist: "rahulsapkal", emoji: "💜", src: "music/Song5.mp3" },
    { title: "gehra hua", artist: "Synth Tide", emoji: "✨", src: "music/Song6.mp3" },
];

const audio = document.getElementById('audio');
const rig = document.getElementById('rig');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const bar = document.getElementById('bar');
const barFill = document.getElementById('barFill');
const curTimeEl = document.getElementById('curTime');
const durTimeEl = document.getElementById('durTime');
const songTitleEl = document.getElementById('songTitle');
const songArtistEl = document.getElementById('songArtist');
const artEmojiEl = document.getElementById('artEmoji');
const volSlider = document.getElementById('volSlider');
const trackListEl = document.getElementById('trackList');
const listToggleBtn = document.getElementById('listToggleBtn');
const playlistPanel = document.getElementById('playlistPanel');

const ICON_PLAY = '<path d="M8 5v14l11-7z"/>';
const ICON_PAUSE = '<path d="M6 5h4v14H6zm8 0h4v14h-4z"/>';

let currentIndex = 0;
let isShuffle = false;
let isRepeat = false;

function fmtTime(sec) {
    if (!isFinite(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function renderPlaylist() {
    trackListEl.innerHTML = '';
    playlist.forEach((track, i) => {
        const li = document.createElement('li');
        li.className = 'track' + (i === currentIndex ? ' active' : '');
        li.innerHTML = `
      <div class="track-icon">${track.emoji}</div>
      <div class="track-info">
        <div class="t-title">${track.title}</div>
        <div class="t-artist">${track.artist}</div>
      </div>
      ${i === currentIndex
                ? '<div class="eq"><span></span><span></span><span></span></div>'
                : '<div class="t-dur" data-dur></div>'}
    `;
        li.addEventListener('click', () => loadTrack(i, true));
        trackListEl.appendChild(li);
    });
}

function loadTrack(index, autoplay) {
    currentIndex = (index + playlist.length) % playlist.length;
    const track = playlist[currentIndex];
    audio.src = track.src;
    songTitleEl.textContent = track.title;
    songArtistEl.textContent = track.artist;
    artEmojiEl.textContent = track.emoji;
    barFill.style.width = '0%';
    curTimeEl.textContent = "0:00";
    renderPlaylist();
    if (autoplay) playAudio();
}

function playAudio() {
    audio.play();
    rig.classList.add('playing');
    playIcon.innerHTML = ICON_PAUSE;
}
function pauseAudio() {
    audio.pause();
    rig.classList.remove('playing');
    playIcon.innerHTML = ICON_PLAY;
}
function togglePlay() {
    if (audio.paused) playAudio(); else pauseAudio();
}

function nextTrack() {
    if (isShuffle) {
        let r;
        do { r = Math.floor(Math.random() * playlist.length); } while (r === currentIndex && playlist.length > 1);
        loadTrack(r, true);
    } else {
        loadTrack(currentIndex + 1, true);
    }
}
function prevTrack() {
    // if more than 3s in, restart current song; else go back
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
    } else {
        loadTrack(currentIndex - 1, true);
    }
}

/* ===== controls ===== */
playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);

shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
});
repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active', isRepeat);
});

audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    barFill.style.width = pct + '%';
    curTimeEl.textContent = fmtTime(audio.currentTime);
});
audio.addEventListener('loadedmetadata', () => {
    durTimeEl.textContent = fmtTime(audio.duration);
});

/* progress bar seek (click + drag) */
let seeking = false;
function seekFromEvent(e) {
    const rect = bar.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let pct = (clientX - rect.left) / rect.width;
    pct = Math.min(1, Math.max(0, pct));
    if (audio.duration) audio.currentTime = pct * audio.duration;
    barFill.style.width = (pct * 100) + '%';
}
bar.addEventListener('mousedown', e => { seeking = true; seekFromEvent(e); });
window.addEventListener('mousemove', e => { if (seeking) seekFromEvent(e); });
window.addEventListener('mouseup', () => seeking = false);
bar.addEventListener('touchstart', seekFromEvent);
bar.addEventListener('touchmove', seekFromEvent);

/* autoplay next song / repeat */
audio.addEventListener('ended', () => {
    if (isRepeat) {
        audio.currentTime = 0;
        playAudio();
    } else {
        nextTrack(); // autoplay next song in playlist
    }
});

/* volume */
volSlider.addEventListener('input', () => {
    audio.volume = volSlider.value;
});
audio.volume = volSlider.value;

/* mobile playlist toggle */
listToggleBtn.addEventListener('click', () => {
    playlistPanel.classList.toggle('open');
});

/* keyboard shortcuts: space = play/pause, arrows = next/prev */
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
    if (e.code === 'ArrowRight') nextTrack();
    if (e.code === 'ArrowLeft') prevTrack();
});

/* init */
loadTrack(0, false);