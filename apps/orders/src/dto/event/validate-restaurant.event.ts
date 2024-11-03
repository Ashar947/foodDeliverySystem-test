export class ValidateRestaurantEvent {
  constructor(public readonly restaurantId: number) {}
  toString() {
    return JSON.stringify({
      restaurantId: this.restaurantId,
    });
  }
}
