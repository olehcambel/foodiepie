import { Store } from '../../../entities/store.entity';

export class StoresResDto implements Response.Paginate<Store> {
  count: number;
  data: Store[];
}
