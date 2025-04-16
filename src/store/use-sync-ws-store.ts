import { getSession } from "next-auth/react";
import { create } from "zustand";

type SyncWsStore = {
  socket: WebSocket | null;
  connect: (url: string) => void;
  send: (data: string) => void;
};

export const useSyncWsStore = create<SyncWsStore>((set, get) => ({
  socket: null,
  connect: async (url) => {
    const user = await getSession();
    const token = user?.user.token;
  
    const ws = new WebSocket(url);
  
    ws.onopen = () => {
      console.log("connected");
  
      // Send auth message as JSON
      if (token) {
        const authMessage = JSON.stringify({
          event: "auth",
          token: token,
        });
        ws.send(authMessage);
        console.log("Sent auth token");
      } else {
        console.warn("No token found in session");
      }
    };
  
    ws.onmessage = (event) => {
      console.log("message:", event.data);
    };
  
    set({ socket: ws });
  },
  
  send: (data) => {
    const ws = get().socket;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  },
}));
