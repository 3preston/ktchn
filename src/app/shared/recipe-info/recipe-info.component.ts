/* eslint-disable no-var */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable prefer-const */
/* eslint-disable guard-for-in */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/dot-notation */
import { ThrowStmt } from '@angular/compiler';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, PickerController } from '@ionic/angular';
import { PickerOptions } from '@ionic/core';
import { present } from '@ionic/core/dist/types/utils/overlays';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: 'app-recipe-info',
  templateUrl: './recipe-info.component.html',
  styleUrls: ['./recipe-info.component.scss'],
})

export class RecipeInfoComponent {

  form: FormGroup;
  @Input() name: string;
  @Input() description: string;
  @Input() hours: string;
  @Input() minutes: string;
  @Input() mode: any;
  @Input() category: any;
  mainPic: any;
  recipeType = [];

  availableHours: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'];
  availableMinutes: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
  selectedHours = '';
  selectedMinutes = '';

  constructor(private modal: ModalController,
              private picker: PickerController) { }

  ionViewWillEnter() {
    this.form = new FormGroup({
      name: new FormControl(this.name, {
        updateOn:'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(this.description, {
        updateOn:'blur',
        validators: [Validators.required]
      }),
      recipeType: new FormControl(this.category, {
        updateOn:'blur',
        validators: [Validators.required]
      }),
      mainPic: new FormControl(null)
    });
    this.selectedHours = this.hours;
    this.selectedMinutes = this.minutes;
  }

  saveRecipe() {
    this.modal.dismiss({
      recipeData: {
        name: this.form.value['name'],
        description: this.form.value['description'],
        hours: this.selectedHours,
        minutes: this.selectedMinutes,
        recipeType: this.category,
        mainPic: this.mainPic
      }
    });
  }

  exitRecipe() {
    this.modal.dismiss();
  }

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
         imageFile = base64toBlob(
          imageData.replace('data:image/jpeg;base64,', ''),
          'image/jpeg');
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.form.patchValue({mainPic: imageFile});
    this.mainPic = imageFile;
  }

  typeChosen(event: any) {
    this.category = event.detail.value;
  }

  async selectHours() {
    let pickerOptions: PickerOptions = {
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler:(value: any) => {}
        }
      ],
      columns:[
        {
          name:'Hours',
          options : this.getHoursOptions()
        }
      ]
    };
    const picker = await this.picker.create(pickerOptions);
    picker.present();
    picker.onDidDismiss().then(data => {
      this.selectedHours = data.data.Hours.text;
    });
  }

  async selectMinutes() {
    let pickerOptions: PickerOptions = {
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler:(value: any) => {}
        }
      ],
      columns:[
        {
          name:'Minutes',
          options : this.getMinutesOptions()
        }
      ]
    };
    const picker = await this.picker.create(pickerOptions);
    picker.present();
    picker.onDidDismiss().then(data => {
      this.selectedMinutes = data.data.Minutes.text;
    });
  }

  getHoursOptions() {
    let options = [];
    this.availableHours.forEach(x => {
      options.push({text:x, value:x});
    });
    return options;
  }

  getMinutesOptions() {
    let options = [];
    this.availableMinutes.forEach(x => {
      options.push({text:x, value:x});
    });
    return options;
  }

}
