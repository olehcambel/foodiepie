declare namespace Response {
  type Status = 'success' | 'failure';

  interface Success<T> {
    data: T;
    status: 'success';
  }

  interface Fail {
    status: 'failure';
    message: string;
    errors?: string[];
  }

  interface Paginate<T> {
    count: number;
    data: T[];
  }
}
