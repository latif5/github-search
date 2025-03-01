"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { useSearchUsers } from "@/hooks/useGithubQueries.hook";
import { GitHubUser } from "@/types/index.type";
import { useEffect, useState } from "react";
import UserList from "../components/UserList";
import { motion } from "framer-motion";
import SkeletonAccordion from "../components/ui/skeleton-accordion";

export function Index() {
  const [query, setQuery] = useState('');
  const [tempQuery, setTempQuery] = useState('');
  const [dataUsers, setDataUsers] = useState<GitHubUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  
  const { data: users, isLoading, error } = useSearchUsers(tempQuery);
  console.log("🚀 ~ users:", users)
  
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
      <div className="h-screen w-screen flex flex-col items-center max-w-[100vw] max-h-[100vh] overflow-y-scroll overflow-x-hidden bg-neutral-100">
          <motion.div
            initial={{ y: '30vh', opacity: 0 }}
            animate={{ y: dataUsers.length > 0 ? '10vh' : '30vh', opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
              Github User & Repository Explorer
            </h2>
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
            
            {isLoading && 
              <div className="mt-12 lg:mt-16">
                <SkeletonAccordion />
              </div>
            }
            {error && <p className="text-red-500">Error: {(error as Error).message}</p>}
          </motion.div>
        {submitted && !isLoading && (
          <div className="w-[80%] lg:w-[40%] mt-30 lg:mt-[20vh]">
            <div className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <UserList 
                  users={dataUsers}
                  onUserSelect={handleUserSelect}
                  selectedUser={selectedUser}
                />
              </motion.div>
            </div>
            
          </div>
        )}
      </div>
    </>
  );
}