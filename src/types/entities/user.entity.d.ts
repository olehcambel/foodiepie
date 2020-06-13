declare namespace AppEntity {
  // https://my.vertabelo.com/model/irz4MeTvVTehhaqsm35pN1PaoI1Lg4lg

  type UserType = 'customer' | 'courier' | 'manager';

  type CourierStatus =
    | 'deleted'
    | 'pending'
    | 'active'
    | 'blocked'
    | 'rejected';
  interface Courier extends Timestamp {
    id: number;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    passwordSalt: string;
    imageURL?: string;
    description?: string;
    status: CourierStatus;
    language: Language;
  }

  type CustomerStatus = 'deleted' | 'active' | 'blocked';
  interface Customer extends Timestamp {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
    passwordSalt: string;
    imageURL?: string;
    description?: string;
    status: CustomerStatus;
    language: Language;
  }

  type EmployeeStatus = 'active' | 'deleted';
  interface Manager extends Timestamp {
    id: number;
    status: EmployeeStatus;
    firstName?: string;
    lastName?: string;
    email: string;
    passwordHash: string;
    passwordSalt: string;
    // permission: string;
  }

  type Fields = 'id' | 'email' | 'passwordHash' | 'passwordSalt';
  // take common fields between all user types
  type User = Pick<Customer, Fields> &
    Pick<Courier, Fields> &
    Pick<Manager, Fields>;
  //  & { type: UserType; };
}
