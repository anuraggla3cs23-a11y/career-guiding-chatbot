Smart Career Guidance Chatbot 🚀
Smart Career Guidance Chatbot helps students discover personalized career paths through an interactive conversation. It asks about education level, interests, and goals, then provides detailed recommendations with salaries, skills, and learning resources.

✨ Key Features
🎯 Smart Career Matching - Maps education + interests to 100+ career paths

💬 Interactive Chat Interface - Natural conversation flow with typing indicators

📱 Voice Input Support - Speak your responses (Chrome/Edge)

📄 PDF Report Generator - Download personalized career plans

💾 Session Persistence - Conversation saves in browser localStorage

🔄 One-Click Restart - Start fresh anytime

🎮 Demo Flow
text
Bot: Hi! What's your education level?
You: After 12th
Bot: Great! Which subject interests you most?
You: Computer Science
Bot: Awesome! What's your dream role?
You: Software Engineer
Bot: Here's your personalized plan → [Career Cards + Resources + PDF Download]
🛠 Tech Stack
text
Frontend: React 18 + Hooks
PDF: jsPDF 2.5.1
Storage: localStorage
Voice: Web Speech API
Icons: FontAwesome (CDN)
Fonts: Google Fonts (Inter)
🚀 Quick Start
Prerequisites
Node.js 16+

npm/yarn

Installation
bash
# Create React app
npx create-react-app career-guidance-chatbot
cd career-guidance-chatbot

# Install dependency
npm install jspdf

# Replace src/App.js with chatbot code
npm start
Live at: http://localhost:3000

📁 Project Structure
text
career-guidance-chatbot/
├── public/
├── src/
│   ├── App.js           # Main Chatbot Component
│   ├── App.css         # Chat styling
│   └── index.js
├── package.json
└── README.md
🎨 Supported Career Paths
Education Level	Streams
After 10th	Science, Commerce, Arts, Computer, Design, Other
After 12th	Engineering, Medicine, B.Tech, CA, Journalism, UI/UX
College	Data Science, MBA, Full Stack, Product Design
Graduate	AI/ML, Investment Banking, UX Research, Startups
Each path includes:

Salary ranges & growth projections

Entry requirements & steps

Top companies hiring

Learning resources (YouTube, Websites, GitHub)

📱 Screenshots
text
[Header with Bot Avatar + Action Buttons]
[Chat Window - Messages + Typing Dots]
[Input Bar - Voice + Text + Send]
[Career Cards - Rich HTML Responses]
[PDF Download - Complete Report]
🔧 Customization
Add New Career Paths
javascript
careerMatrix.after10th.newStream = {
  headline: "Your Headline",
  careers: [...],
  resources: { websites: [], youtube: [], github: [] }
}
Connect to AI Backend
javascript
// Replace static responses with API
const botResponse = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ message: userInput })
});
🚀 Deployment
Vercel (Recommended - 1 minute)
bash
npm install -g vercel
vercel --prod
Netlify
text
Drag/drop `build/` folder to netlify.com
GitHub Pages
bash
npm run build
# Deploy `build/` folder
📊 Career Matrix Highlights
Stream	Top Careers	Avg Salary	Growth
Computer	Full Stack, AI/ML	₹8-24L	⭐⭐⭐⭐⭐
Science	B.Tech, MBBS	₹7-20L	⭐⭐⭐⭐
Commerce	CA, MBA	₹8-28L	⭐⭐⭐⭐
Design	UI/UX, Product	₹7-14L	⭐⭐⭐⭐
🤝 Contributing
Fork repository

Add new career paths to careerMatrix

Update resources/links

Submit PR

📄 License
text
MIT License - Free for personal/educational use
Modify career data for your region/syllabus
🙋‍♂️ Support
Issues: GitHub Issues tab

Voice not working? Use Chrome/Edge

Need more careers? Add to careerMatrix

Built with ❤️ for students exploring their future! 🎓✨
