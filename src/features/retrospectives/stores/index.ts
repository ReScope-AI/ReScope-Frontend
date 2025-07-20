import { v4 as uuid } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TeamName {
  id: string;
  name: string;
}

export interface SprintName {
  id: string;
  name: string;
}

export interface Team {
  _id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Sprint {
  _id: string;
  name: string;
  start_date: string;
  end_date: string;
  created_by: string;
}

export interface RetroSession {
  id: string;
  name: string;
  team: Team;
  sprint: Sprint;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export type RetroSpectiveState = {
  teams: TeamName[];
  retroSessions: RetroSession[];
  sprints: SprintName[];
};

const initialTeams: TeamName[] = [];
const initialRetroSessions: RetroSession[] = [];
const initialSprints: SprintName[] = [];

export type Actions = {
  addTeam: (name: string) => void;
  removeTeam: (id: string) => void;
  setTeams: (updatedTeams: TeamName[]) => void;
  setRetroSessions: (updatedRetroSessions: RetroSession[]) => void;
  addSprint: (name: string) => void;
  removeSprint: (id: string) => void;
  setSprints: (updatedSprints: SprintName[]) => void;
};

export const useRetrospectiveStore = create<RetroSpectiveState & Actions>()(
  persist(
    (set) => ({
      teams: initialTeams,
      retroSessions: initialRetroSessions,
      sprints: initialSprints,
      addTeam: (name: string) =>
        set((state) => ({
          teams: [...state.teams, { id: uuid(), name }]
        })),
      removeTeam: (id: string) =>
        set((state) => ({
          teams: state.teams.filter((team) => team.id !== id)
        })),
      setTeams: (updatedTeams: TeamName[]) => set({ teams: updatedTeams }),
      setRetroSessions: (updatedRetroSessions: RetroSession[]) =>
        set({ retroSessions: updatedRetroSessions }),
      addSprint: (name: string) =>
        set((state) => ({
          sprints: [...state.sprints, { id: uuid(), name }]
        })),
      removeSprint: (id: string) =>
        set((state) => ({
          sprints: state.sprints.filter((sprint) => sprint.id !== id)
        })),
      setSprints: (updatedSprints: SprintName[]) =>
        set({ sprints: updatedSprints })
    }),
    { name: 'retrospective-store', skipHydration: true }
  )
);
