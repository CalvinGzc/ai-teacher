import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useChatStore = create(
  persist(
    (set, get) => ({
      conversations: [{ id: 'default', messages: [] }],
      currentConversationId: 'default',

      addMessage: (message) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === state.currentConversationId
              ? { ...conv, messages: [...conv.messages, message] }
              : conv
          ),
        }));
      },

      createNewConversation: () => {
        const newId = `conv-${Date.now()}`;
        set((state) => ({
          conversations: [
            ...state.conversations,
            { id: newId, messages: [] }
          ],
          currentConversationId: newId,
        }));
      },

      clearCurrentConversation: () => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === state.currentConversationId
              ? { ...conv, messages: [] }
              : conv
          ),
        }));
      },
    }),
    {
      name: 'chat-storage',
    }
  )
);

export default useChatStore; 