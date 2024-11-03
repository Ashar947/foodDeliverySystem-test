export class ValidateDish {
  constructor(public readonly dishId: number) {}
  toString() {
    return JSON.stringify({
      dishId: this.dishId,
    });
  }
}
