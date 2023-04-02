const container = document.querySelector(".container");
const image = document.querySelector("#music-image");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer");
const prev = document.querySelector("#controls #prev");
const play = document.querySelector("#controls #play");
const next = document.querySelector("#controls #next");
const duration = document.querySelector("#duration");
const current_time = document.querySelector("#current-time");
const progress_bar = document.querySelector("#progress-bar");
const volume_bar = document.querySelector("#volume-bar");
const volume = document.querySelector("#volume");
const ul_list = document.querySelector(".list-group");

const player = new MusicPlayer(musicList);
let musicName = player.getMusic();

window.addEventListener("load", () => {
  let music = player.getMusic();
  displayMusic(music);
  displayMusicList(player.musicList);
  isPlayingNow();
});

function displayMusic(music) {
  title.innerText = music.getName();
  singer.innerText = music.singer;
  image.src = "img/" + music.img;
  audio.src = "mp3/" + music.file;
}

play.addEventListener("click", () => {
  const isMusicPlay = container.classList.contains("playing");
  isMusicPlay ? pauseMusic() : playMusic(); // if condition yazıldı.
});

function pauseMusic() {
  container.classList.remove("playing");
  play.querySelector("i").classList = "fa-solid fa-play";
  audio.pause();
}

function playMusic() {
  container.classList.add("playing");
  play.querySelector("i").classList = "fa-solid fa-pause";
  audio.play();
}

next.addEventListener("click", () => {
  player.next();
  music = player.getMusic();
  displayMusic(music);
  playMusic();
  isPlayingNow();
});

prev.addEventListener("click", () => {
  player.previous();
  music = player.getMusic();
  displayMusic(music);
  playMusic();
  isPlayingNow();
});

const calculateTime = (toplamsaniye) => {
  const dakika = Math.floor(toplamsaniye / 60); // floor ile alta yuvarladık
  const saniye = Math.floor(toplamsaniye % 60);
  const guncellenenSaniye = saniye < 10 ? `0${saniye} ` : ` ${saniye}`;
  const sonuc = `${dakika} : ${guncellenenSaniye}`;
  return sonuc;
};

audio.addEventListener("loadedmetadata", () => {
  // audioya dosya bilgisi  yüklendikten sonra süresini gösterir.
  duration.textContent = calculateTime(audio.duration); //gelen saniye bilgisini dakika ve saniyeye çeviren bir fonksiyon yazacagız
  progress_bar.max = Math.floor(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  // timeupdate saniye her ilerlediğinde demek,ses dosyasında yapılacak işlemler
  progress_bar.value = Math.floor(audio.currentTime);
  current_time.textContent = calculateTime(progress_bar.value);
});

progress_bar.addEventListener("input", () => {
  // progress bar input tipinde bir değerdir.ve input eventi fonksiyonu tetikler.
  current_time.textContent = calculateTime(progress_bar.value); // progress bar value saniye cinsinden geldiği için calculateTime fonksiyonu ile dakika cinsine çevrilir.
  audio.currentTime = progress_bar.value; // bu aşamada şarkının kaçıncı saniyesine gideceği ayarlanıyor.
});

let sesDurum = "sesli";
volume_bar.addEventListener("input", (e) => {
  const value = e.target.value;
  audio.volume = value / 100;
  if (audio.volume == 0) {
    audio.muted = true;
    sesDurum = "sessiz";
    volume.classList = "fa-solid fa-volume-xmark";
    volume_bar.value = 0;
  } else {
    audio.muted = false;
    sesDurum = "sesli";
    volume.classList = "fa-solid fa-volume-high";
  }
});

volume.addEventListener("click", () => {
  if (sesDurum == "sesli") {
    audio.muted = true;
    sesDurum = "sessiz";
    volume.classList = "fa-solid fa-volume-xmark";
    volume_bar.value = 0;
  } else {
    audio.muted = false;
    sesDurum = "sesli";
    volume.classList = "fa-solid fa-volume-high";
    volume_bar.value = 100;
  }
});

const displayMusicList = (list) => {
  for (let i = 0; i < list.length; i++) {
    let liTag = ` <li li-index="${i}" onclick="selectedMusic(this)" class="list-group-item d-flex justify-content-between align-items-center" >
                      <span>${list[i].getName()}</span>
                      <span id="music-${i}" class="badge bg-primary rounded-pill"></span>
                      <audio src="mp3/${
                        list[i].file
                      }" class="music-${i}"></audio>
                  </li>`;

    ul_list.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ul_list.querySelector(`#music-${i}`); // span etiketini al
    let liAudioTag = ul_list.querySelector(`.music-${i}`); // audio nesnesini al

    liAudioTag.addEventListener("loadeddata", () => {
      // audio dosyasını tetikliyoruz
      liAudioDuration.innerText = calculateTime(liAudioTag.duration);
    });
  }
};

const selectedMusic = (li) => {
  const index = li.getAttribute("li-index");
  player.index = index;
  displayMusic(player.getMusic());
  playMusic();
  isPlayingNow();
};

const isPlayingNow = () => {
  for (let li of ul_list.querySelectorAll("li")) {
    if (li.classList.contains("playing")) {
      li.classList.remove("playing");
    }
    if (li.getAttribute("li-index") == player.index) {
      li.classList.add("playing");
    }
  }
};

audio.addEventListener("ended", () => {
  player.next();
  music = player.getMusic();
  displayMusic(music);
  playMusic();
  isPlayingNow();
});
