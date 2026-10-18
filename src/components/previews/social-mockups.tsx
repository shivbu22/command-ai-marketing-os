"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Instagram, Twitter, MessageCircle, Heart, Share2, Bookmark, MoreHorizontal, User, Music2, Linkedin, Pin } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface SocialMockupProps {
  content: string
  platform: 'instagram' | 'x' | 'tiktok' | 'linkedin' | 'pinterest'
}

export function SocialMockups({ content, platform }: SocialMockupProps) {
  return (
    <div className="flex flex-col gap-6 p-4">
      {platform === 'instagram' && <InstagramMockup content={content} />}
      {platform === 'x' && <XMockup content={content} />}
      {platform === 'tiktok' && <TikTokMockup content={content} />}
      {platform === 'linkedin' && <LinkedInMockup content={content} />}
      {platform === 'pinterest' && <PinterestMockup content={content} />}
    </div>
  )
}

function InstagramMockup({ content }: { content: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[350px] bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
    >
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[1.5px]">
            <div className="w-full h-full rounded-full bg-black border border-black flex items-center justify-center overflow-hidden">
               <User className="w-4 h-4 text-white" />
            </div>
          </div>
          <span className="text-xs font-bold text-white">pixalified_studio</span>
        </div>
        <MoreHorizontal className="w-4 h-4 text-white" />
      </div>
      
      <div className="aspect-square bg-gradient-to-br from-purple-900/40 to-black flex items-center justify-center p-8 text-center">
         <p className="text-sm font-medium text-white/90 leading-tight line-clamp-6 italic">&quot;{content.substring(0, 150)}...&quot;</p>
      </div>

      <div className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Heart className="w-6 h-6 text-white" />
            <MessageCircle className="w-6 h-6 text-white" />
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <Bookmark className="w-6 h-6 text-white" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-white">1,248 likes</p>
          <p className="text-xs text-white">
            <span className="font-bold mr-2">pixalified_studio</span>
            {content.substring(0, 100)}... <span className="text-white/50">more</span>
          </p>
          <p className="text-[10px] text-white/40 uppercase">2 hours ago</p>
        </div>
      </div>
    </motion.div>
  )
}

