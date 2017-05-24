import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';
import { ImagePicker } from '@ionic-native/image-picker';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  imageurlfrompicker: string = "";
  imageurlfromresizer: string = "";
  imagebase64: string = "";
  constructor(public navCtrl: NavController,
    private imageResizer: ImageResizer,
    public alertCtrl: AlertController,
    public imagePicker: ImagePicker) {
  }
  getImage() {
    let options = {
      maximumImagesCount: 3,
      width: 400,
      height: 400,
      quality: 90,
      outputType: 0
    };
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        this.imageurlfrompicker = results[i];
        let resizeoptions = {
          uri: results[i],
          folderName: 'demofolder',
          quality: 90,
          width: 1280,
          height: 1280
        } as ImageResizerOptions;
        this.imageResizer
          .resize(resizeoptions)
          .then((filePath: string) => {
            this.imageurlfromresizer = filePath;
            this.convertToBase64(filePath, 'image/png').then(
              data => {
                this.imagebase64 = data.toString();
              }
            );
          })
          .catch(e => console.log(e));
      }
    }, (err) => { });
  }

  convertToBase64(url, outputFormat) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function () {
        let canvas = <HTMLCanvasElement>document.createElement('CANVAS'),
          ctx = canvas.getContext('2d'),
          dataURL;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        canvas = null;
        resolve(dataURL);
      };
      img.src = url;
    });
  }
}
