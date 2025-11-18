import api from "../axios";

import type { List } from "../../types/List"

export const getLists = async (): Promise<List[]> => {
  const response = await api.get("/lists");
  return response.data as List[];
}

