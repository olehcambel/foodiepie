declare namespace AppEntity {
  interface StoreType {
    id: number;
    name: string;
  }

  type StoreStatus = 'deleted' | 'pending' | 'active' | 'blocked' | 'rejected';
  interface Store {
    id: number;
    name: string;
    slug: string;
    description?: string;
    status: StoreStatus;
    storeType: StoreType;
  }

  type StoreAddressStatus = 'active' | 'deleted'; // blocked
  interface StoreAddress extends Timestamp {
    id: number;
    latitude: number;
    longitude: number;
    address: string;
    /**
     * New Your
     */
    // city: City
    /**
     * US
     */
    // country: Country
    postalCode: string;
    rating?: number;
    status: StoreAddressStatus;
    store: Store;
  }

  type ProductStatus = 'active' | 'deleted';
  interface Product {
    id: number;
    externalID?: string;
    imageURL?: string;
    price: string;
    status: ProductStatus;
    storeAddress: StoreAddress;
    currency: Currency;
  }

  interface ProductTranslation {
    id: number;
    title: string;
    description?: string;
    product: Product;
  }
}
