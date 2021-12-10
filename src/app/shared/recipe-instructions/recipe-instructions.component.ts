/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IonReorderGroup } from '@ionic/angular';
import { ItemReorderEventDetail } from '@ionic/core';

@Component({
  selector: 'app-recipe-instructions',
  templateUrl: './recipe-instructions.component.html',
  styleUrls: ['./recipe-instructions.component.scss'],
})
export class RecipeInstructionsComponent implements OnInit {

  @Input() instructions = [];
  editMode = false;
  editingIndex: any;

  constructor(private modal: ModalController) { }

  ngOnInit() {
  }

  saveInfo() {
    this.modal.dismiss(this.instructions);
  }

  addInstruction(form: NgForm) {
    const newInstruction = form.value.instruction;
    this.instructions.push(newInstruction);
    form.reset();
  }

  deleteInstruction(form: NgForm) {
    this.instructions.splice(this.editingIndex, 1);
    form.reset();
    this.editMode = false;
  }

  editInstruction(form: NgForm, index: any, instruction: string) {
    this.editMode = true;
    this.editingIndex = index;
    form.setValue({
      instruction: instruction
    });
  }

  updateInstruction(form: NgForm) {
    this.instructions[this.editingIndex] = form.value.instruction;
    form.reset();
    this.editMode = false;
    this.editingIndex = null;
  }

  doReorder(event: any) {
    const itemMove = this.instructions.splice(event.detail.from, 1)[0];
    this.instructions.splice(event.detail.to, 0, itemMove);
    event.detail.complete();
  }

}
