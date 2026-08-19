// ==========================
// SONG DATA
// ==========================

const songs = [
  {
    title: "The Mountain",
    artist: "Lofi Music",
    src: "assets/music/song1.mp3",
    cover:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80",
  },

  {
    title: "Lofi Chill",
    artist: "MondaMusic",
    src: "assets/music/song2.mp3",
    cover:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80",
  },

  {
    title: "Chill Lamp Light",
    artist: "Ornave",
    src: "assets/music/song3.mp3",
    cover:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
  },

  {
    title: "The Mountain - Pop Vocal",
    artist: "The Mountain",
    src: "assets/music/song4.mp3",
    cover:
      "https://images.unsplash.com/photo-1521337581100-8ca9a73a5f79?auto=format&fit=crop&w=800&q=80",
  },

  {
    title: "Pop Music Vocal",
    artist: "Echoes of Lumen",
    src: "assets/music/song5.mp3",
    cover:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
  },

  {
    title: "Electric Swing Song",
    artist: "PaulVudin",
    src: "assets/music/song6.mp3",
    cover:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80",
  },
];

// ==========================
// ELEMENTS
// ==========================

const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const songTitle = document.getElementById("song-title");
const artist = document.getElementById("artist");

const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

const shuffleBtn = document.getElementById("shuffle-btn");
const repeatBtn = document.getElementById("repeat-btn");

const progress = document.getElementById("progress");
const volume = document.getElementById("volume");

const currentTimeElement =
  document.getElementById("current-time");

const durationElement =
  document.getElementById("duration");

const playlist = document.getElementById("playlist");
const songCount = document.getElementById("song-count");

// ==========================
// PLAYER STATE
// ==========================

let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

// ==========================
// FORMAT TIME
// ==========================

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

// ==========================
// LOAD SONG
// ==========================

function loadSong(index) {
  const song = songs[index];

  audio.src = song.src;
  cover.src = song.cover;

  songTitle.textContent = song.title;
  artist.textContent = song.artist;

  progress.value = 0;

  currentTimeElement.textContent = "0:00";
  durationElement.textContent = "0:00";

  updatePlaylist();
}

// ==========================
// PLAY SONG
// ==========================

async function playSong() {
  try {
    await audio.play();

    isPlaying = true;

    playBtn.innerHTML =
      '<i class="fa-solid fa-pause"></i>';
  } catch (error) {
    console.error("Unable to play audio:", error);
  }
}

// ==========================
// PAUSE SONG
// ==========================

function pauseSong() {
  audio.pause();

  isPlaying = false;

  playBtn.innerHTML =
    '<i class="fa-solid fa-play"></i>';
}

// ==========================
// PLAY / PAUSE
// ==========================

playBtn.addEventListener("click", () => {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// ==========================
// NEXT SONG
// ==========================

function nextSong() {
  if (isShuffle && songs.length > 1) {
    let randomIndex;

    do {
      randomIndex = Math.floor(
        Math.random() * songs.length
      );
    } while (randomIndex === currentSongIndex);

    currentSongIndex = randomIndex;
  } else {
    currentSongIndex =
      (currentSongIndex + 1) % songs.length;
  }

  loadSong(currentSongIndex);
  playSong();
}

nextBtn.addEventListener("click", nextSong);

// ==========================
// PREVIOUS SONG
// ==========================

function previousSong() {
  currentSongIndex =
    (currentSongIndex - 1 + songs.length) %
    songs.length;

  loadSong(currentSongIndex);
  playSong();
}

prevBtn.addEventListener("click", previousSong);

// ==========================
// UPDATE PROGRESS
// ==========================

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) {
    return;
  }

  const percentage =
    (audio.currentTime / audio.duration) * 100;

  progress.value = percentage;

  currentTimeElement.textContent =
    formatTime(audio.currentTime);

  durationElement.textContent =
    formatTime(audio.duration);
});

// ==========================
// LOAD DURATION
// ==========================

audio.addEventListener("loadedmetadata", () => {
  durationElement.textContent =
    formatTime(audio.duration);
});

// ==========================
// SEEK
// ==========================

progress.addEventListener("input", () => {
  if (!audio.duration) {
    return;
  }

  audio.currentTime =
    (progress.value / 100) * audio.duration;
});

// ==========================
// VOLUME
// ==========================

audio.volume = volume.value / 100;

volume.addEventListener("input", () => {
  audio.volume = volume.value / 100;
});

// ==========================
// SHUFFLE
// ==========================

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;

  shuffleBtn.classList.toggle(
    "active",
    isShuffle
  );
});

// ==========================
// REPEAT
// ==========================

repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;

  repeatBtn.classList.toggle(
    "active",
    isRepeat
  );
});

// ==========================
// AUTO NEXT / REPEAT
// ==========================

audio.addEventListener("ended", () => {
  if (isRepeat) {
    audio.currentTime = 0;
    playSong();
  } else {
    nextSong();
  }
});

// ==========================
// AUDIO ERROR
// ==========================

audio.addEventListener("error", () => {
  console.error(
    "Audio file could not be loaded:",
    audio.src
  );
});

// ==========================
// CREATE PLAYLIST
// ==========================

function createPlaylist() {
  playlist.innerHTML = "";

  songs.forEach((song, index) => {
    const item = document.createElement("div");

    item.classList.add("playlist-item");

    if (index === currentSongIndex) {
      item.classList.add("active");
    }

    item.innerHTML = `
      <img
        src="${song.cover}"
        alt="${song.title}"
      >

      <div class="playlist-details">
        <h3>${song.title}</h3>
        <p>${song.artist}</p>
      </div>

      <span class="playlist-duration">
        <i class="fa-solid fa-play"></i>
      </span>
    `;

    item.addEventListener("click", () => {
      currentSongIndex = index;

      loadSong(currentSongIndex);
      playSong();
    });

    playlist.appendChild(item);
  });

  songCount.textContent =
    `${songs.length} Songs`;
}

// ==========================
// UPDATE ACTIVE SONG
// ==========================

function updatePlaylist() {
  const items =
    document.querySelectorAll(".playlist-item");

  items.forEach((item, index) => {
    item.classList.toggle(
      "active",
      index === currentSongIndex
    );
  });
}

// ==========================
// ACTIVE BUTTON STYLE
// ==========================

const activeStyle =
  document.createElement("style");

activeStyle.textContent = `
  .secondary-btn.active {
    color: #38bdf8;
    border-color: #38bdf8 !important;
    background: rgba(56, 189, 248, 0.15);
  }
`;

document.head.appendChild(activeStyle);

// ==========================
// INITIALIZE
// ==========================

createPlaylist();
loadSong(currentSongIndex);