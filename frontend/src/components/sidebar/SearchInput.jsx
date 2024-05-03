import React, { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import useConversation from "../../zustand_global_store/useConversation";
import useGetConversations from "../../hooks/useGetConversations";
import toast from "react-hot-toast";

const SearchInput = () => {
  const [Search, setSearch] = useState("");
  const { setSelectedConversation } = useConversation();
  const { conversations } = useGetConversations();

  const handleSubmit = (e) => {
    e.preventDefault();

    if(!Search) return;

    if(Search.length < 3){
      return toast.error("Search must contain at least 3 characters long.")
    }

    // search matching conversation
    const conversation = conversations.find((eachConv) => eachConv.fullName.toLowerCase().includes(Search.toLowerCase()));

    if(conversation){
      setSelectedConversation(conversation);
      setSearch('');
    }
    else{
      toast.error("No such user found.")
    }
  };

  return (
    <form className="flex items-center gap-2" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search..."
        className="input input-bordered rounded-full"
        value={Search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button type="submit" className="btn btn-circle bg-sky-500 text-white">
        <IoSearchSharp className="w-6 h-6 outline-none" />
      </button>
    </form>
  );
};

export default SearchInput;
