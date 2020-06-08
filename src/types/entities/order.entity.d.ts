declare namespace AppEntity {
  type OrderStatus = 'scheduled' | 'active' | 'delivered' | 'cancelled';
  interface Order extends Timestamp {
    id: number;
    description?: string;
    scheduledDate: Date;
    deliveredAt?: Date;
    /** TODO: should be invoice, invoiceItem, receipt entities */
    isPaid: boolean;
    // paidAt?: Date;
    price: string;
    status: OrderStatus;
    // orderStatus: OrderStatus; // orderStatusID
    currency: Currency;
    storeAddress: StoreAddress;
    customer: Customer;
    courier?: Courier;
  }

  interface OrderItem {
    id: number;
    price: string;
    quantity: number;
    product: Product;
    order: Order;
  }

  // interface Invoice {
  //   id: number;
  //   isPaid: boolean;
  //   totalPrice: number;
  //   createdAt: Date;
  //   order: Order;
  //   receipt?: Receipt;
  //   currency: Currency;
  // }

  // interface InvoiceItem {
  //   id: number;
  //   invoice: Invoice;
  //   product: Product;
  //   quantity: number;
  // }

  //   type OrderAddressType = 'delivery' | 'pickup' | 'other';
  interface OrderAddress {
    id: number;
    latitude: number;
    longitude: number;
    address: string;
    instructions?: string;
    details?: string;
    // type: OrderAddressType;
    contactPerson?: string;
    contactPhone?: string;
    order: Order;
  }

  //  We may need to make two or more deliveries per order
  // interface Delivery {
  //   id: number
  //   startedAt: Date
  //   finishedAt?: Date
  //   notes?: string
  //   order: Order
  //   courier?: Courier
  // }
}
