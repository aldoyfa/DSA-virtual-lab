# DSA Virtual Lab - Interactive Algorithm Learning Platform

A comprehensive full-stack application for learning and practicing data structures and algorithms with interactive visualizations, user authentication, and progress tracking.

![React](https://img.shields.io/badge/React-18.3.1-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF.svg)
![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.2.7-764ABC.svg)
![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)
![Prisma](https://img.shields.io/badge/Prisma-5.20.0-2D3748.svg)

## 🌐 Live Demo

**🚀 Try it now: [aldoy.ykd.dev](https://aldoy.ykd.dev)**

The application is live and fully functional! You can:
- Practice sorting algorithm visualizations
- Try the Alpha-Beta pruning interactive exercises
- Create an account to track your progress
- View your score history and statistics

*No installation required - just visit the link and start learning!*

## ✨ Features

### Sorting Algorithms Visualizer
- **4 Sorting Algorithms**: Bubble Sort, Quick Sort, Merge Sort, and Heap Sort
- **Real-time Visualization**: Watch algorithms work step-by-step with color-coded animations
- **Interactive Controls**: Adjust array size and speed, generate new arrays
- **State Persistence**: Save and load your visualization sessions

### Alpha-Beta Pruning Practice (NEW!)
- **Interactive Tree Visualization**: Practice alpha-beta pruning on randomly generated game trees
- **Scoring System**: Get scored based on correctness and efficiency of your solutions
- **Score History**: Track your progress with persistent score tracking
- **Solution Verification**: Check your answers against the optimal alpha-beta solution
- **Multiple Tree Types**: Practice on different tree configurations (depth, branching factor)

### Authentication & User Management
- **Secure User Registration**: Create accounts with username/email validation
- **JWT Authentication**: Industry-standard token-based authentication
- **Session Persistence**: Stay logged in across browser sessions
- **User Profiles**: Track individual progress and scores

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm
- PostgreSQL 16+ (or use Docker)

### Quick Start with Docker (Recommended)

The easiest way to run the entire application with frontend, backend, and database:

```bash
# Clone the repository
git clone https://github.com/aldoyfa/DSA-virtual-lab.git
cd DSA-virtual-lab

# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Access the application
# Frontend: http://localhost:15012
# Backend API: http://localhost:5000
# Database: localhost:5432
```

### Manual Installation

#### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/aldoyfa/DSA-virtual-lab.git
   cd DSA-virtual-lab
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

#### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Run database migrations:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

6. Backend API will be available at [http://localhost:5000](http://localhost:5000)

For detailed backend setup instructions, see [backend/README.md](./backend/README.md)

### Build for Production

**Frontend:**
```bash
npm run build
```

**Backend:**
```bash
cd backend
npm run prisma:deploy
npm start
```

The built files will be in the `dist` directory, ready for deployment.

## 🎨 How to Use

### Sorting Visualizer
1. **Generate Array**: Click "Generate New Array" to create a random array
2. **Adjust Settings**: Use sliders to change array size and animation speed  
3. **Select Algorithm**: Choose from Bubble, Quick, Merge, or Heap Sort
4. **Start Sorting**: Click "Sort!" to begin the visualization

### Alpha-Beta Pruning Practice
1. **Generate Tree**: Create a new game tree with specified depth and branching factor
2. **Fill Values**: Input alpha and beta values for each node following the minimax algorithm
3. **Mark Pruning**: Toggle nodes that should be pruned during alpha-beta search
4. **Check Answer**: Verify your solution and receive a score based on correctness
5. **View History**: Track your progress with the score history feature

### Authentication
1. **Register**: Create a new account with username and email
2. **Login**: Sign in to access practice modules and save progress
3. **Profile**: View your statistics and score history
4. **Logout**: Securely end your session

## 🛠 Tech Stack

### Frontend
- **React 18.3.1** - Modern React with hooks and functional components
- **Redux Toolkit 2.2.7** - Simplified Redux with modern patterns
- **Vite 5.4.1** - Fast build tool and development server
- **ESLint** - Code linting and formatting
- **Modern CSS** - Flexbox, Grid, CSS custom properties

### Backend
- **Node.js 20+** - JavaScript runtime
- **Express.js** - Web framework
- **Prisma 5.20.0** - Modern ORM for PostgreSQL
- **PostgreSQL 16** - Relational database
- **JWT (jsonwebtoken 9.0.2)** - Secure authentication tokens
- **Bcrypt.js 2.4.3** - Password hashing and validation
- **CORS 2.8.5** - Cross-origin resource sharing
- **Cookie Parser 1.4.6** - HTTP cookie parsing middleware

### DevOps & Infrastructure
- **Docker** - Containerization platform
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and load balancer
- **Environment Variables** - Secure configuration management

### Authentication System
- **JWT Tokens** - Stateless authentication with configurable expiration
- **React Context API** - Global authentication state management

## 📁 Project Structure

```
DSA-virtual-lab/
├── client/                      # Frontend React application
│   ├── index.html              # Entry HTML file
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.js         # Vite configuration
│   └── src/
│       ├── main.jsx           # React app entry point
│       ├── App.jsx            # Main app component with routing
│       ├── components/        # React components
│       │   ├── Toolbar/       # Sorting visualizer control panel
│       │   ├── Visualizer/    # Array visualization component
│       │   └── AlphaBeta/     # Alpha-Beta practice components
│       │       ├── AlphaBeta.jsx        # Main Alpha-Beta component
│       │       ├── AlphaBetaToolbar.jsx # Alpha-Beta toolbar
│       │       └── *.css                # Component styles
│       ├── algorithms/        # Algorithm implementations
│       │   ├── bubbleSort.js
│       │   ├── quickSort.js
│       │   ├── mergeSort.js
│       │   ├── heapSort.js
│       │   ├── alphaBeta.js   # Alpha-Beta pruning algorithm
│       │   └── index.js
│       ├── context/           # React Context providers
│       │   └── AuthContext.jsx # Authentication context
│       └── store/             # Redux store
│           ├── store.js
│           └── slices/
│               ├── arraySlice.js
│               ├── algorithmSlice.js
│               └── visualizationSlice.js
├── backend/                    # Backend API server
│   ├── src/
│   │   ├── middleware/
│   │   │   ├── auth.js        # JWT authentication middleware
│   │   │   └── errorHandler.js # Error handling middleware
│   │   ├── routes/
│   │   │   ├── auth.js        # Authentication endpoints
│   │   │   ├── states.js      # State management endpoints
│   │   │   └── alphabeta.js   # Alpha-Beta score endpoints
│   │   ├── utils/
│   │   │   ├── jwt.js         # JWT utilities
│   │   │   └── password.js    # Password hashing utilities
│   │   └── server.js          # Express app configuration
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema with User, UserState, AlphaBetaScore
│   │   └── migrations/        # Database migration files
│   ├── package.json           # Backend dependencies
│   └── Dockerfile             # Backend container configuration
├── docker-compose.yml         # Multi-container orchestration
├── Dockerfile                 # Frontend container configuration
└── README.md                  # This file
```

## 📚 API Documentation

**Available Endpoints:**
- **Authentication**: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/verify`
- **State Management**: `/api/states` (GET, POST, PUT, DELETE)
- **Alpha-Beta Scores**: `/api/alphabeta/scores` (GET, POST), `/api/alphabeta/stats`

**Features:**
- JWT-based authentication with refresh tokens
- Request/response examples for all endpoints
- Error handling and status codes
- Rate limiting and validation rules

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Original concept from the classic sorting visualizer
- Modern React patterns and Redux Toolkit
- Educational focus on algorithm understanding