import { Message } from "../chat/page";
import { User } from "../context/AppContext";

interface ChatMessageProps{
    selectedUser: string | null;
    messages: Message[] | null;
    loggedInUser: User | null;
}

const ChatMessage = ()=> {
    return (
        <>Chat message</>
    )
}

export default ChatMessage;