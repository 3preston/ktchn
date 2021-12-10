/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-var */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';

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
  selector: 'app-recipe-story',
  templateUrl: './recipe-story.component.html',
  styleUrls: ['./recipe-story.component.scss'],
})
export class RecipeStoryComponent implements OnInit {

  form: FormGroup;
  @Input() story: string;
  @Input() mode: any;
  storyPic: any;
  editMode = false;

  constructor(private modal: ModalController) { }

  ngOnInit() {
    if (this.mode === 'storyEdit') {
      this.editMode = true;
    };
    this.form = new FormGroup({
      story: new FormControl(this.story, {
        updateOn:'blur'
      }),
      storyPic: new FormControl(null)
     });
  }

  saveRecipe() {
    this.modal.dismiss({
      storyData: {
        story: this.form.value.story,
        storyPic: this.storyPic
      }
    });
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
    this.form.patchValue({storyPic: imageFile});
    this.storyPic = imageFile;
  }

}
