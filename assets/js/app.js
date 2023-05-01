const url = 'http://84.46.246.159:1153/api/data';
const options = {
	method: 'GET',
	headers: {
		"Content-Type": "application/json",
	}
};

fetch(url, options)
.then((data) => data.json())
.then(data => console.log(data.album))