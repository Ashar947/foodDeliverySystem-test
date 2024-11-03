export class OrderCreatedEvent {
  constructor(
    public readonly orderId: number,
    public readonly userId: number,
    public readonly userName: string,
    public readonly orderStatus: string,
    public readonly restaurantName: string,
    public readonly totalOrderAmount: number,
  ) {}
  toString() {
    return JSON.stringify({
      orderId: this.orderId,
      userId: this.userId,
      userName: this.userName,
      orderStatus: this.orderStatus,
      restaurantName: this.restaurantName,
      totalOrderAmount: this.totalOrderAmount,
    });
  }
}
