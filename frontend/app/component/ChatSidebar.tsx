import { User } from "../context/AppContext";

interface ChatSidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean)=> void;
    showAllUsers: boolean;
    setShowAllUsers: (show: boolean | ((prev:boolean) => boolean)) => void;
    users: User[] | null
    loggedInUser: User | null;
    chats: any[]| null;
    setSelectedUser: (userId: string | null) => void;
    selectedUser:  string | null;
    handleLogout: ()=> void;
}

const ChatSidebar =({sidebarOpen, setSidebarOpen, showAllUsers, setShowAllUsers,
    chats, selectedUser, setSelectedUser, handleLogout
}: ChatSidebarProps)=> {
    return(
        <div>
            Chat SIdebar
        </div>
    )
}

export default ChatSidebar;