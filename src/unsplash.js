const request = require('superagent');
const https = require('https');
const fs = require('fs');
const wallpaper = require('wallpaper');
const path = require('path');
const settings = require('electron-settings');
const shell = require('electron').shell
const remote = require('electron').remote
const app = remote.app

if (!settings.get('timer.interval')) {
  settings.set('timer', {
    interval: 1,
  });
}

settings.set('global', {
  photoOrder: 0,
  photoMaxCount: 0,
  photos: []
})

class Unsplash {
	constructor(app_id) {
		this.app_id = app_id;
  }

  getPhotos(count = 30) {
    // get random photos
    return new Promise((resolve, reject) => {
      request
      .get(`https://api.unsplash.com/photos/random?orientation=landscape&count=${count}&client_id=${this.app_id}`)
      .end((err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res.body);
      })
    })
  }

  changeWallpaper() {
    let self = this
    let photoOrder = settings.get('global.photoOrder')
    let photoMaxCount = settings.get('global.photoMaxCount')
    let photos = settings.get('global.photos')

    // create temporary directory if not exist
    if (!fs.existsSync(app.getPath('home') + '/wallsplash/')){
      fs.mkdirSync(app.getPath('home') + '/wallsplash/');
    }
    // delete last wallpaper
    fs.unlink(app.getPath('home') + "/wallsplash/" + `${settings.get("filename.last")}`, function(){});

    let date = new Date();
    let filename = date.getTime();
    filename = `${filename}.jpg`;
    let file = fs.createWriteStream(`${app.getPath('home') + '/wallsplash'}/${filename}`);
    let request = https.get(photos[photoOrder].urls.full, function(response) {
      response.pipe(file);
    });

    file.on('close', function() {
      wallpaper.set(app.getPath('home') + "/wallsplash/" + `${filename}`, { scale: 'fill' }).then(() => {
        settings.set('filename', {
          last: filename,
        });

        settings.set('global', {
          photoOrder: settings.get('global.photoOrder') + 1,
          photoMaxCount: settings.get('global.photoMaxCount'),
          photos: settings.get('global.photos')
        })

        self.sendNotification();

        setTimeout(function() {
          self.getRandom();
        }, (60000 * Number(settings.get('timer.interval'))));
      });
    })
  }

  sendNotification() {
    let photoOrder = settings.get('global.photoOrder')
    let photoMaxCount = settings.get('global.photoMaxCount')
    let photos = settings.get('global.photos')

    let myNotification = new Notification('Wallpaper Changed', {
      body: `Photo by ${photos[Number(photoOrder)].user.name}`,
      icon: photos[Number(photoOrder)].user.profile_image.medium
    })

    myNotification.addEventListener('click', function() {
      shell.openExternal(photos[Number(photoOrder)].user.links.html)
    })
  }

	getRandom() {
    let self = this;
    let photoOrder = settings.get('global.photoOrder')
    let photoMaxCount = settings.get('global.photoMaxCount')
    let photos = settings.get('global.photos')

    if ((photoOrder - 1) == photoMaxCount || photos.length == 0) {
      this.getPhotos()
        .then(res => {
          settings.set('global', {
            photoOrder: 0,
            photoMaxCount: res.length,
            photos: res
          })
          self.changeWallpaper();
        }).catch(err => {
          setTimeout(function() {
            self.getRandom();
          }, (60000 * Number(settings.get('global.interval'))));
        })
      return;
    } else {
      self.changeWallpaper();
      return;
    }
	}
}

module.exports = Unsplash;
