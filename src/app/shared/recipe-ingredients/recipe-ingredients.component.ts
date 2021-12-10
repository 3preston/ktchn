/* eslint-disable object-shorthand */
/* eslint-disable prefer-const */
/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Input } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-recipe-ingredients',
  templateUrl: './recipe-ingredients.component.html',
  styleUrls: ['./recipe-ingredients.component.scss'],
})
export class RecipeIngredientsComponent {

  form: FormGroup;
  @Input() ingredients = [];
  editMode = false;
  editingIndex: any;

  constructor(private modal: ModalController) { }

  exitInfoEdit() {
    this.modal.dismiss();
  }

  addIngredient(form: NgForm) {
    const ingredient = form.value.ingredient;
    this.ingredients.push(ingredient);
    form.reset();
  }

  editIngredient(form: NgForm, index: any, ingredient: any) {
    this.editMode = true;
    this.editingIndex = index;
    form.setValue({
      ingredient: ingredient
    });
  }

  updateIngredient(form: NgForm) {
    this.ingredients[this.editingIndex] = form.value.ingredient;
    form.reset();
    this.editMode = false;
    this.editingIndex = null;
  }

  deleteIngredient(form: NgForm) {
    this.ingredients.splice(this.editingIndex, 1);
    form.reset();
    this.editMode = false;
    this.editingIndex = null;
  }

  saveInfo() {
    this.modal.dismiss(this.ingredients);
  }

  doReorder(event: any) {
    const itemMove = this.ingredients.splice(event.detail.from, 1)[0];
    this.ingredients.splice(event.detail.to, 0, itemMove);
    event.detail.complete();
  }

}
