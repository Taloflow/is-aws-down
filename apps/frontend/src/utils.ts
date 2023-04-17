import { v4 as uuidv4 } from "uuid";

// Just in case we change how ID's are generated later
export const getUUID = (): string => {
  return uuidv4();
};
