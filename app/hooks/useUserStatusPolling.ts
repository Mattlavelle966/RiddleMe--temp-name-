import { useEffect } from "react";
import { getUserStatus } from "../lib/api";

type UserItem = {
  id: string;
  username: string;
};

type SetUserStatus = React.Dispatch<
  React.SetStateAction<Record<string, string>>
>;

export function useUserStatusPolling(users: UserItem[], token: string | null, setUserStatus: SetUserStatus) {
  async function checkStatus(userId: string) {
    try {
      const data = await getUserStatus(userId);

      setUserStatus((prev) => ({
        ...prev,
        [userId]: data.online ? "online" : "offline",
      }));
    } catch {
      setUserStatus((prev) => ({
        ...prev,
        [userId]: "error",
      }));
    }
  }

  useEffect(() => {
    if (!token || users.length === 0) return;

    users.forEach((user) => {
      checkStatus(user.id);
    });

    const interval = setInterval(() => {
      users.forEach((user) => {
        checkStatus(user.id);
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [token, users]);
}
