import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Supadata API key
  const API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IjEifQ.eyJpc3MiOiJuYWRsZXMiLCJpYXQiOiIxNzQ1Mjg4MzYyIiwicHVycG9zZSI6ImFwaV9hdXRoZW50aWNhdGlvbiIsInN1YiI6Ijc4OTc3Y2U3MjZmMzRiZDFhZTcwOTJlMTcyOGY1ODIxIn0.-ikSG1v9D6csDJaNWLpz7ct4dRdyHQTxN1CffJKegTQ';
  const GEMINI_API_KEY = 'AIzaSyA6j1QQ77ETh5v7ImpSCWT6ZCWVDlGnOSg';

  const getYouTubeVideoId = (url) => {
    // More comprehensive regex to catch more YouTube URL formats
    const regexes = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/user\/\S+\/\S+\/\S+|youtube\.com\/user\/\S+\/\S+|youtube\.com\/\S+\/\S+\/\S+|youtube\.com\/\S+\/\S+|youtube\.com\/\S+)([^"&?\/\s]{11})/,
      /(?:youtube\.com.*(?:v=|\/v\/|\/embed\/)|youtu\.be\/)([^"&?\/\s]{11})/
    ];
    
    for (const regex of regexes) {
      const match = url.match(regex);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  const getTranscript = async () => {
    if (!videoUrl) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Extract video ID first to make sure we have a valid YouTube URL
      const videoId = getYouTubeVideoId(videoUrl);
      
      if (!videoId) {
        setError('Invalid YouTube URL. Please enter a valid YouTube video link.');
        setLoading(false);
        return;
      }
      
      // Option 1: Try with direct videoId parameter first (more reliable)
      console.log(`Fetching transcript for video ID: ${videoId}`);
      
      const response = await fetch(`https://api.supadata.ai/v1/youtube/transcript?videoId=${videoId}&text=true`, {
        method: 'GET',
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        }
      });
      
      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error('Error parsing JSON response:', e);
        throw new Error('Invalid response from transcript API');
      }
      
      console.log('API Response:', data);
      
      if (!response.ok) {
        const errorMsg = data?.message || `API error: ${response.status}`;
        console.error('Transcript API error:', errorMsg);
        throw new Error(errorMsg);
      }
      
      if (!data?.content) {
        throw new Error('No transcript found for this video');
      }
      
      // Step 2: Process with Gemini
      console.log('Fetching notes from Gemini...');
      
      const notesResponse = await processWithGemini(data.content, videoId);
      
      // Step 3: Navigate to notes page with both transcript and generated notes
      console.log('Processing complete, navigating to notes page');
      
      navigate('/notes', { 
        state: { 
          transcript: data.content,
          notes: notesResponse,
          videoId: videoId,
          videoUrl: videoUrl,
          lang: data.lang || 'en',
          availableLangs: data.availableLangs || ['en']
        } 
      });
    } catch (err) {
      console.error('Error in processing:', err);
      setError(err.message || 'Something went wrong while processing the video');
    } finally {
      setLoading(false);
    }
  };

  const processWithGemini = async (transcript, videoId) => {
    // Use a shorter version of the transcript if it's too long
    const truncatedTranscript = transcript.length > 30000 
      ? transcript.substring(0, 30000) + "... (transcript truncated due to length)"
      : transcript;
      
    // Setup Gemini API request - FIXED ENDPOINT URL
    const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const payload = {
      contents: [{
        parts: [{
          text: `Create comprehensive, well-structured notes from the following YouTube video transcript. 
          Break it down into sections with clear headings, highlight key points, and summarize main ideas.
          Format the response in markdown.
          
          TRANSCRIPT:
          ${truncatedTranscript}`
        }]
      }],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    };

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      console.log('Gemini API response status:', response.status);
      
      if (!response.ok || data.error) {
        console.error('Gemini API error:', data.error || response.statusText);
        throw new Error('Failed to generate notes with AI');
      }
      
      // Extract the text from the Gemini response
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.error('Unexpected Gemini response structure:', data);
        throw new Error('Invalid response format from AI service');
      }
    } catch (error) {
      console.error('Error in Gemini processing:', error);
      throw new Error('AI processing failed: ' + error.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      getTranscript();
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      
      <h1 className="text-2xl font-bold mb-4">YouTube Video Notes Generator</h1>
      <p className="mb-4 text-gray-600">Enter a YouTube URL to generate smart notes using Gemini AI</p>
      
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste YouTube link and press Enter"
          className="w-full p-2 border border-gray-300 rounded"
          disabled={loading}
        />
        
        <button 
          onClick={getTranscript} 
          disabled={loading || !videoUrl}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded disabled:bg-blue-300"
        >
          {loading ? 'Processing...' : 'Generate Notes'}
        </button>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}
      
      {loading && (
        <div className="mt-6 text-center">
          <p className="text-gray-600">This may take a minute or two...</p>
          <div className="mt-2 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
// AIzaSyAW_laDPfgmVe2vzvFPRPAVfUHd6cSm2D4