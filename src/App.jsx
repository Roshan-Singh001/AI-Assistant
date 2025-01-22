// Libraries
import axios  from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from "uuid";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

// Icons
import { FaMicrophone } from "react-icons/fa";
import { FaMicrophoneAltSlash } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";

// Components and CSS
import History from './components/History';
import Chmarkdown from './components/Chmarkdown';
import './App.css'

// Hooks
import { useState,useEffect, useMemo,useRef} from 'react'
import {newChatContext} from './context/contexts';
import {toghistoryContext} from './context/toghistory';
import {ChatHistoryContext} from './context/chathistory';
import {AllChatsContext} from './context/chats';


function App() {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const [newChat, setnewChat] = useState(false);
  const [message, setMessage] = useState("");
  const [chatai, setChatai] = useState([]);
  const [chatInstance, setChatInstance] = useState([]);
  const textareaRef = useRef(null);
  const maxHeight = 50;
  const [mictoggle, setMicToggle] = useState(false);
  const [togglehistory, setTogglehistory] = useState(false);
  const toghistoryContextValue = useMemo(
    () => ({ togglehistory, setTogglehistory }),
    [togglehistory]
  );
  const notify = (message) => {
    toast.error(`${message}`,{
      theme: "dark",
    });
  }
  const {
    transcript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const AxiosInstance = axios.create({
    baseURL: 'http://localhost:3000/',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
  });

  useEffect(() => {
    (async ()=> {
      try {
        const {data: instances_Data } = await AxiosInstance.get(`/all_instance`);
        instances_Data.forEach((row) => {
          delete row.timestamp;
        });
        const transformedInstanceData = instances_Data.map((instance) => ({
          id: instance.instance_id,
          topic: instance.topic_message,
          is_active: instance.active,
        }));
      setChatInstance(transformedInstanceData);
    } catch (error) {
      console.error('Error sending data: ', error);
      notify("Failed to fetch the previous chats right now");
    }})();
  },[]);
  
  useEffect(() => {
    setMessage(transcript);
  }, [transcript]) 

  

  const handleNewChat = async() => {
    setnewChat(true);
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
    setChatInstance((prev)=> [...prev,{id: New_Chat_id, topic: "New Chat", is_active: true}]);
    try {
      await AxiosInstance.post(`/instance/${New_Chat_id}`,{topic: "New Chat", is_active: false});
    } catch (error) {
      notify("Failed to chat instance in the database")
    }
  }

  const handleTogHistory = ()=>{
    setTogglehistory(!togglehistory);
  }
  const handleInput = (e) => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to calculate new height correctly
      textarea.style.height = 'auto';
      // Set new height but cap it at maxHeight
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;
    }
    setMessage(e.target.value);
  };
  
  const handleChange = (e)=>{
    setMessage(e.target.value);
  }

  const handleMic = ()=>{
    if (!browserSupportsSpeechRecognition) return notify("Your browser doesn't support speech recognition");
    setMicToggle(!mictoggle);
    if (!mictoggle){
      SpeechRecognition.startListening({ continuous: true });  
    } 
    else SpeechRecognition.stopListening()
  }

  const handleGo = async()=>{
    const prompt = message;
    var id = uuidv4();
    var chat_active_id = "";
    chatInstance.forEach((item)=>{
      if (item.is_active) chat_active_id = item.id;
    })
    try {
      await AxiosInstance.post(`/go/${chat_active_id}`, {id: id,message: message, is_human: true});
    } catch (error) {
      notify("Failed to save data in the database");
    }
    setChatai( (prev)=> [...prev, { id: uuidv4(), message: prompt, isAi: false }]);

    id = uuidv4();
    var ai_result;
    (async ()=>{
      const run =  await model.generateContent([prompt]);
      ai_result = run.response.text();
      try {
        await AxiosInstance.post(`/go/${chat_active_id}`, {id: id,message: ai_result, is_human: false});
      } catch (error) {
        notify("Failed to save data in the database");
      }
      setChatai((prev)=> [...prev, { id: uuidv4(), message: ai_result, isAi: true }]);
    })();

    if (chatai.length == 0) {
      (async ()=>{
        const prompt_find = `Topic or theme of the conversation in 3 words based on the user's query and the AI's response. User Said: ${prompt} reply- ${ai_result}`
        const run =  await model.generateContent([prompt_find]);
        const topic = run.response.text();
        chatInstance.forEach((item)=>{
          if (item.is_active) item.topic = topic;
        });
        try {
          await AxiosInstance.post(`/instance_topic/${chat_active_id}`, {topic: topic});
        } catch (error) {
          notify("Failed to save data in the database");
        }
      })();
    }
  }

  return ( 
    <>
      <div className='flex gap-2 bg-slate-900'>
        <ToastContainer style={{fontFamily: `"Poppins", sans-serif`}} />
        <AllChatsContext.Provider value={{chatai,set_chats: setChatai}}>
        <ChatHistoryContext.Provider value={{chatInstance,set_instance: setChatInstance}}>
        <toghistoryContext.Provider value={toghistoryContextValue}>
        <newChatContext.Provider value={{newChat,New_Chat: setnewChat}}>
          <History />
        </newChatContext.Provider>
        </toghistoryContext.Provider>
        </ChatHistoryContext.Provider>
        </AllChatsContext.Provider>
        <section className={`flex flex-col relative p-2 justify-center items-center h-[100vh] w-screen rounded-lg bg-gradient-to-b from-black/90 to-blue-900 sm:bg-gradient-to-r sm:from-black/60 sm:to-blue-900/80`} >
            {newChat==false?<> 
              <div className='text-[2rem] text-white font-extrabold'>SIMPL-AI</div>
              {(togglehistory==false) && <button title="Show History" onClick={handleTogHistory} className='absolute top-2 left-2 p-2 bg-white text-black rounded-full'><FaChevronRight /></button>}
              <div className='text-[2rem] max-[425px]:text-[1.7rem] font-semibold mb-4 text-white'>WHAT CAN I HELP WITH ?</div>
              <button onClick={handleNewChat} className='py-2 px-4 mt-1 bg-slate-900 text-[1.2rem] rounded-full text-white hover:bg-slate-500 hover:scale-[1.2] transition-all cursor-pointer'>START A CHAT</button>
            </>:
            chatInstance.map((item)=>{

              return item.is_active &&<> 
                      {(togglehistory==false) && <button onClick={handleTogHistory} className='absolute top-2 left-2 p-2 bg-white text-black rounded-full'><FaChevronRight /></button>}
                      <div className='flex flex-col justify-end  gap-2 p-2 size-full overflow-auto rounded-lg '>
                      <div className='flex flex-col gap-4 h-full overflow-y-scroll' style={{scrollbarWidth: 'none'}}>
                      {chatai.map((item)=>{
                        return (item.isAi == false?(<>
                          <div key={item.id} className='flex justify-end text-white'>
                            <div className='max-w-[70%] p-2 bg-slate-700/75 shadow-[1px_0px_10px_black] rounded-lg'>
                              <div className='font-bold text-[1.1rem]'>USER</div>
                              <div className='mt-2'>{item.message}</div>
                            </div>
                          </div>
                        </>):(<>
                                <div key={item.id} className='flex justify-start text-white'>
                                <div className='max-w-[70%] max-[600px]:max-w-[100%] p-2 bg-slate-900 shadow-[1px_0px_10px_black] rounded-lg break-normal whitespace-break-spaces'>
                                  <div className='font-bold text-[1.1rem]'>SIMPL-AI</div>
                                  <div className='mt-2'><Chmarkdown markdownStr={item.message}/></div>
                                </div>
                              </div>
                              
                            </>))
                      })}
                </div>
                <div className='flex items-center gap-2'>
                  <textarea rows={1} onChange={handleChange} onInput={handleInput} style={{ height: 'auto', maxHeight: `${maxHeight}px`, overflowY: textareaRef.current && textareaRef.current.scrollHeight > maxHeight ? 'auto' : 'hidden'}} value={message} className='py-3 px-4 w-full scroll-m-2 resize-none rounded-full outline-none bg-slate-600 placeholder:text-white/70 shadow-[0px_2px_12px_black_inset] text-white' type="text" placeholder='Message' />
                  <div onClick={handleMic} className='flex justify-center h-fit w-[2.6rem] p-[0.6rem] cursor-pointer bg-white rounded-full shadow-[0px_-2px_7px_black_inset] hover:shadow-[0px_2px_7px_black_inset]'>
                    {mictoggle?<FaMicrophone className='h-[1.2rem]' />:<FaMicrophoneAltSlash className='h-[1.2rem]' />}
                  </div>
                  <button disabled={message.length>3?false:true} onClick={handleGo} className='p-2 text-black bg-white shadow-[0px_-2px_7px_black_inset] hover:shadow-[0px_2px_7px_black_inset] font-bold rounded-full disabled:opacity-50'>GO</button>
                </div>
              </div>
            </>
            })}
        </section>
      </div>
    </>
  )
}
export default App