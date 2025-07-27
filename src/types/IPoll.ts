export interface IPollState {
  poll: IPoll | null;
  setPoll: (poll: IPoll) => void;
  clearPoll: () => void;
}

export interface IPoll {
  _id: string;
  text: string;
  session_id: string;
  criterion: string;
  options: string[];
}

export interface ICreatePollQuestion extends Omit<IPoll, '_id'> {
  text: string;
  session_id: string;
  criterion: 'communication' | 'quality' | 'process' | 'estimate' | 'timeBound';
  options: string[];
}
