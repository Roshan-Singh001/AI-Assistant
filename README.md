# Simpl-AI: A Generative AI Chatbot with Speech Recognition & History Management

Welcome to **Simpl-AI**, a modern AI-powered chatbot built with the **Google Gemini API**, **React.js**, **Node.js**, and **MySQL**. This project offers an intuitive platform for real-time conversations with an AI, featuring a history sidebar that allows users to search, edit, and delete previous interactions.

## 🚀 Features

- **Generative AI Conversations**: Utilize the power of **Google Gemini API** to generate real-time AI responses.
- **Speech Recognition**: Supports voice commands for hands-free interaction via the **React Speech Recognition** library. (Only Chrome Browser Supported)
- **Chat History Management**: Search, edit, and delete past conversations in an intuitive sidebar.
- **Real-Time Interaction**: Built with **React.js** for fast and dynamic updates.
- **Full-Stack Application**: Powered by **Node.js** backend, **MySQL** database, and **Axios** for API calls.

## 📸 Screenshots

#### Main Chat Interface:
![Main Chat](screenshots/chat_interface.png)

#### History Sidebar:
![History Sidebar](screenshots/history_sidebar.png)

#### Speech Recognition in Action:
![Speech Recognition](screenshots/speech_recognition.png)

## 🔧 Tech Stack

- **Frontend**:
  - React.js with **Hooks** and **Context API** for state management
  - **React Speech Recognition** for voice commands
  - **Axios** for HTTP requests
  - **React Toastify** for notifications
- **Backend**:
  - **Node.js** with **Express.js** for the server
  - **MySQL** database for storing chat instances and user data
  - **Google Gemini API** for AI-generated content
- **Other**:
  - **UUID** for unique identifiers
  - **Regenerator Runtime** for asynchronous code

## 🛠️ Installation

### Prerequisites

- **Node.js**: Make sure you have **Node.js** (version 14 or above) installed. You can download it from [here](https://nodejs.org/).
- **MySQL**: You need a MySQL server running for the backend to store chat instances.

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Roshan-Singh001/AI-Assistant
   cd AI-Assistant-ai
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Set up your MySQL database:
   - Create a new database and configure the necessary tables for storing chat instances.
   - Update the database credentials in the `config.js` file.

4. Start the backend server:

   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install frontend dependencies:

   ```bash
   npm install
   ```

3. Set your Google Gemini API key in the `.env` file:

   ```
   VITE_API_KEY=your_google_gemini_api_key
   ```

4. Start the React development server:

   ```bash
   npm start
   ```

5. Visit `http://localhost:3000` to view the application in your browser.

## ⚙️ Usage

- **Start a New Chat**: Click the "Start a Chat" button to initiate a fresh conversation with the AI.
- **Search Chat History**: Use the search bar in the **History Sidebar** to quickly find past chats.
- **Edit Chat Topics**: Click the edit icon next to any chat instance to update the topic.
- **Voice Input**: Use the microphone button to input messages via speech recognition.

## 📝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature-branch`)
6. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### 🤖 Powered by:

- **Google Gemini API** for generative AI
- **React.js** for building interactive user interfaces
- **Node.js** and **MySQL** for backend and database management
- **Speech Recognition** for hands-free interaction
