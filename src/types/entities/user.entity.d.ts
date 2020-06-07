declare namespace AppEntity {
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
    rating?: number;
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
}
