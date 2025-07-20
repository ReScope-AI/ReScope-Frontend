import { v4 as uuid } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TeamName {
  id: string;
  name: string;
}

export type State = {
  teams: TeamName[];
};

const initialTeams: TeamName[] = [];

export type Actions = {
  addTeam: (name: string) => void;
  removeTeam: (id: string) => void;
  setTeams: (updatedTeams: TeamName[]) => void;
};

export const useRetrospectiveStore = create<State & Actions>()(
  persist(
    (set) => ({
      teams: initialTeams,
      addTeam: (name: string) =>
        set((state) => ({
          teams: [...state.teams, { id: uuid(), name }]
        })),
      removeTeam: (id: string) =>
        set((state) => ({
          teams: state.teams.filter((team) => team.id !== id)
        })),
      setTeams: (updatedTeams: TeamName[]) => set({ teams: updatedTeams })
    }),
    { name: 'retrospective-store', skipHydration: true }
  )
);
