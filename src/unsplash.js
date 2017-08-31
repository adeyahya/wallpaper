const request = require('superagent');
const https = require('https');
const fs = require('fs');
const wallpaper = require('wallpaper');
const path = require('path');
const settings = require('electron-settings');

class Unsplash {
	constructor(app_id) {
		this.app_id = app_id;
	}
	getRandom() {
    let self = this;
    fs.unlink(path.join(__dirname, `../${settings.get("filename.last")}`), function(){});
		request
			.get(`https://api.unsplash.com/photos/random?orientation=landscape&query=game&client_id=${this.app_id}`)
			.end((err, res) => {
				let date = new Date();
				let filename = date.getTime();
				filename = `${filename}.jpg`;
				let file = fs.createWriteStream(filename);
				let request = https.get(res.body.urls.full, function(response) {
				  response.pipe(file);
				});

				file.on('close', function() {
					wallpaper.set(path.join(__dirname, `../${filename}`), { scale: 'fill' }).then(() => {
						settings.set('filename', {
              last: filename,
            });

            console.log('done');

            let myNotification = new Notification('Title', {
              body: 'Lorem Ipsum Dolor Sit Amet'
            })

            setTimeout(function() {
              self.getRandom();
            }, 2000);
          });
				})
			})
	}
}

module.exports = Unsplash;
