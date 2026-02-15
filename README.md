# Review - Intelligent Learning Companion

Review is a modern, AI-powered learning management application designed to help you master new topics through spaced repetition, interactive quizzes, and intelligent insights.

## Features

### 🧠 Smart Learning
*   **Spaced Repetition**: Automatically schedules reviews based on your performance (Easy, Medium, Hard).
*   **Streak Tracking**: Keeps you motivated by tracking daily learning activity.
*   **Topic Management**: Organize your learning notes and track progress per topic.

### 🤖 AI-Powered Integations
*   **AI Quiz Generator**: Generate quizzes on any topic to test your knowledge.
*   **Specialist Agent**: Deep-dive into complex topics with a dedicated AI tutor that diagnoses your understanding.
*   **Strategist Insights**: Get personalized advice on what to study next based on your weak areas.

### 🛠️ Tech Stack
*   **Framework**: Next.js 15 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS & Shadcn UI
*   **Database**: MongoDB (Mongoose & Native Driver)
*   **Authentication**: Better-Auth
*   **AI**: Gemini / Google Generative AI

## Getting Started

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Environment**:
    Copy `.env.example` to `.env` and fill in your API keys:
    ```bash
    cp .env.example .env
    ```
4.  **Run the development server**:
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to start learning!

## Project Structure

*   `src/app`: App router pages and API routes.
*   `src/components/ui`: Reusable UI components (Shadcn).
*   `src/components/ai-elements`: AI-specific UI components (Chat, Terminal, etc.).
*   `src/lib`: Utility functions, database connection, and auth setup.
*   `src/models`: Mongoose schemas.
