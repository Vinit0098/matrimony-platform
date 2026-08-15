"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateProfile() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  
  // New state to hold our selected image file
  const [photo, setPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    gender: "MALE",
    dateOfBirth: "",
    maritalStatus: "SINGLE",
    religion: "",
    motherTongue: "",
    city: "",
    country: "",
    bio: "",
  });

  useEffect(() => {
    fetch("http://localhost:3001/users")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // New handler specifically for the file input
  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Because we are sending a file, we must use FormData instead of JSON!
      const submitData = new FormData();
      
      // Add all the text fields
      Object.keys(formData).forEach((key) => {
        submitData.append(key, (formData as any)[key]);
      });

      // Add the photo if the user selected one
      if (photo) {
        submitData.append("photo", photo);
      }

      // Notice we DO NOT set the 'Content-Type' header here. 
      // The browser automatically sets it to 'multipart/form-data' when it sees FormData!
      const res = await fetch("http://localhost:3001/profiles", {
        method: "POST",
        body: submitData,
      });

      if (res.ok) {
        alert("Profile Created Successfully!");
        router.push("/");
      } else {
        const errorData = await res.json();
        console.error("Backend Error:", errorData);
        alert("Failed to create profile. Check the console.");
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Failed to connect to the backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Build Your Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Account</label>
            <select name="userId" value={formData.userId} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-rose-500">
              <option value="" disabled>-- Choose your registered email --</option>
              {users.map((user: any) => (
                <option key={user.id} value={user.id}>{user.email}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-rose-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-rose-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-rose-500">
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-rose-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
              <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-rose-500">
                <option value="SINGLE">Single</option>
                <option value="DIVORCED">Divorced</option>
                <option value="WIDOWED">Widowed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
              <input type="text" name="religion" value={formData.religion} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-rose-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mother Tongue</label>
              <input type="text" name="motherTongue" value={formData.motherTongue} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-rose-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-rose-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input type="text" name="country" value={formData.country} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-rose-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio (Tell us about yourself)</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} required rows={3} className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-rose-500"></textarea>
          </div>

          {/* --- THE NEW PHOTO UPLOAD FIELD --- */}
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-lg">
            <label className="block text-sm font-bold text-rose-800 mb-2">Upload Profile Photo</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-600 file:text-white hover:file:bg-rose-700 transition"
            />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 transition disabled:bg-gray-400 mt-4">
            {isSubmitting ? "Saving Profile..." : "Create Profile"}
          </button>
        </form>
      </div>
    </main>
  );
}