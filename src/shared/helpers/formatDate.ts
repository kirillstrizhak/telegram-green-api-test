import dayjs from "dayjs";
import "dayjs/locale/ru";

export const formaDate = (timestamp: number) => {
  if (!timestamp) {
    return;
  }

  return dayjs.unix(timestamp).format("D MMM HH:mm");
};
