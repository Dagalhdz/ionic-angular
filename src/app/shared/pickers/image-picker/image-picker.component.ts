import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CameraResultType, CameraSource, Capacitor, Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {

  @Output() imagePicker = new EventEmitter<string | File>();
  @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;
  selectedImage: string;
  usarPicker = false;

  constructor(private platform: Platform ) { }

  ngOnInit() {
    console.log('Mobile', this.platform.is('mobile'));
    console.log('Hybrid', this.platform.is('hybrid'));
    console.log('IOS', this.platform.is('ios'));
    console.log('Android', this.platform.is('android'));
    console.log('Desktop', this.platform.is('desktop'));
    console.log(this.platform);

    if((this.platform.is('mobile') && !this.platform.is('hybrid')) || this.platform.is('desktop')){
      this.usarPicker = true;
    }
  }

  onPickImage(){
    if(!Capacitor.isPluginAvailable('Camera') || this.usarPicker){
      this.filePickerRef.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 100,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.DataUrl
    })
    .then(image => {
      this.selectedImage = image.dataUrl;
      this.imagePicker.emit(image.dataUrl);
    })
    .catch(err => {
      console.log(err);
      return false;
    })
  }

  onFileSelected(event: Event) {
    console.log(event);
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if(!pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.imagePicker.emit(pickedFile);
    }
    fr.readAsDataURL(pickedFile);
  }

}
