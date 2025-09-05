import {createContext, useContext, useState} from "react";

export const ChatIndex = createContext();

export function ChatIndexProvider({ children }) {
  const [chatIndex, setChatIndex] = useState({});
  return (
    <ChatIndex.Provider value={{ chatIndex, setChatIndex }}>
      {children}
    </ChatIndex.Provider>
  );
}
