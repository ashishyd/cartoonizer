export interface Auth {
  session_active_until: string;
  username: string; // References user_job.id
}
