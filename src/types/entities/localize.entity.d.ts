declare namespace AppEntity {
  // type UserType = 'customer';

  interface Timestamp {
    createdAt: Date;
    updatedAt: Date;
  }

  interface Language {
    id: number;
    code: string;
  }

  //   SELECT p.id, p.price, pt.product_name
  // FROM product p
  //          INNER JOIN product_translation pt ON pt.product_non_trans_id = p.id
  // WHERE pt.language_id = 1

  interface Currency {
    id: number;
    code: string;
  }

  //   type AccountStatus = 'active' | 'blocked' | 'deleted';

  //   interface Customer {
  //     id: number;
  //     // type: 'Customer';
  //     name: string;
  //     email: string;
  //     image_url?: string;
  //     description?: string;
  //     locale: Language;
  //     // phoneNumber: { number: string; countryCode?: string };
  //     // paymentMethod?: string; // paymentMethods {CASH, CREDIT_CARD - maxAmount: 1000, isDefault: bool}
  //     // birthday?: string;
  //     status: AccountStatus;
  //   }

  //   interface Courier {
  //     id: number;
  //     firstName: string;
  //     lastName: string;
  //     phone: string;
  //     email: string;
  //     hash: string;
  //     salt: string;
  //     locale: Language;
  //     status: AccountStatus;
  //   }

  //   interface Order {
  //     id: number;
  //     description?: string;
  //     scheduledTime?: Date | number;
  //     addresses: OrderAddress[];
  //     state: OrderState;
  //   }

  //   interface OrderAddress {
  //     id: number;
  //     // i18n
  //     title: string;
  //     value?: string;
  //     type: OrderAddressType;
  //   }

  //   interface OrderCharge {
  //     charge_type: 'subtotal'; // tax | delivery_fee | subtotal
  //     price: '2496';
  //     formatted_price: '$24.96';
  //   }

  //   interface Address {
  //     id: number;

  //     /**
  //      * 327 West 42nd Street, New York, NY 10036
  //      */
  //     address: string;

  //     /**
  //      * 327 West 42nd Street
  //      */
  //     streetAddress: string;

  //     /**
  //      * New Your
  //      */
  //     city: string;
  //     /**
  //      * US
  //      */
  //     country: string;

  //     /**
  //      * 10036
  //      */
  //     postalCode: string;

  //     /**
  //      * NY
  //      */
  //     region: string;
  //     // float64
  //     latitude: number;
  //     // float64
  //     longitude: number;

  //     ratingInfo?: number;
  //   }

  //   type StoreType = 'restaurant' | 'shop' | 'other';
  //   interface Store {
  //     id: number;
  //     type: StoreType;
  //     // kinda main account and related users (?)
  //     // add work hours
  //   }

  //   interface MenuItem {
  //     id: number;
  //     // title: string;
  //     // description?: string;
  //     image_url?: string;
  //     // float64
  //     price: string;
  //     currency_code: string;
  //     external_id?: string;
  //   }

  //   interface MenuItemTranslate {
  //     id: number;
  //     menuItemId: number;
  //     title: string;
  //     description?: string;
  //   }
}
