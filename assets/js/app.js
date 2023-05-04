const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const contentElement = $('#content')
const footerElement = $('.footer');
const songTitleElement = $('.info-content .title');
const songArtistElement = $('.info-content .artist');
const songImageElement = $('.info .img');
const audioElement = $('#audio');
const playBtn = $('.songPlay.play');
const pauseBtn = $('.songPlay.pause');
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
    app.currentIndex = 1;
    
    app.currentSongFn = () => app.album[app.currentIndex];

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
        const infoElement = $('.info');
        const infoElementWidth = infoElement.offsetHeight;

        document.onscroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newInfoElementWidth = infoElementWidth - scrollTop;
            // console.log(infoElementWidth, scrollTop, newInfoElementWidth)
            // infoElement.style.height = newInfoElementWidth + "px";
        };

        playBtn.onclick = (e) => {
            contentElement.classList.add('play');
            audioElement.play();
        };
        pauseBtn.onclick = (e) => {
            contentElement.classList.remove('play');
            audioElement.pause();
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


