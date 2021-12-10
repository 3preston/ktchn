/* eslint-disable no-var */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss'],
})
export class ProfileInfoComponent implements OnInit {

  form: FormGroup;
  @Input() name: string;
  @Input() id: string;
  @Input() bio: string;

  constructor(private modal: ModalController) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(this.name, {
        updateOn:'blur',
        validators: [Validators.required]
      }),
      bio: new FormControl(this.bio, {
        updateOn:'blur',
        validators: [Validators.required]
      })
    });
  }

  saveInfo() {
    const updatedName = this.form.value.name;
    const updatedBio = this.form.value.bio;
    this.modal.dismiss({
      updatedInfo: {
        name: updatedName,
        bio: updatedBio
      }
    });
  }

  exitModal() {
    this.modal.dismiss();
  }

}
