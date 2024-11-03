import { UserTypesEnum } from '@app/common/constants/roleTypes.enum';

export class CreateRestaurantAdminEvent {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly userType: UserTypesEnum,
  ) {}
  toString() {
    return JSON.stringify({
      name: this.name,
      email: this.email,
      password: this.password,
      userType: this.userType,
    });
  }
}
