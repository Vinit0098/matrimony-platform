"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import Link from "next/link";

let socket: Socket;
const EMOJIS = ["❤️", "😂", "😮", "😢", "👍", "🙏"]; 

export default function Chat() {
  const params = useParams();
  const router = useRouter();
  const receiverId = params.id as string;
  
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [activeMessage, setActiveMessage] = useState<string | null>(null); 
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
      return;
    }
    setCurrentUserId(userId);

    // 1. Initialize Socket Connection First
    socket = io("http://localhost:3001");
    socket.emit("register", userId);

    // 2. Fetch Chat History
    fetch(`http://localhost:3001/chat/${userId}/${receiverId}`)
      .then(res => res.json())
      .then(data => {
        setMessages(data);
        
        // NEW: Tell the backend we just read all their old messages!
        socket.emit("markAsRead", {
          senderId: receiverId, 
          receiverId: userId,   
        });
      })
      .catch(err => console.error(err));

    // Listen for new incoming messages
    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
      
      // NEW: If we are actively on this screen and they send a message, mark it read instantly
      if (message.senderId === receiverId) {
        socket.emit("markAsRead", {
          senderId: receiverId,
          receiverId: userId,
        });
      }
    });

    // Listen for emojis
    socket.on("messageReacted", (updatedMessage) => {
      setMessages((prev) => 
        prev.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg)
      );
    });

    // NEW: Listen for the other person reading OUR messages
    socket.on("messagesRead", ({ readerId }) => {
      if (readerId === receiverId) {
        setMessages((prev) => 
          prev.map(msg => 
            // Update all the messages we sent to them to show as 'read'
            msg.senderId === userId ? { ...msg, isRead: true } : msg
          )
        );
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [receiverId, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: any) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUserId) return;

    socket.emit("sendMessage", {
      senderId: currentUserId,
      receiverId: receiverId,
      content: inputText,
    });
    setInputText("");
  };

  const sendReaction = (messageId: string, emoji: string) => {
    socket.emit("addReaction", {
      messageId,
      reaction: emoji,
      receiverId,
    });
    setActiveMessage(null); 
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 p-4 md:p-8">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-[85vh]">
        
        <div className="p-4 border-b border-gray-200 bg-white rounded-t-xl flex justify-between items-center shadow-sm z-20">
          <h2 className="text-xl font-bold text-gray-800">Direct Message</h2>
          <Link href="/matches">
            <button className="text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-medium">
              Back to Matches
            </button>
          </Link>
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-5">
          {messages.length === 0 ? (
            <p className="text-center text-gray-400 mt-10">No messages yet. Say hi! 👋</p>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === currentUserId;
              
              return (
                <div key={msg.id} className={`flex flex-col relative w-full ${isMe ? 'items-end' : 'items-start'}`}>
                  
                  <div 
                    onClick={() => setActiveMessage(activeMessage === msg.id ? null : msg.id)}
                    className={`max-w-[75%] px-4 py-2 rounded-2xl cursor-pointer relative flex flex-col ${
                      isMe 
                        ? 'bg-rose-500 text-white rounded-br-sm' 
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    <p>{msg.content}</p>
                    
                    {/* NEW: The Read Receipt Checkmarks */}
                    {isMe && (
                      <div className="self-end mt-1 flex items-center justify-end -mr-1">
                        {msg.isRead ? (
                          <span className="text-blue-300 font-bold text-xs tracking-tighter" title="Read">✓✓</span>
                        ) : (
                          <span className="text-rose-200 font-bold text-xs" title="Delivered">✓</span>
                        )}
                      </div>
                    )}

                    {msg.reaction && (
                      <div className={`absolute -bottom-3 ${isMe ? 'right-2' : 'left-2'} bg-white border border-gray-200 rounded-full px-1.5 shadow-sm text-sm z-10`}>
                        {msg.reaction}
                      </div>
                    )}
                  </div>

                  {activeMessage === msg.id && (
                    <div className={`absolute -top-10 ${isMe ? 'right-0' : 'left-0'} bg-white border border-gray-200 shadow-lg rounded-full px-3 py-2 flex gap-2 z-20 transition-all`}>
                      {EMOJIS.map(emoji => (
                        <button 
                          key={emoji} 
                          onClick={() => sendReaction(msg.id, emoji)}
                          className="hover:scale-125 transition-transform text-lg"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}

                </div>
              );
            })
          )}
          <div ref={messagesEndRef} /> 
        </div>

        <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200 rounded-b-xl flex gap-2 z-20">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..." 
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-gray-50"
          />
          <button 
            type="submit" 
            disabled={!inputText.trim()}
            className="px-6 py-2 bg-rose-600 text-white font-bold rounded-full hover:bg-rose-700 transition disabled:bg-gray-300"
          >
            Send
          </button>
        </form>

      </div>
    </main>
  );
}