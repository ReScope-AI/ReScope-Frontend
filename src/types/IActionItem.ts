export interface IActionItem {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  assignee_to?: string | null;
}

export interface ICreateActionItem {
  title: string;
  description?: string;
  status: string;
  priority?: string;
  assignee_to?: string | null;
  session_id: string;
}
