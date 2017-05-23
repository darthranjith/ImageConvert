import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  processedImage: any = '';
  @ViewChild('mainRef') mainImageRef: ElementRef;
  constructor(public navCtrl: NavController,
    private imageResizer: ImageResizer,
    public alertCtrl: AlertController) {

  }
  ionViewDidLoad() {
    let options = {
      uri: this.mainImageRef.nativeElement.src,
      folderName: 'demofolder',
      quality: 90,
      width: 1280,
      height: 1280
    } as ImageResizerOptions;
    this.imageResizer
      .resize(options)
      .then((filePath: string) => {
        this.convertToBase64(filePath, 'image/png').then(
          data => {
            console.log(data);
            let alert = this.alertCtrl.create({
              title: data.toString(),
              buttons: ['Dismiss']
            });
            alert.present();
          }
        );
        console.log('FilePath', filePath)
        let alert = this.alertCtrl.create({
          title: filePath,
          buttons: ['Dismiss']
        });
        alert.present();
      })
      .catch(e => console.log(e));
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
