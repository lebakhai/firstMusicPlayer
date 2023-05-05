const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const contentElement = $('#content')
const footerElement = $('.footer');
const songTitleElement = $('.info-content .title');
const songArtistElement = $('.info-content .artist');
const songImageElement = $('.info .img');
const audioElement = $('#audio');
const audioCurrentTimeElement = $('.timebar-number.current')
const audioTotalTimeElement = $('.timebar-number.total')
const audioTimeline = $('#timeline');
const muteBtn = $('.mute-wrap');
const playBtn = $('.songPlay-wrap');
const nextSongBtn = $('.nextSong');
const preSongBtn = $('.preSong');
var app;

// const url = 'http://84.46.246.159:1153/api/data';
const url = './db.json';
const options = {
	method: 'GET',
	headers: {
		"Content-Type": "application/json",
	}
};

fetch(url, options)
.then((data) => data.json())
.then(data => {
    app = data;
    var currentIndex = 0;
    app.isPlay = false;
    app.isMuted = false;
    
    app.currentSongFn = () => app.album[currentIndex];

    app.render = () => {
        var htmls = app.album.map((song) => {
            return `<div class="footer-item">
            <div class="img-wrap">
                <img src="${song.image}" class="song-img">
            </div>
            <div class="footer-info">
                <h2 class="song-title">${song.title}</h2>
                <div class="song-artist">${song.artist}</div>
            </div>
        </div>`
        })
        var html = htmls.join(' ');
        footerElement.innerHTML = html;
    }
    


    app.handleEvents = () => {
        window.addEventListener('keydown', function(e) {
            if(e.keyCode == 32 && e.target == document.body) {
              e.preventDefault();
            }
          });
          
// control track

        audioTimeline.onclick = () => {
            audioElement.currentTime = ((audioTimeline.value / 1000) * audioElement.duration) / 100;
            console.log(audioElement.currentTime)
        }

        // audioTimeline.onmousedown = () => {
        //     audioElement.currentTime = ((audioTimeline.value / 1000) * audioElement.duration) / 100;
        //     console.log(audioElement.currentTime)
        // }

        muteBtn.onclick = () => {
            if (app.isMuted === false) {
                contentElement.classList.add('muted');
                app.isMuted = true;
                audioElement.muted = app.isMuted;
            } else {
                contentElement.classList.remove('muted');
                app.isMuted = false;
                audioElement.muted = app.isMuted;
            }
        }

        document.onkeydown = (e) => {
            switch(e.keyCode) {
            case 32:
                if (app.isPlay === true) {
                    audioElement.pause();
                    
                } else {
                    audioElement.play();
                }
                
                audioElement.onplay = () => {
                    contentElement.classList.add('play');
                    app.isPlay = true;
                }
    
                audioElement.onpause = () => {
                    contentElement.classList.remove('play');
                    app.isPlay = false;
                }
            break;
            case 77:
                if (app.isMuted === false) {
                    contentElement.classList.add('muted');
                    app.isMuted = true;
                    audioElement.muted = app.isMuted;
                } else {
                    contentElement.classList.remove('muted');
                    app.isMuted = false;
                    audioElement.muted = app.isMuted;
                }
                break;
                case 37:
                    audioElement.currentTime -= 5;
                    break;
                case 39:
                    audioElement.currentTime += 5;
            }
        } 

        playBtn.onclick = (e) => {
            if (app.isPlay === true) {
                audioElement.pause();
            } else {
                audioElement.play();
            }
            
            audioElement.onplay = () => {
                contentElement.classList.add('play');
                app.isPlay = true;
            }

            audioElement.onpause = () => {
                contentElement.classList.remove('play');
                app.isPlay = false;
            }
        };

        preSongBtn.onclick = (e) => {
            currentIndex -= 1;
        };

        audioElement.ontimeupdate = () => {
            var currentTimeSong = audioElement.currentTime;
            var totalTimeSong = audioElement.duration;
            audioTotalTimeElement.textContent = `${Math.floor(totalTimeSong / 60).toString().padStart(2, '0')}:${Math.floor(totalTimeSong % 60).toString().padStart(2, '0')}`
            audioCurrentTimeElement.textContent = `${Math.floor(currentTimeSong / 60).toString().padStart(2, '0')}:${Math.floor(currentTimeSong % 60).toString().padStart(2, '0')}`;
            audioTimeline.value = `${(currentTimeSong / totalTimeSong) * 100000}`
        };
    }

    app.loadCurrentSong = () => {
        var currentSong = app.currentSongFn();
        songTitleElement.textContent = currentSong.title;
        songArtistElement.textContent = currentSong.artist;
        songImageElement.src = currentSong.image;
        audioElement.src = currentSong.music;
        audioTimeline.value = 0;
    }

    app.songTimeline = () => {
        setTimeout(() => {
            var totalTimeSong = audioElement.duration;
            audioCurrentTimeElement.textContent = "00:00";
            audioTotalTimeElement.textContent = `${Math.floor(totalTimeSong / 60).toString().padStart(2, '0')}:${Math.floor(totalTimeSong % 60).toString().padStart(2, '0')}`
            audioTimeline.value = 0;
        }, 250)
    }

    app.start = () => {
        app.handleEvents();
        app.loadCurrentSong()
        app.render();
        app.songTimeline();
    };
    
    app.start();

})