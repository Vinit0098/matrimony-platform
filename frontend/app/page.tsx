"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  // --- FIXED: Explicitly typed the state as an array of any ---
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [filters, setFilters] = useState({
    gender: "",
    religion: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const fetchProfiles = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.gender) params.append("gender", filters.gender);
      if (filters.religion) params.append("religion", filters.religion);

      const query = params.toString();
      const url = `http://localhost:3001/profiles${query ? `?${query}` : ""}`;

      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();

      if (Array.isArray(data)) {
        setProfiles(data);
      }
    } catch (error) {
      console.error("Failed to fetch profiles:", error);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [filters]);

  const handleFilterChange = (e: any) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSendInterest = async (receiverId: string) => {
    const senderId = localStorage.getItem("userId");
    
    if (!senderId) {
      alert("Please sign in to connect with users!");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId, receiverId }),
      });

      if (res.ok) {
        alert("Interest sent successfully! 💖");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to send interest."); 
      }
    } catch (error) {
      console.error("Error sending interest", error);
      alert("Something went wrong.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-gray-50">
      <div className="text-center w-full max-w-5xl">
        <h1 className="text-5xl font-bold text-rose-600 mb-6">Welcome to Matrimony</h1>
        <p className="text-xl text-gray-600 mb-8">Find your perfect match today.</p>

        {/* Show Welcome / Register buttons ONLY if they are NOT logged in */}
        {!isLoggedIn && (
          <div className="flex gap-4 justify-center mb-12">
            <Link href="/login">
              <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium">
                Sign In
              </button>
            </Link>
            <Link href="/register">
              <button className="px-6 py-3 bg-white text-rose-600 border border-rose-600 rounded-lg hover:bg-rose-50 transition font-medium">
                Register Account
              </button>
            </Link>
          </div>
        )}

        {/* If they ARE logged in, we skip the buttons entirely and just show the filters and profiles */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between text-gray-800 mt-4">
          <h3 className="font-semibold text-gray-700">Filter Matches:</h3>
          
          <div className="flex gap-4 w-full md:w-auto">
            <select name="gender" value={filters.gender} onChange={handleFilterChange} className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-rose-500 flex-1">
              <option value="">Any Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            <input type="text" name="religion" placeholder="Filter by Religion..." value={filters.religion} onChange={handleFilterChange} className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-rose-500 flex-1"/>
          </div>
          
          <button onClick={() => setFilters({ gender: "", religion: "" })} className="text-sm text-rose-600 hover:underline">
            Clear Filters
          </button>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-lg text-left border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Active Profiles ({profiles.length})
          </h2>
          
          {profiles.length === 0 ? (
            <p className="text-gray-500">No profiles found matching those filters.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profiles.map((profile: any) => (
                <div key={profile.id} className="p-5 border border-gray-200 rounded-lg bg-gray-50 hover:border-rose-300 transition shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-rose-100 rounded-full flex-shrink-0 overflow-hidden shadow-sm border border-gray-200 bg-white">
                        {profile.photo ? (
                          <img src={`http://localhost:3001${profile.photo}`} alt="Avatar" className="w-full h-full object-cover"/>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-rose-600 font-bold text-xl">
                            {profile.firstName[0]}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-rose-700">{profile.firstName} {profile.lastName}</h3>
                        <p className="text-sm text-gray-600 font-medium">
                          {profile.city}, {profile.country}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 font-medium">
                      {profile.gender} • {profile.religion} • {profile.maritalStatus}
                    </p>
                    <p className="text-gray-700 italic mb-4 line-clamp-2">"{profile.bio}"</p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                    <Link href={`/profile/${profile.id}`} className="flex-1">
                      <button className="w-full py-2 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition font-medium border border-rose-200">
                        View Profile
                      </button>
                    </Link>
                    
                    <button 
                      onClick={() => handleSendInterest(profile.userId)}
                      className="flex-1 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition font-medium shadow-sm"
                    >
                      Connect 💖
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}