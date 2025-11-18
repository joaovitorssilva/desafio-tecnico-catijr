export type Task = {
  id: BigInt;
  name: string;
  description?: string | null;
  priority: string;
  listId: string;
  expectedFinishDate?: Date | null;
  finishDate: boolean;  
}
