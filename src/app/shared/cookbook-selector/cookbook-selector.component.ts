/* eslint-disable no-var */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { RecipeModel } from '../recipe.model';

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
  selector: 'app-cookbook-selector',
  templateUrl: './cookbook-selector.component.html',
  styleUrls: ['./cookbook-selector.component.scss'],
})
export class CookbookSelectorComponent {

  constructor(private modal: ModalController,
              private alert: AlertController) { }

  @Input('recipe') recipes: RecipeModel[];
  @Input('editMode') editMode = false;
  cookbookPic: any;

  cookbookFinished(form: NgForm) {
    if (form.value.cookbookName === '') {
      this.alert.create({
        header: 'Cookbook Name Missing!'
      }).then((alertEl) => {
        alertEl.present();
        return;
      });
    } else {
      this.modal.dismiss({
        cookbookData: {
          recipes: this.recipes,
          cookbookName: form.value.cookbookName,
          cookbookPic: this.cookbookPic
        }
      });
    }
  }

  recipeClicked(recipe: any) {
    recipe.isChecked = !recipe.isChecked;
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
    // this.form.patchValue({mainPic: imageFile});
    this.cookbookPic = imageFile;
  }

  exitCookbook() {
    this.modal.dismiss();
  }

}
