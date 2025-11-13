export interface Horse {
  id: string;
  name: string;
  color: string;
  condition: number;
}

export interface HorsesState {
  list: Horse[];
}