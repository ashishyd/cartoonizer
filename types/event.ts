export interface Event {
  id: bigint;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  show_registration: boolean;
  per_user_limit: number;
}
