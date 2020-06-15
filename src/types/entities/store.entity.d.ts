declare namespace AppEntity {
  // interface StoreType {
  //   id: number;
  //   name: string;
  // }

  // interface CustomerStore {
  //   id: number;
  //   customer: Customer;
  //   store: Store;
  // }

  type StoreStatus = 'deleted' | 'pending' | 'active' | 'blocked' | 'rejected';
  interface Store extends Timestamp {
    id: number;
    title: string;
    slug: string;
    description?: string;
    status: StoreStatus;
    owner: Customer;
  }

  interface StoreLocation {
    id: number;
    address: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    //   /**
    //    * New Your
    //    */
    //   // city: City
    //   /**
    //    * US
    //    */
    //   // country: Country
    store: Store;
  }

  interface Cousine {
    id: number;
    name: string;
    store: Store;
  }

  type ProductStatus = 'active' | 'deleted';
  interface Product {
    id: number;
    externalID: string;
    imageURL?: string;
    price: string;
    status: ProductStatus;
    store: Store;
    // currency: Currency;
  }

  interface ProductTranslation {
    id: number;
    title: string;
    description?: string;
    product: Product;
    language: Language;
  }
}
