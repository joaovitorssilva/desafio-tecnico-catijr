import type { Task } from "./Task"

export type List = {
  id: BigInt;
  name: string;
  tasks: Task[];
}