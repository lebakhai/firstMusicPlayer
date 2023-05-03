const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const footerElement = $('.footer');

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
    app.currentIndex = 0;
    app.render = () => {
        app.defineProperties = function() {
            app.defineProperty(app, 'currentSong', {
                get : function() {
                    return this.album[this.currentIndex];
                }
            });
        }
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
    }

    app.start = () => {
        app.render();
        app.handleEvents();
    };
    
    app.start();
})


