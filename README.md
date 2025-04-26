# ✍️ WitScribe

WitScribe is a modern AI-powered learning and quiz platform that helps users summarize YouTube videos, generate topic-wise notes, play interactive quizzes, and even listen to study material. It’s built with the powerful MERN stack and integrates various APIs to deliver a seamless, engaging experience.

---

## 🔥 Features

- 🎬 **YouTube Summarizer** – Paste a YouTube link and get a smart summary of the content
- 🤖 **AI-based Q&A** – Ask questions related to the video or topic and get intelligent responses
- 📝 **Note Generator** – Generate structured notes from videos or topics instantly
- 🔊 **Text-to-Speech** – Listen to your notes like an audiobook
- ❓ **Quiz Mode** – Play topic-wise quizzes to reinforce your learning
- 🎯 **Real-time Feedback** – Instant scoring and answer highlighting
- 📊 **Score Tracking** – Keep track of quiz performance
- 💡 **Responsive UI** – Designed with modern Tailwind CSS

---

## 🧰 Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **APIs**: OpenAI, YouTube Data API, Text-to-Speech API

---

## 🛠️ Prerequisites

Make sure the following tools are installed before setup:

- Node.js (v16 or higher)
- npm (v6 or higher)
- Git
- MongoDB (Local or Atlas)

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/lasikarathore/WitScribe.git
cd WitScribe ```

# 2. Install Dependencies

```bash
npm install
```

If you face warnings related to deprecated packages, install them explicitly:

```bash
npm install inflight@1.0.6 npmlog@5.0.1 rimraf@3.0.2 glob@7.2.3 are-we-there-yet@2.0.0 gauge@3.0.2
```

# 3. Create Environment Variables

Create a `.env` file in your root directory and add the following:

```env
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_YOUTUBE_API_KEY=your_youtube_api_key
VITE_TTS_API_KEY=your_text_to_speech_key
MONGODB_URI=your_mongodb_connection_uri
```

# ⚠️ Deprecated Dependencies

These packages are included in the project and may show warnings during installation:

- `inflight@1.0.6`: This module is not supported and leaks memory.
- `npmlog@5.0.1`: This package is no longer supported.
- `rimraf@3.0.2`: Rimraf versions prior to v4 are no longer supported.
- `glob@7.2.3`: Glob versions prior to v9 are no longer supported.
- `are-we-there-yet@2.0.0`: This package is no longer supported.
- `gauge@3.0.2`: This package is no longer supported.

# 💻 Development

Start development server:

```bash
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

## Build for Production

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

# 🧪 Useful Commands

```bash
npm audit fix          # Fix known vulnerabilities
npm audit fix --force  # Force fix deprecated issues
npm fund               # View dependencies seeking funding
```

# 🧾 Project Structure

```
WitScribe/
├── src/
│   ├── Components/
│   │   └── ...
│   ├── Pages/
│   │   └── ...
│   ├── App.jsx
│   └── index.js
├── public/
├── .env
├── package.json
└── README.md
```

# 🧯 Common Issues

## Module Not Found
- Run `npm install`
- Check import paths

## Port Already in Use
On Mac/Linux:

```bash
lsof -i :5173
kill -9 <PID>
```

## Tailwind CSS Not Working
- Ensure Tailwind config is present
- Run `npx tailwindcss init` if needed
- Validate PostCSS setup

## Env Variables Not Working
- Confirm `.env` exists and variables start with `VITE_`
- Restart dev server

# 🔐 API

(Documentation coming soon!)

