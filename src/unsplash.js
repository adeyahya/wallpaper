const request = require('superagent');
const https = require('https');
const fs = require('fs');
const wallpaper = require('wallpaper');
const path = require('path');
const settings = require('electron-settings');
const shell = require('electron').shell
const remote = require('electron').remote
const app = remote.app
const systemPreferences = remote.systemPreferences;

console.log(systemPreferences);

if (!settings.get('global.interval')) {
  settings.set('global', {
    interval: 10,
  });
}

class Unsplash {
	constructor(app_id) {
		this.app_id = app_id;
	}
	getRandom() {
    let self = this;

    if (!fs.existsSync(app.getPath('temp'))){
      fs.mkdirSync(app.getPath('temp'));
    }

    fs.unlink(app.getPath('temp') + "/" + `${settings.get("filename.last")}`, function(){});
		request
			.get(`https://api.unsplash.com/photos/random?orientation=landscape&query=games&client_id=${this.app_id}`)
			.end((err, res) => {
        if (err) {
          setTimeout(function() {
            self.getRandom();
          }, (60000 * Number(settings.get('global.interval'))));
          return;
        }
				let date = new Date();
				let filename = date.getTime();
				filename = `${filename}.jpg`;
				let file = fs.createWriteStream(`${app.getPath('temp')}/${filename}`);
        console.log(res.body)
				let request = https.get(res.body.urls.full, function(response) {
				  response.pipe(file);
				});

				file.on('close', function() {
					wallpaper.set(app.getPath('temp') + "/" + `${filename}`, { scale: 'fill' }).then(() => {
						settings.set('filename', {
              last: filename,
            });

            console.log('done');

            let myNotification = new Notification('Wallpaper Changed', {
              body: `Thanks to: ${res.body.user.first_name}`,
              icon: res.body.user.profile_image.medium
            })

            myNotification.addEventListener('click', function() {
              shell.openExternal(res.body.user.links.html)
            })

            setTimeout(function() {
              self.getRandom();
            }, (60000 * Number(settings.get('global.interval'))));
          });
				})
			})
	}
}

module.exports = Unsplash;
