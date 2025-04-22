import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Navbar from '../Components/Navbar';

const Notes = () => {
  const location = useLocation();
  const { transcript, notes, videoId, lang, availableLangs } = location.state || {};

  if (!transcript || !notes) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-4">
        <p>No data available. Please go back and try again.</p>
        <Link to="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="max-w-4xl mx-auto my-8 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Generated Notes</h1>
        <Link to="/" className="text-blue-500 hover:underline">
          Generate New Notes
        </Link>
      </div>

      {/* Video Embed */}
      {videoId && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Source Video</h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-64 border-0"
            ></iframe>
          </div>
          
          {/* Language Information */}
          {lang && (
            <div className="mt-2 text-sm text-gray-600">
              <span>Transcript language: <span className="font-medium">{lang.toUpperCase()}</span></span>
              {availableLangs && availableLangs.length > 1 && (
                <span className="ml-2">
                  (Also available in: {availableLangs.filter(l => l !== lang).map(l => l.toUpperCase()).join(', ')})
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tabs for Notes and Raw Transcript */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              id="notes-tab"
              className="py-2 px-4 border-b-2 border-blue-500 font-medium text-blue-600"
              onClick={() => {
                document.getElementById('notes-content').classList.remove('hidden');
                document.getElementById('transcript-content').classList.add('hidden');
                document.getElementById('notes-tab').classList.add('border-blue-500', 'text-blue-600');
                document.getElementById('notes-tab').classList.remove('border-transparent', 'text-gray-500');
                document.getElementById('transcript-tab').classList.remove('border-blue-500', 'text-blue-600');
                document.getElementById('transcript-tab').classList.add('border-transparent', 'text-gray-500');
              }}
            >
              AI Generated Notes
            </button>
            <button
              id="transcript-tab"
              className="py-2 px-4 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              onClick={() => {
                document.getElementById('transcript-content').classList.remove('hidden');
                document.getElementById('notes-content').classList.add('hidden');
                document.getElementById('transcript-tab').classList.add('border-blue-500', 'text-blue-600');
                document.getElementById('transcript-tab').classList.remove('border-transparent', 'text-gray-500');
                document.getElementById('notes-tab').classList.remove('border-blue-500', 'text-blue-600');
                document.getElementById('notes-tab').classList.add('border-transparent', 'text-gray-500');
              }}
            >
              Raw Transcript
            </button>
          </nav>
        </div>
      </div>

      {/* Notes Content */}
      <div id="notes-content" className="prose max-w-none">
        <ReactMarkdown>{notes}</ReactMarkdown>
      </div>

      {/* Transcript Content (Hidden by Default) */}
      <div id="transcript-content" className="hidden">
        <div className="bg-gray-50 p-4 rounded shadow overflow-auto max-h-96">
          <pre className="whitespace-pre-wrap">{transcript}</pre>
        </div>
      </div>

      {/* Download Options */}
      <div className="mt-8 flex space-x-4">
        <button
          onClick={() => {
            const element = document.createElement('a');
            const file = new Blob([notes], {type: 'text/markdown'});
            element.href = URL.createObjectURL(file);
            element.download = 'youtube_notes.md';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          }}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          Download Notes (MD)
        </button>
        <button
          onClick={() => {
            const element = document.createElement('a');
            const file = new Blob([transcript], {type: 'text/plain'});
            element.href = URL.createObjectURL(file);
            element.download = 'transcript.txt';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          }}
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
        >
          Download Transcript
        </button>
      </div>
    </div>
    </>
  );
};

export default Notes;