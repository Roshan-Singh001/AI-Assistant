import React from 'react'
import Navbar from '../components/Navbar'
import Aurora from '../components/Aurora'

const About = () => {
  return (
    <>
      <div className='min-h-screen relative overflow-hidden'>
      <Navbar/>
            <div className="absolute inset-0 -z-10">
                    <Aurora
                      colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                      blend={0.5}
                      amplitude={0.5}
                      speed={0.8}
                    />
                    <div className="absolute inset-0 -z-20 bg-black"></div>
                  </div>
            <div className='flex flex-col justify-center items-center mt-4'>
              <h1 className='text-4xl text-white font-bold'>About</h1>
              <div className='bg-white w-[7rem] mt-2 h-[0.1rem]'></div>
            </div>
            <div className='mt-4 w-[80%] backdrop-blur-lg border border-white/30  bg-white/10 p-4 rounded-2xl m-auto text-white text-lg'>
              <p>
                <strong>Simpl-AI</strong> is an innovative platform designed to bring the power of 
                artificial intelligence closer to everyone — in the simplest, most intuitive way 
                possible. Built with the idea of <strong>simplifying complexity</strong>, Simpl-AI provides a suite 
                of intelligent tools that enhance creativity, productivity, and problem-solving 
                across various domains. At its core, Simpl-AI is about 
                <strong> making AI accessible and meaningful</strong>. Whether you’re a student 
                exploring new concepts, a developer building solutions, or a professional looking 
                to automate tasks — Simpl-AI offers a clean, efficient, and human-centered AI 
                experience.
              </p>
              
              <div className='mt-4'>
                <h3 className='text-xl font-bold'>Our Vision</h3>
                <p className='mt-2'>
                  To create an ecosystem where <strong>AI becomes effortless</strong>, intelligent 
                  interactions feel natural, and users can focus on what truly matters — ideas, 
                  logic, and innovation. Simpl-AI aims to be a bridge between human thought and 
                  artificial intelligence, enabling users to do more with less effort.
                </p>

              </div>

              <div className='mt-4'>
                <h3 className='text-xl font-bold'>Our Philosophy</h3>
                <p className='mt-2'>
                  We believe that <strong>AI should simplify, not complicate.</strong>
                  Every feature, every design choice, and every interaction within Simpl-AI is 
                  built on three principles:

                  <ul className='mt-2 ml-8 list-disc'>
                    <li><strong>Simplicity:</strong> Easy to use and understand.</li>
                    <li><strong>Intelligence:</strong> Smart enough to adapt and assist.</li>
                    <li><strong>Utility:</strong> Designed to solve real-world problems effectively.</li>
                  </ul>
                </p>
              </div>

              <div className='mt-4'>
                <h3 className='text-xl font-bold'>The Mission Ahead</h3>
                <p className='mt-2'>
                  Simpl-AI continues to evolve with a mission to expand its capabilities — from 
                  intelligent chats and coding aids to creative, analytical, and collaborative 
                  AI experiences. The goal is to build a unified platform where users can interact 
                  with AI as naturally as they think, learn, and create.
                </p>
              </div>

              <div className='mt-4'>
                <h3 className='text-xl font-bold'>Experience Intelligence, Simplified.</h3>
                <p className='mt-2'>
                  With Simpl-AI, artificial intelligence is not just a tool — it’s your 
                  intelligent companion for creation, exploration, and growth.

                </p>
              </div>
            </div>
            </div>
    
    </>
  )
}

export default About