"use client"
import { useLocation, Link } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import { useState, useEffect } from "react"
import Navbar from '../Components/Navbar'

const Notes = () => {
  const location = useLocation()
  const { transcript, notes, videoId, lang, availableLangs } = location.state || {}
  const [parsedTranscript, setParsedTranscript] = useState([])
  const [parsedNotes, setParsedNotes] = useState([])
  const [showFullTranscript, setShowFullTranscript] = useState(false)

  useEffect(() => {
    // Parse transcript into timestamped lines
    if (transcript) {
      const lines = transcript.split("\n").filter((line) => line.trim() !== "")
      // Only show first 13 lines initially (matching the design)
      setParsedTranscript(lines)
    }

    // Parse notes into sections
    if (notes) {
      // Simple parsing logic - this can be enhanced based on your notes structure
      const sections = []
      let currentSection = null

      const lines = notes.split("\n")

      lines.forEach((line) => {
        // Check if line is a heading (starts with #)
        if (line.startsWith("# ")) {
          if (currentSection) {
            sections.push(currentSection)
          }
          currentSection = {
            id: sections.length + 1,
            title: line.replace("# ", ""),
            points: [],
          }
        } else if (line.startsWith("## ")) {
          if (currentSection) {
            sections.push(currentSection)
          }
          currentSection = {
            id: sections.length + 1,
            title: line.replace("## ", ""),
            points: [],
          }
        } else if (line.startsWith("- ") && currentSection) {
          currentSection.points.push(line.replace("- ", ""))
        } else if (line.trim() !== "" && currentSection) {
          // Add non-empty lines that aren't bullet points as regular text
          currentSection.points.push(line)
        }
      })

      if (currentSection) {
        sections.push(currentSection)
      }

      setParsedNotes(sections)
    }
  }, [transcript, notes])

  if (!transcript || !notes) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-4">
        <p>No data available. Please go back and try again.</p>
        <Link to="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>
    )
  }

  // Format transcript line with timestamp if available
  const formatTranscriptLine = (line) => {
    // Try to extract timestamp pattern like "00:00:00.000"
    const timeMatch = line.match(/(\d{2}:\d{2}:\d{2}|\d{2}:\d{2})/)
    if (timeMatch) {
      const time = timeMatch[0]
      const text = line.replace(timeMatch[0], "").trim()
      return { time, text }
    }
    return { time: "", text: line }
  }

  // Get a limited number of transcript lines for display
  const displayTranscriptLines = showFullTranscript ? parsedTranscript : parsedTranscript.slice(0, 13)

  return (
    <div className="min-h-screen">
      
      <Navbar />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto mt-14 flex flex-col md:flex-row gap-6 px-4">
        {/* Left Column - Video and Transcript */}
        <div className="md:w-1/3">
          {/* Video Player */}
          <div className="relative bg-black rounded-lg overflow-hidden">
            {videoId ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full aspect-video"
              ></iframe>
            ) : (
              <div className="w-full aspect-video bg-gray-800 flex items-center justify-center">
                <div className="text-white">Video Unavailable</div>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
                <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-white ml-1"></div>
              </div>
            </div>
            
          </div>

          {/* Transcript Section */}
          <div className="mt-4">
            <div className="flex items-center mb-2">
              <h3 className="font-bold">Transcript</h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <ul className="list-disc pl-5 space-y-1">
              {displayTranscriptLines.map((line, index) => {
                const { time, text } = formatTranscriptLine(line)
                return (
                  <li key={index} className="text-sm">
                    {time && <span className="font-mono">{time}</span>}
                    <span className="ml-1">{text}</span>
                  </li>
                )
              })}
            </ul>
            <button
              className="mt-4 flex items-center text-gray-700"
              onClick={() => setShowFullTranscript(!showFullTranscript)}
            >
              {showFullTranscript ? "Show Less" : "Read More"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Quiz Section */}
          <div className="mt-8 bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold">
              <span className="text-black">Play</span> <span className="text-gray-300">Quiz</span>
            </h2>
          </div>
        </div>

        {/* Right Column - Notes */}
        <div className="md:w-2/3 bg-gray-300 rounded-lg p-4">
          {/* Structured Notes */}
          {parsedNotes.length > 0 ? (
            parsedNotes.map((section) => (
              <div key={section.id} className="mb-6">
                <h3 className="font-bold mb-2">
                  {section.id}. {section.title}
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  {section.points.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <div className="prose max-w-none">
              <ReactMarkdown>{notes}</ReactMarkdown>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-6">
            <button
              onClick={() => {
                const element = document.createElement("a")
                const file = new Blob([notes], { type: "text/markdown" })
                element.href = URL.createObjectURL(file)
                element.download = "youtube_notes.md"
                document.body.appendChild(element)
                element.click()
                document.body.removeChild(element)
              }}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex-1 text-center"
            >
              Download
            </button>
            <button className="bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-lg flex-1 text-center">
              Read Aloud
            </button>
          </div>

          {/* Accordion Question */}
          <div className="mt-6 bg-gray-200 rounded-lg p-4 flex justify-between items-center">
            <div className="font-medium">How is WebSocket different from HTTP?</div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notes