function XMockup({ content }: { content: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[350px] bg-black border border-white/10 rounded-2xl p-4 shadow-2xl space-y-3"
    >
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
          <User className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 min-w-0">
              <span className="font-bold text-white text-sm truncate">Pixalified AI</span>
              <span className="text-white/50 text-sm truncate">@pixalified</span>
              <span className="text-white/50 text-sm">· 2h</span>
            </div>
            <MoreHorizontal className="w-4 h-4 text-white/50" />
          </div>
          <p className="text-sm text-white leading-normal mt-1 break-words">
            {content.substring(0, 240)}
            <br />
            <span className="text-sky-400">#AI #Marketing #Future</span>
          </p>
          <div className="flex items-center justify-between mt-3 text-white/50 max-w-[280px]">
             <MessageCircle className="w-4 h-4 hover:text-sky-400 transition-colors" />
             <Share2 className="w-4 h-4 hover:text-green-400 transition-colors" />
             <Heart className="w-4 h-4 hover:text-pink-400 transition-colors" />
             <Share2 className="w-4 h-4 hover:text-sky-400 transition-colors" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function TikTokMockup({ content }: { content: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[350px] aspect-[9/16] bg-black border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
    >
       <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
       
       {/* Background "Video" Sim */}
       <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="w-full h-full bg-gradient-to-tr from-pink-900/20 via-blue-900/20 to-purple-900/20 animate-pulse" />
          <p className="absolute text-white/10 font-bold text-6xl rotate-12 select-none">PIXALIFIED</p>
       </div>

       {/* Right Sidebar */}
       <div className="absolute right-3 bottom-20 flex flex-col items-center gap-6 z-10">
          <div className="relative">
             <div className="w-11 h-11 rounded-full border-2 border-white bg-white/20 overflow-hidden">
                <User className="w-full h-full p-2 text-white" />
             </div>
             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#FF2D55] rounded-full flex items-center justify-center text-white text-[10px] font-bold">+</div>
          </div>
          <div className="flex flex-col items-center">
             <Heart className="w-8 h-8 text-white fill-white" />
             <span className="text-white text-[10px] font-semibold">12.4K</span>
          </div>
          <div className="flex flex-col items-center">
             <MessageCircle className="w-8 h-8 text-white fill-white" />
             <span className="text-white text-[10px] font-semibold">458</span>
          </div>
          <div className="flex flex-col items-center">
             <Bookmark className="w-8 h-8 text-white fill-white" />
             <span className="text-white text-[10px] font-semibold">2,102</span>
          </div>
          <div className="flex flex-col items-center">
             <Share2 className="w-8 h-8 text-white fill-white" />
             <span className="text-white text-[10px] font-semibold">892</span>
          </div>
       </div>

       {/* Bottom Content */}
       <div className="absolute left-3 right-16 bottom-6 space-y-3 z-10">
          <p className="text-white font-bold text-sm">@pixalified_studio</p>
          <p className="text-white text-xs line-clamp-3 leading-relaxed">
            {content.substring(0, 150)}... <span className="font-bold">#fyp #ai #marketingswarm</span>
          </p>
          <div className="flex items-center gap-2">
             <Music2 className="w-3 h-3 text-white" />
             <div className="overflow-hidden w-24">
                <p className="text-white text-[10px] whitespace-nowrap animate-marquee">Original Sound - Pixalified Studio - Original Sound</p>
             </div>
          </div>
       </div>
    </motion.div>
  )
}

function LinkedInMockup({ content }: { content: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[400px] bg-white text-black border border-gray-200 rounded-lg shadow-sm overflow-hidden"
    >
      <div className="flex gap-3 p-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
          <User className="w-8 h-8 text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-gray-900 text-[15px] truncate">Pixalified Studio</span>
              <span className="text-gray-500 text-xs truncate">Autonomous Marketing Agency</span>
              <span className="text-gray-500 text-[10px] mt-0.5 truncate flex items-center gap-1">2h • <Linkedin className="w-3 h-3" /></span>
            </div>
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </div>
        </div>
      </div>
      <div className="px-4 pb-3">
        <p className="text-sm text-gray-900 leading-normal break-words whitespace-pre-wrap">
          {content.substring(0, 300)}...
          <br /><br />
          <span className="text-blue-600 font-medium">#MarketingAutomation #AI #FutureOfWork</span>
        </p>
      </div>
      <div className="bg-gray-100 aspect-video flex items-center justify-center border-y border-gray-200">
        <div className="text-center p-6 bg-white shadow-sm rounded-lg border border-gray-200 m-4 max-w-full">
           <h3 className="font-bold text-gray-900 text-lg mb-2 truncate">The AI Advantage</h3>
           <p className="text-gray-500 text-sm line-clamp-2">How autonomous swarms are changing the marketing landscape.</p>
           <p className="text-gray-400 text-xs mt-3 uppercase tracking-wider">pixalified.ai</p>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-3 text-gray-500 border-b border-gray-100">
        <div className="flex items-center gap-1">
           <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center -mr-1 border-2 border-white"><Heart className="w-2 h-2 text-white fill-white" /></div>
           <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center border-2 border-white"><Share2 className="w-2 h-2 text-white" /></div>
           <span className="text-xs ml-1">428</span>
        </div>
        <div className="flex gap-3 text-xs">
          <span>112 comments</span>
          <span>45 reposts</span>
        </div>
      </div>
      <div className="flex items-center justify-between px-2 py-1 text-gray-500">
         <button className="flex-1 flex justify-center items-center gap-2 hover:bg-gray-100 py-3 rounded-md transition-colors"><Heart className="w-5 h-5" /> <span className="font-medium text-sm">Like</span></button>
         <button className="flex-1 flex justify-center items-center gap-2 hover:bg-gray-100 py-3 rounded-md transition-colors"><MessageCircle className="w-5 h-5" /> <span className="font-medium text-sm">Comment</span></button>
         <button className="flex-1 flex justify-center items-center gap-2 hover:bg-gray-100 py-3 rounded-md transition-colors"><Share2 className="w-5 h-5" /> <span className="font-medium text-sm">Repost</span></button>
      </div>
    </motion.div>
  )
}

function PinterestMockup({ content }: { content: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[300px] rounded-3xl overflow-hidden group relative"
    >
      <div className="aspect-[2/3] bg-gradient-to-br from-pink-100 to-red-50 relative rounded-3xl overflow-hidden">
        {/* Mock image content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-center items-center text-center">
          <p className="text-2xl font-black text-red-900 leading-tight">PIXALIFIED</p>
          <div className="w-12 h-1 bg-red-600 my-4" />
          <p className="text-sm font-bold text-red-800 uppercase tracking-widest">{content.substring(0, 30)}</p>
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
           <div className="flex justify-between items-start">
             <div className="bg-red-600 text-white font-bold text-sm px-4 py-3 rounded-full hover:bg-red-700 cursor-pointer transition-colors shadow-lg">Save</div>
           </div>
           <div className="flex justify-end gap-2">
             <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white cursor-pointer transition-colors shadow-lg">
               <Share2 className="w-5 h-5 text-gray-900" />
             </div>
             <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white cursor-pointer transition-colors shadow-lg">
               <MoreHorizontal className="w-5 h-5 text-gray-900" />
             </div>
           </div>
        </div>
      </div>
      <div className="mt-3 px-2 flex gap-3">
         <div className="flex-1">
            <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight dark:text-gray-100">{content.substring(0, 80)}...</p>
            <div className="flex w-full items-center mt-2 gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0" />
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">Pixalified Studio</p>
            </div>
         </div>
         <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mt-1 cursor-pointer hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700">
           <MoreHorizontal className="w-4 h-4 text-gray-900 dark:text-gray-100" />
         </div>
      </div>
    </motion.div>
  )
}

