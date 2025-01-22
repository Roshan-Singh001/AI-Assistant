// Libraries
import React from 'react';
import axios  from "axios";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from 'react-toastify';

// Icons
import { IoMdAdd } from "react-icons/io";
import { FaChevronLeft } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { MdDone } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

// Hooks
import { useState,useContext,createContext } from 'react';
import { newChatContext } from '../context/contexts';
import {toghistoryContext} from '../context/toghistory';
import {ChatHistoryContext} from '../context/chathistory';
import {AllChatsContext} from '../context/chats';

const History = () => {
  const [Search, setSearch] = useState('');
  const [toggleSearch, settoggleSearch] = useState(false);
  const [SearchChatInstance, setSearchChatInstance] = useState([]);
  const [Instance_option, setInstance_option] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [editingInstance, setEditingInstance] = useState(null);
  const [newTopic, setNewTopic] = useState(''); 
  const { Chat, New_Chat } = useContext(newChatContext);
  const {togglehistory, setTogglehistory } = useContext(toghistoryContext);
  const {chatInstance, set_instance } = useContext(ChatHistoryContext);
  const { chatai, set_chats } = useContext(AllChatsContext);

  const notify = (message) => {
    toast.error(`${message}`,{
      theme: "dark",
    });
  }
  const AxiosInstance = axios.create({
    baseURL: 'http://localhost:3000/',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
  });

  const handleSearch = (e)=>{
    const search_value = e.target.value.toLowerCase();

    settoggleSearch(true);
    setSearch(search_value);
     if (search_value === "") {
    // If the search box is empty, reset the search results
    setSearchChatInstance([]);
    return;
  }
    const filteredChatInstances = chatInstance
    .filter((item) => item.topic.toLowerCase().includes(search_value))
    .map((item) => ({ id: item.id, topic: item.topic, is_active: false }));
    set_instance(filteredChatInstances);
  }

  const handleSearchCancel = ()=>{
    settoggleSearch(false);
    (async ()=> {
      try {
        const {data: instances_Data } = await AxiosInstance.get(`http://localhost:3000/all_instance/`);
        instances_Data.forEach((row) => {
          delete row.timestamp;
        });
        const transformedInstanceData = instances_Data.map((instance) => ({
          id: instance.instance_id,
          topic: instance.topic_message,
          is_active: instance.active,
        }));
      set_instance(transformedInstanceData);
    } catch (error) {
      notify("Failed to load the data");
    }})();
    setSearchChatInstance([]);

  }

  const handleOptionsClick = (e, itemId) => {
    e.stopPropagation();
    const rect = e.target.getBoundingClientRect();
    setMenuPosition({
      top: rect.top + window.scrollY + rect.height + 8,
      left: rect.left + rect.width / 2 - 64,
    });
    setInstance_option(Instance_option === itemId ? null : itemId);
  };

  const handleChat = async(instance_id)=>{
    New_Chat(true);
    chatInstance.forEach((item)=>{
      if (item.id == instance_id) item.is_active = true;
      else item.is_active = false;
    });
    try {
      const {data: chatData } = await AxiosInstance.get(`/chat/${instance_id}`);
      chatData.forEach((row) => {
        delete row.timestamp;
      });
      const transformedChatData = chatData.map((chat) => ({
        id: chat.chat_id,
        message: chat.chat_message,
        isAi: !chat.is_human, 
      }));
      set_chats(transformedChatData);
      console.log(transformedChatData);
    } catch (error) {
      notify("Failed to save data in the database");
    }
  }

  const handlenewchat = async()=>{
    New_Chat(true);
    let n_id = uuidv4();
    const New_Chat_id = n_id.replaceAll("-","_");
    try {
      await AxiosInstance.post(`/newchat/${New_Chat_id}`);
    } catch (error) {
      notify("Failed to save data in the database");
    }
    chatInstance.forEach((item)=>{
      if (item.is_active) item.is_active = false;
    })
    set_instance((prev)=> [...prev,{id: New_Chat_id, topic: "New Chat", is_active: true}]);
    set_chats([]);
    try {
      await AxiosInstance.post(`/instance/${New_Chat_id}`,{topic: "New Chat", is_active: false});
    } catch (error) {
      notify("Failed to save data in the database");
    }
  }

  const handleInstanceDelete = async(instance_id)=>{
    try {
      await AxiosInstance.post(`/instance_delete/${instance_id}`);
    } catch (error) {

      notify("Failed to save data in the database");
    }
    let instances = chatInstance.filter((item)=>{
      return item.id !== instance_id;
    });
    set_instance(instances);
  }

  const handleInstanceEdit = async(item)=>{
    setEditingInstance(item.id);
    setNewTopic(item.topic);
    setInstance_option(null); 
  }

  const handleSaveEdit = (itemId) => {
    chatInstance.forEach(async(item)=>{
      if(itemId === item.id){
        if (item.topic !== newTopic) {
          item.topic = newTopic;
          const chat_active_id = item.id;
          try {
            await AxiosInstance.post(`/instance_topic/${chat_active_id}`,{topic:newTopic});
          } catch (error) {
            notify("Failed to save data in the database");
          }
        }
      }
    })
    setEditingInstance(null); 
  };

  const handleTogHistory = ()=>{
    setTogglehistory(!togglehistory);
  }

  return (
    <>
    <section className={`flex flex-col gap-4 ${togglehistory?'max-[600px]:absolute max-[600px]:z-10 max-[600px]:w-[16rem] max-[600px]:shadow-[1px_0px_10px_black]':'absolute -z-[1]  w-0 will-change-auto'} bg-slate-800 rounded-lg text-white w-[20rem] h-[100vh]`}>
        <div className='py-4 px-2 flex flex-col'>
          <div className='relative flex justify-between'>
            {togglehistory && <button title='Hide History' onClick={handleTogHistory} className='p-[0.6rem] bg-white text-black hover:bg-slate-500 hover:text-white rounded-full'><FaChevronLeft /></button>}
            <div className='text-[1.5rem]'>HISTORY</div>
            <button onClick={handlenewchat} className='p-[0.6rem] rounded-full bg-white group hover:bg-slate-500 '><IoMdAdd className='fill-black group-hover:fill-white'  /></button>
          </div>
          <div className='flex gap-2 mt-6 px-2 rounded-full bg-slate-700 py-2'>
            <input onChange={(e)=>handleSearch(e)} className={`w-full border-white ${toggleSearch && 'border-r-2'} placeholder:text-white/70 outline-none bg-transparent text-[1.1rem]`} type="search" placeholder='Search' />
            {toggleSearch &&<button onClick={handleSearchCancel} className='p-2 bg-red-700 hover:bg-red-900 rounded-full' > <RxCross2 /></button>}
          </div>
        </div>
        <div className='h-full overflow-x-clip overflow-y-scroll'>
            {toggleSearch && <><div className='text-gray-500 text-sm text-center'>Search Results</div> <div className='w-[50%] h-[1px] mx-auto mt-[0.1rem] bg-gray-500'></div></>}
            
            <div>
              {chatInstance.length == 0 && <div className='mt-4 text-gray-500 text-lg text-center'>No Chats</div>}
              {chatInstance.map((item)=>{
                return (<div key={item.id} onClick={()=>handleChat(item.id)} className={`flex justify-between items-center cursor-pointer ${item.is_active?'bg-slate-500':'hover:bg-slate-700/50'} py-4 px-[0.4rem] `}>
                          <div className='text-[0.95rem] whitespace-nowrap text-ellipsis overflow-hidden'>
                            {editingInstance === item.id?<>
                              <div className='flex gap-[0.2rem] pb-[0.3rem] border-white border-b-2 bg-transparent '>
                              <input type="text" value={newTopic} onChange={(e) => setNewTopic(e.target.value)} onClick={(e) => e.stopPropagation()} className="w-full pr-2 py-1 outline-none text-white bg-transparent" /> 
                              <button onClick={(e) => {e.stopPropagation(); handleSaveEdit(item.id);}} className="px-2 py-1 font-bold text-white bg-green-500 rounded-full hover:bg-green-600" > <MdDone /></button> 
                              </div>
                          </>:item.topic}
                          </div>
                          {<button onClick={(e) =>handleOptionsClick(e,item.id)} className='p-[0.6rem] rounded-full opacity-70 hover:bg-slate-700 hover:opacity-100'>{Instance_option === item.id?<RxCross2 />:<SlOptions />}</button>}
                          {Instance_option === item.id && <div className={`absolute p-2 w-32 bg-slate-600 shadow-lg rounded-md z-10`} style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}>
                             <button onClick={(e)=>{e.stopPropagation(); handleInstanceEdit(item);}} className="flex items-center w-full px-4 py-2 text-[1rem] rounded-md text-white hover:bg-gray-800">
                              <FiEdit className="mr-2" />
                              Edit
                            </button>
                            <button onClick={()=>handleInstanceDelete(item.id)} className="flex items-center w-full px-4 py-2 text-[1rem] rounded-md text-red-500 hover:bg-gray-800">
                              <FiTrash2 className="mr-2" />
                              Delete
                            </button>
                          </div>}
                        </div>)
                })
              }
            </div>
        </div>
    </section>
    </>
  )
}

export default History