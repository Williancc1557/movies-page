"use client";

import { Chat } from "@/models/chat";
import { createContext, useContext, useState } from "react";

interface ChatContextProps {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}

const GlobalChatContext = createContext<any>({
  movies: [],
  setMovies: () => {},
});

export const GlobalChatWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  let [movies, setMovies] = useState<Chat[]>([]);

  return (
    <GlobalChatContext.Provider value={{ movies, setMovies }}>
      {children}
    </GlobalChatContext.Provider>
  );
};

export const useGlobalChatsContext = () => {
  return useContext(GlobalChatContext);
};
