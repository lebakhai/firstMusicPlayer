const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
var footerElement = $('.footer');
var app;

const url = 'http://84.46.246.159:1153/api/data';
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
    
    app.start = () => {
        app.render();
    };
    
    app.start();
})


