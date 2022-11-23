export interface Cycle {
  id: string;
  task: string;
  countdownInMinutes: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}
