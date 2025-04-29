import { getSession } from "next-auth/react";
import { create } from "zustand";

type SyncWsStore = {
  socket: WebSocket | null;
  roomname: string;
  judgeOutputCallback: (event: Event) => void
  setJudgeOutputCallback: (callback: (event: Event) => void) => void
  connect: (url: string, roomname: string) => void;
  send: (data: string) => void;
};

export type Event = {
  event: string;
  content: string;
  language: string;
  token?: string;
  room_name?: string;
  input?: string;
  time_taken?: number;
}

export const useSyncWsStore = create<SyncWsStore>((set, get) => ({
  socket: null,
  roomname: "",
  setJudgeOutputCallback: (callback) => {
    set({ judgeOutputCallback: callback });
  },
  judgeOutputCallback: (event) => { },
  connect: async (url, roomname) => {
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
          room_name: roomname
        });
        ws.send(authMessage);
        console.log("Sent auth token");
      } else {
        console.warn("No token found in session");
      }
    };

    ws.onmessage = (event) => {
      console.log("message:", event.data);
      const parsedEvent: Event = JSON.parse(event.data)
      if (parsedEvent.event === "output") {
        const callback = get().judgeOutputCallback;
        callback(parsedEvent);
      }
    };

    set({ socket: ws, roomname: roomname });
  },

  send: (data) => {
    const ws = get().socket;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  },
}));
