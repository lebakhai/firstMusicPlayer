const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const contentElement = $('#content')
const footerElement = $('.footer');
const songTitleElement = $('.info-content .title');
const songArtistElement = $('.info-content .artist');
const songImageElement = $('.info .img');
const audioElement = $('#audio');
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
    var currentIndex = 2;
    app.isPlay = false;

    
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
            <div class="footer-like">
                <i class="fa-regular like-icon fa-heart"></i>
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
    }

    app.loadCurrentSong = () => {
        var currentSong = app.currentSongFn();
        songTitleElement.textContent = currentSong.title;
        songArtistElement.textContent = currentSong.artist;
        songImageElement.src = currentSong.image;
        audioElement.src = currentSong.music;
    }

    app.start = () => {
        app.handleEvents();
        app.loadCurrentSong()
        app.render();
    };
    
    app.start();
})


