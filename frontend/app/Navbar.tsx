"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [latestSenderId, setLatestSenderId] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);

    if (userId) {
      fetch(`http://localhost:3001/chat/unread/${userId}`)
        .then(res => res.json())
        .then(data => setUnreadCount(data.unreadCount || 0))
        .catch(err => console.error(err));
    }
  }, [pathname]); 

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const socket = io("http://localhost:3001");
    socket.emit("register", userId);

    socket.on("newMessage", (message) => {
      if (message.receiverId === userId && !pathname.includes(`/chat/${message.senderId}`)) {
        setUnreadCount((prev) => prev + 1); 
        setLatestSenderId(message.senderId); 
        setShowPopup(true); 
        
        setTimeout(() => {
          setShowPopup(false);
        }, 5000);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    router.push("/login");
  };

  const handleMyProfileClick = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const res = await fetch(`http://localhost:3001/profiles?userId=${userId}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        router.push(`/profile/${data[0].id}`);
      } else {
        router.push("/create-profile");
      }
    } catch (error) {
      console.error("Failed to route to profile", error);
    }
  };

  const handlePopupClick = () => {
    setShowPopup(false);
    if (latestSenderId) {
      window.location.href = `/chat/${latestSenderId}`;
    }
  };

  if (pathname === "/login" || pathname === "/register") {
    return null; 
  }

  return (
    <>
      {showPopup && latestSenderId && (
        <div 
          onClick={handlePopupClick}
          className="fixed top-24 right-4 bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl z-[100] flex items-center gap-3 animate-bounce cursor-pointer border border-gray-700 hover:bg-gray-800 transition"
        >
          <div className="text-2xl">💬</div>
          <div>
            <p className="font-bold text-sm">New Message Received!</p>
            <p className="text-xs text-gray-300">Click to reply instantly</p>
          </div>
        </div>
      )}

      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          
          <Link href="/" className="text-2xl font-bold text-rose-600 tracking-tight">
            Matrimony💖
          </Link>
          
          <div className="flex gap-6 items-center">
            {isLoggedIn ? (
              <>
                <Link href="/" className="text-gray-600 hover:text-rose-600 font-medium transition">
                  Home
                </Link>
                <Link href="/requests" className="text-gray-600 hover:text-rose-600 font-medium transition">
                  Inbox
                </Link>
                <Link href="/matches" className="text-gray-600 hover:text-rose-600 font-medium transition">
                  Matches
                </Link>

                {/* --- UPDATED: Now points straight to your new /messages inbox --- */}
                <Link 
                  href="/messages" 
                  className="text-gray-600 hover:text-rose-600 font-medium transition flex items-center"
                  onClick={() => setUnreadCount(0)}
                >
                  Messages
                  {unreadCount > 0 && (
                    <span className="ml-1.5 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                <button onClick={handleMyProfileClick} className="text-gray-600 hover:text-rose-600 font-medium transition">
                  My Profile
                </button>

                <button 
                  onClick={handleLogout} 
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm ml-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login">
                <button className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium text-sm">
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}