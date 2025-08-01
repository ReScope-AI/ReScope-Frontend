export interface ISprint {
  _id: string;
  name: string;
  start_date: string;
  end_date: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}
export interface ICreateRetroSession {
  name: string;
  team_id: string;
  sprint_id: string;
  end_date: string;
}

export interface IInviteToRetro {
  session_id: string;
  email: string[];
}

export interface IRetroSession {
  _id: string;
  retro_name: string;
  end_date: string;
  team_id: string;
  sprint_id: string;
  name: string;
  created_by: string;
  isDelete: boolean;
  updated_by: string;
  created_at: string;
  updated_at: string;
  questions: IQuestion[];
  actionItems: string[];
  sprint: ISprint;
  plans: IPlan[];
}

export interface IQuestion {
  _id: string;
  text: string;
  session_id: string;
  criterion: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  options: IOption[] | [];
  votes: string[];
}

export interface IOption {
  _id: string;
  text: string;
  order: number;
  question_id: string;
  created_at: string;
  updated_at: string;
}

export interface IPlan {
  _id: string;
  category_id: string;
  position: number;
  text: string;
  category: ICategory;
}

export interface ICategory {
  _id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// export interface ICreatePollQuestion extends Omit<IQuestion, '_id' | 'votes' | 'created_by' | 'updated_by' | 'created_at' | 'updated_at'> {
//   text: string;
//   session_id: string;
//   criterion: 'communication' | 'quality' | 'process' | 'estimate' | 'timeBound';
//   options: string[];
// }
