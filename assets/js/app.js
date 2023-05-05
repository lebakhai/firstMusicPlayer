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
const prevSongBtn = $('.preSong');
const repeatBtn = $('.repeat-btn')
const shuffleBtn = $('.shuffle-btn')
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
.then((data) => {
    return app = data;
})
.then(data => {
    app = data;
    var currentIndex = 0;
    app.isPlay = false;
    app.isMuted = false;
    app.isRepeat = false;
    app.isShuffle = false;
    
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

        function playHandle() {
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
        }


        function muteHandle() {
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

        function prevSong() {
            if (currentIndex <= 0) {
                currentIndex = app.album.length - 1;
            } else {
                currentIndex -= 1;
            }
            app.loadCurrentSong()
            app.isPlay = false;
            playHandle()
        }

        function nextSong() {
            if (currentIndex > app.album.length - 2) {
                currentIndex = 0
            } else {
                currentIndex += 1;
            }
            app.loadCurrentSong()
            app.isPlay = false;
            playHandle();            
        }

        function repeatShufftleBtn(btnFn, handleVar) {
            if (app[handleVar] === false) {
                btnFn.classList.add('active');
                app[handleVar] = true;
            } else {
                btnFn.classList.remove('active');
                app[handleVar] = false;
            }
        }

        function randomSong() {
            let newIndex
            do {
                newIndex = Math.floor(Math.random() * app.album.length)
            } while(newIndex == currentIndex)
            currentIndex = newIndex;
            app.loadCurrentSong();
            app.isPlay = false;
            playHandle();
        }
    

        audioTimeline.onclick = () => {
            audioElement.currentTime = ((audioTimeline.value / 1000) * audioElement.duration) / 100;
            app.isPlay = false;
            playHandle();
        }

        // audioTimeline.onmousedown = () => {
        //     audioElement.currentTime = ((audioTimeline.value / 1000) * audioElement.duration) / 100;
        //     console.log(audioElement.currentTime)
        // }

        muteBtn.onclick = () => {
            muteHandle()
        }

        document.onkeydown = (e) => {
            switch(e.keyCode) {
            case 32:
                playHandle();
            break;
            case 77:
                muteHandle()
                break;
                case 37:
                    audioElement.currentTime -= 5;
                    break;
                case 39:
                    audioElement.currentTime += 5;
            }
        } 

        playBtn.onclick = (e) => {
            playHandle()
        };


        prevSongBtn.onclick = (e) => {
            if (app.isShuffle === true) {
                randomSong();
            } else {
                prevSong();
            }
        };
        
        nextSongBtn.onclick = (e) => {
            if (app.isShuffle === true) {
                randomSong();
            } else {
                nextSong();
            }
        };

        audioElement.onended = () => {
            randomSong();
        }

        audioElement.ontimeupdate = () => {
            var currentTimeSong = audioElement.currentTime;
            var totalTimeSong = audioElement.duration;
            audioTotalTimeElement.textContent = `${Math.floor(totalTimeSong / 60).toString().padStart(2, '0')}:${Math.floor(totalTimeSong % 60).toString().padStart(2, '0')}`
            audioCurrentTimeElement.textContent = `${Math.floor(currentTimeSong / 60).toString().padStart(2, '0')}:${Math.floor(currentTimeSong % 60).toString().padStart(2, '0')}`;
            audioTimeline.value = `${(currentTimeSong / totalTimeSong) * 100000}`
        };

        repeatBtn.onclick = () => {
            repeatShufftleBtn(repeatBtn, "isRepeat")
        }

        shuffleBtn.onclick = () => {
            repeatShufftleBtn(shuffleBtn, "isShuffle")
        }
    }

    app.loadCurrentSong = () => {
        currentSong = app.currentSongFn();
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