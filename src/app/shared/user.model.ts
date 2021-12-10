/* eslint-disable max-len */
export class UserModel {
  public email: string;
  public chefId?: string;
  public chefName?: string;
  public chefPic?: string;
  public chefLevel?: string;

  constructor(
    email: string,
    chefId?: string,
    chefName?: string,
    chefPic?: string,
    chefLevel?: string,
    ) {
      this.email = email;
      this.chefId = chefId;
      this.chefName = chefName;
      this.chefPic = chefPic;
      this.chefLevel = chefLevel;
    }

}

