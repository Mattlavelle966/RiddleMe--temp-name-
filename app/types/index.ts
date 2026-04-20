export interface UserItem {
    id: string;
    username: string;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    body: string;
    createdAt: number;
}

export interface ChatWindowProps {
    conversationId: string | null;
    activeUser: UserItem | null;
    isOpen: boolean;
    onMenuToggle: () => void;
    isDesktop: boolean;
}

export interface ConnectionWindowProps {
    users: UserItem[];
    userStatus: Record<string, string>;
    isOpen: boolean;
    activeUser: UserItem | null;
    toggleMenu: () => void;
    onConnect: (userId: string) => void;
    onMessage: (user: UserItem) => void;
    isDesktop: boolean;
}

export interface MainPanelProps {
    visible: boolean;
    callerName: string;
    callId: string;
    onAccept: () => void;
    onDecline: () => void;
    isOpen: boolean;
    activeConversationId: string | null;
    activeChatUser: UserItem | null;
    onMenuToggle: () => void;
    isDesktop: boolean;
}