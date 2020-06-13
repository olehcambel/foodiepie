import { Order } from '../../../entities/order.entity';

export class OrdersResDto implements Response.Paginate<Order> {
  count: number;
  data: Order[];
}
