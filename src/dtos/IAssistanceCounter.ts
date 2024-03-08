export interface IAssistanceCounter {
  [status: string]: {
    value: string;
    label: string;
    count: number;
  };
}
