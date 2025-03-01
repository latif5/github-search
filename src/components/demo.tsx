"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { useSearchUsers } from "@/hooks/useGithubQueries";
import { GitHubUser } from "@/types";
import { useEffect, useState } from "react";
import UserList from "./UserList";
import RepositoryList from "./RepositoryList";
import { motion } from "framer-motion";

export function PlaceholdersAndVanishInputDemo() {
  const [query, setQuery] = useState('');
  const [tempQuery, setTempQuery] = useState('');
  const [dataUsers, setDataUsers] = useState<GitHubUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  
  // Use React Query for searching users
  const { data: users, isLoading, error } = useSearchUsers(tempQuery);
  
  // Update dataUsers when users change
  useEffect(() => {
    if (users) {
      setDataUsers(users);
    }
    if (users?.length === 0) {
      setSelectedUser(null);
    }
  }, [users]);
  
  const placeholders = [
    "Search github users?",
    "Just type username github account.",
    "Search github repositories?",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTempQuery(query);
    setSubmitted(true);
  };

  const handleUserSelect = (username: string) => {
    setSelectedUser(username);
  };

  return (
    <>
      <div className="h-screen flex flex-col px-4 max-h-[100vh] overflow-y-scroll bg-neutral-100">
          <motion.div
            initial={{ y: '30vh', opacity: 0 }}
            animate={{ y: dataUsers.length > 0 ? '10vh' : '30vh', opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
              Github User & Repository Explorer
            </h2>
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
            
            {isLoading && <p className="text-gray-500">Searching...</p>}
            {error && <p className="text-red-500">Error: {(error as Error).message}</p>}
          </motion.div>
        {submitted && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-[20vh]">
            <div className="md:col-span-1">
              <UserList 
                users={dataUsers}
                onUserSelect={handleUserSelect}
                selectedUser={selectedUser}
              />
            </div>
            
            <div className="md:col-span-2">
              <RepositoryList 
                username={selectedUser}
              />
            </div>
          </div>
          
        )}
      </div>
    </>
  );
}