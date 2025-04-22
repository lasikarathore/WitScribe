import React from "react";

const answers = [
  {
    name: "Sohil Neema",
    avatar: "https://i.pravatar.cc/100?u=sohil",
    text: "WebSocket is a communication protocol that allows two-way, real-time communication between a client (like a browser) and a server.",
    likes: 30,
    comments: 5,
  },
  {
    name: "Neha Singh",
    avatar: "https://i.pravatar.cc/100?u=neha",
    text: 'WebSocket is a web technology that creates a persistent connection between the client and server.\nIt allows real-time, two-way communication without repeatedly refreshing the page.\nWebSocket is perfect for apps that need instant updates, like chats or live scores.\nIt starts with an HTTP handshake, then upgrades to a faster WebSocket connection.\nWebSocket helps reduce delay (latency) in sending and receiving data.',
    likes: 325,
    comments: 20,
  },
  {
    name: "Chetan Jain",
    avatar: "https://i.pravatar.cc/100?u=chetan",
    text: "WebSocket is a protocol that allows a continuous, two-way communication between a client (like a web browser) and a server. Unlike normal HTTP requests that open and close connections each time, WebSocket keeps the connection open so data can be sent and received instantly in real time.",
    likes: 19,
    comments: 1,
  },
  {
    name: "Suman Negi",
    avatar: "https://i.pravatar.cc/100?u=suman",
    text: "WebSocket maintains a single open connection that can send data in both directions.",
    likes: 0,
    comments: 0,
  },
];

export default function WebSocketDiscussion() {
  return (
    <div className="min-h-screen bg-transparent text-black px-4 sm:px-6 md:px-12 lg:px-24 py-10 space-y-10">
      <header className="flex flex-col gap-4 sm:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold">WitScribe</h1>
        <div className="flex flex-col sm:flex-row gap-2 items-center w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search for the topic and discussion"
            className="px-4 py-2 rounded-lg border w-full sm:w-64"
          />
          <div className="flex items-center gap-4">
            <button className="text-xl">➕</button>
            <button className="text-xl">🌙</button>
            <img src="https://i.pravatar.cc/40" className="w-10 h-10 rounded-full" />
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex-1 border rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3 mb-2">
            <img src="https://i.pravatar.cc/50?u=keerti" className="w-10 h-10 rounded-full" />
            <h2 className="font-semibold">Kertiii</h2>
          </div>
          <h3 className="text-lg font-bold">What is WebSocket?</h3>
          <div className="flex items-center gap-6 mt-4">
            <button className="flex items-center gap-1">❤ 23</button>
            <button className="flex items-center gap-1">💬 1</button>
          </div>
        </div>

        <div className="w-full md:w-1/3 text-center border rounded-xl shadow-sm p-4">
          <img src="https://source.unsplash.com/400x100/?mountains,nature" className="w-full rounded-md h-24 object-cover" />
          <p className="text-red-400 mt-2">Welcome Back!</p>
          <h3 className="font-semibold">Keertii Sharma</h3>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-red-500 underline">Answers:</h2>
        <div className="space-y-8 mt-6">
          {answers.map((ans, index) => (
            <div
              key={index}
              className="border rounded-xl shadow-sm p-4 space-y-3"
            >
              <div className="flex items-center gap-3">
                <img src={ans.avatar} className="w-10 h-10 rounded-full" />
                <h4 className="font-bold">{ans.name}</h4>
              </div>
              <p className="whitespace-pre-line font-medium text-sm md:text-base">
                {ans.text}
              </p>
              <div className="flex items-center gap-6 mt-2">
                <button className="flex items-center gap-1">❤ {ans.likes}</button>
                <button className="flex items-center gap-1">💬 {ans.comments}</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      
    </div>
  );
}