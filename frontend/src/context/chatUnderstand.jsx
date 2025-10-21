import {createContext, useContext, useState} from "react";

export const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [chatSessions, setChatSessions] = useState({});
  return (
    <ChatContext.Provider value={{ chatSessions, setChatSessions }}>
      {children}
    </ChatContext.Provider>
  );
}
