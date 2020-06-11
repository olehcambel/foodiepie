import { Courier } from '../../../entities/courier.entity';

export class CouriersResDto implements Response.Paginate<Courier> {
  count: number;
  data: Courier[];
}
