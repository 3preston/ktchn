/* eslint-disable max-len */


export class RecipeModel {
  public name?: string;
  public description?: string;
  public minutes?: string;
  public hours?: string;
  public ingredients?: [];
  public instructions?: [];
  public mainPic?: any;
  public story?: any;
  public storyPic?: any;
  public id?: any;
  public chefName?: any;
  public chefId?: any;
  public isChecked?: any;
  public recipeType?: any;
  public reccomendations?: any;

  constructor(
    name?: string,
    description?: string,
    minutes?: string,
    hours?: string,
    ingredients?: [],
    instructions?: [],
    mainPic?: any,
    story?: any,
    storyPic?: any,
    id?: any,
    chefName?: any,
    chefId?: any,
    isChecked?: any,
    recipeType?: any,
    reccomendations?: any
    ) {
      this.name = name;
      this.description = description;
      this.minutes = minutes;
      this.hours = hours;
      this.ingredients = ingredients;
      this.instructions = instructions;
      this.mainPic = mainPic;
      this.story = story;
      this.storyPic = storyPic;
      this.id = id;
      this.chefName = chefName;
      this.chefId = chefId;
      this.isChecked = isChecked;
      this.recipeType = recipeType;
      this.reccomendations = reccomendations;
    }

}

