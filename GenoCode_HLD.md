# High-Level Design (HLD) - GenoCode

## 1. Project Overview

GenoCode is a full-stack competitive programming platform that simulates platforms like LeetCode, Codeforces, and HackerRank. The system enables users to:

- **View and solve programming problems** with detailed descriptions and test cases
- **Write and execute code** in multiple programming languages (C++, Java, Python, JavaScript)
- **Get real-time verdicts** including Accepted, Wrong Answer, Time Limit Exceeded, Compilation Error, and Runtime Error
- **Submit solutions** with automated test case validation
- **Access AI-powered code reviews** for improvement suggestions
- **Manage user profiles** with submission history and statistics
- **Create and manage problems** (admin functionality)

The platform is designed with a microservices architecture, featuring isolated code execution for security and scalability.

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                CLIENT LAYER                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │   React App     │    │   Monaco Editor │    │   Tailwind CSS  │         │
│  │   (Vite)        │    │   (Code Editor) │    │   (Styling)     │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│           │                       │                       │                 │
│           └───────────────────────┼───────────────────────┘                 │
│                                   │                                         │
└───────────────────────────────────┼─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY LAYER                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │   Backend API   │    │   Compiler      │    │   File Service  │         │
│  │   (Express.js)  │    │   Service       │    │   (Cloudinary)  │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│           │                       │                       │                 │
│           └───────────────────────┼───────────────────────┘                 │
│                                   │                                         │
└───────────────────────────────────┼─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SERVICE LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │   User Service  │    │   Problem       │    │   Submission    │         │
│  │   (Auth/JWT)    │    │   Service       │    │   Service       │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│           │                       │                       │                 │
│           └───────────────────────┼───────────────────────┘                 │
│                                   │                                         │
└───────────────────────────────────┼─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │   MongoDB       │    │   Docker        │    │   AI Review     │         │
│  │   (Database)    │    │   Containers    │    │   Service       │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 3. Module Breakdown

### 3.1 Frontend Module (`client/`)
**Purpose**: User interface and interaction layer

**Key Components**:
- **React Application**: Main UI framework with Vite for fast development
- **Monaco Editor**: Professional code editor with syntax highlighting
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **React Router**: Client-side routing for SPA navigation
- **Framer Motion**: Animation library for smooth transitions

**Screens**:
- `Home.jsx`: Landing page
- `Login.jsx` & `Register.jsx`: Authentication screens
- `Practice.jsx`: Problem listing with search and filtering
- `Problem.jsx`: Individual problem view with code editor
- `Create.jsx` & `Update.jsx`: Admin problem management
- `User.jsx` & `EditUser.jsx`: User profile management

### 3.2 Backend API Module (`server/`)
**Purpose**: Business logic and data management

**Key Components**:
- **Express.js Server**: RESTful API endpoints
- **Mongoose ODM**: MongoDB object modeling
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Request sanitization and validation
- **Error Handling**: Centralized error management

**Controllers**:
- `user.js`: User registration, login, profile management
- `problem.js`: Problem CRUD operations
- `submission.js`: Submission handling and history

### 3.3 Compiler Service Module (`compiler/`)
**Purpose**: Secure code execution and compilation

**Key Components**:
- **Process Isolation**: Isolated code execution using child_process
- **Multi-language Support**: C++, Java, Python, JavaScript
- **Timeout Management**: 3-second execution limit
- **File Management**: Temporary file creation and cleanup
- **AI Integration**: Google GenAI for code review

**Services**:
- `executionService.js`: Core code execution logic using spawn
- `fileService.js`: File operations and cleanup
- `submissionService.js`: Test case validation
- `reviewService.js`: AI-powered code review using Google GenAI

### 3.4 Database Module
**Purpose**: Data persistence and management

**Key Components**:
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose Schemas**: Data modeling and validation
- **Indexing**: Performance optimization for queries
- **Connection Pooling**: Efficient database connections

## 4. Technology Stack

### 4.1 Frontend Technologies
```
React 19.1.0       - UI framework
Vite 6.3.5         - Build tool and dev server
Tailwind CSS 3.4.17 - Utility-first CSS framework
Monaco Editor 4.7.0 - Professional code editor
React Router 7.6.2 - Client-side routing
Framer Motion 12.23.0 - Animation library
Axios 1.10.0       - HTTP client
React Icons 5.5.0  - Icon library
React Markdown 10.1.0 - Markdown rendering
Lucide React 0.525.0 - Icon library
JWT Decode 4.0.0   - JWT token decoding
```

### 4.2 Backend Technologies
```
Node.js             - JavaScript runtime
Express.js 5.1.0    - Web framework
Mongoose 8.15.2     - MongoDB ODM
bcryptjs 3.0.2      - Password hashing
jsonwebtoken 9.0.2  - JWT authentication
multer 2.0.1        - File upload handling
multer-storage-cloudinary 4.0.0 - Cloudinary integration
cors 2.8.5          - Cross-origin resource sharing
dotenv 16.5.0       - Environment variable management
express-validator 7.2.1 - Input validation
```

### 4.3 Compiler Service Technologies
```
Node.js             - JavaScript runtime
Express.js 5.1.0    - Web framework
child_process       - Process spawning (spawn)
fs                  - File system operations
path                - Path utilities
@google/genai 1.7.0 - AI code review integration
Bull 4.16.5         - Job queue management
ioredis 5.6.1       - Redis client
uuid 11.1.0         - Unique identifier generation
```

### 4.4 Database & Storage
```
MongoDB             - NoSQL database
Cloudinary 1.41.3   - Media storage and CDN
```

### 4.5 Development & Deployment
```
Git                - Version control
npm                - Package management
ESLint 9.25.0      - Code linting
PostCSS 8.5.6      - CSS processing
Autoprefixer 10.4.21 - CSS vendor prefixing
```

## 5. Data Flow

### 5.1 User Authentication Flow
```
1. User enters credentials on Login/Register page
2. Frontend sends POST request to /api/auth/login or /api/auth/register
3. Backend validates credentials and generates JWT token
4. JWT token stored in localStorage
5. Subsequent requests include Authorization header with JWT
6. Backend middleware validates JWT for protected routes
```

### 5.2 Code Execution Flow
```
1. User writes code in Monaco Editor
2. User clicks "Run" button
3. Frontend sends POST request to /compiler/run with:
   - code: source code
   - language: programming language
   - input: test input (optional)
4. Compiler Service:
   a. Creates temporary file with user code
   b. Spawns child process with language runtime
   c. Executes code with input
   d. Monitors execution time (3-second limit)
   e. Captures stdout/stderr
   f. Cleans up temporary files
5. Returns execution result to frontend
6. Frontend displays output or error message
```

### 5.3 Code Submission Flow
```
1. User clicks "Submit" button
2. Frontend sends POST request to /compiler/submit with:
   - code: source code
   - language: programming language
   - problemId: target problem ID
   - email: user email
3. Compiler Service:
   a. Fetches test cases from database
   b. Executes code against each test case
   c. Compares output with expected results
   d. Determines verdict (Accepted/WA/TLE/CE/RE)
4. If accepted, saves submission to database
5. Returns verdict to frontend
6. Frontend displays result and updates UI
```

### 5.4 Problem Creation Flow
```
1. Admin fills problem creation form
2. Frontend validates input fields
3. Sends POST request to /api/problem/create with:
   - title: problem title
   - description: problem description
   - level: difficulty level
   - testCases: array of input/output pairs
4. Backend validates and saves to MongoDB
5. Returns success response
6. Problem becomes available for users
```

## 6. Database Design

### 6.1 User Schema
```javascript
{
  _id: ObjectId,
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  institute: String,
  location: String,
  skills: [String],
  image: String,
  rank: Number,
  date: {
    type: Date,
    default: Date.now()
  }
}
```

### 6.2 Problem Schema
```javascript
{
  _id: ObjectId,
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  testCases: [{
    input: {
      type: String,
      required: true
    },
    output: {
      type: String,
      required: true
    }
  }],
  tags: [String],
  email: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
}
```

### 6.3 Submission Schema
```javascript
{
  _id: ObjectId,
  problemId: {
    type: String,
    required: true
  },
  problemName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  level: {
    type: String,
    default: "Medium"
  },
  language: String,
  date: {
    type: Date,
    default: Date.now()
  }
}
```

### 6.4 Database Relationships
```
User (1) ──── (N) Problem (via email)
User (1) ──── (N) Submission (via email)
Problem (1) ──── (N) Submission (via problemId)
```

## 7. Scaling Strategy

### 7.1 Horizontal Scaling
**Load Balancer Implementation**:
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │───►│   Backend       │───►│   Backend       │
│   (Nginx)       │    │   Instance 1    │    │   Instance 2    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Compiler      │    │   Compiler      │    │   Compiler      │
│   Service 1     │    │   Service 2     │    │   Service 3     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Database Scaling**:
- **MongoDB Sharding**: Distribute data across multiple shards
- **Read Replicas**: Separate read and write operations
- **Connection Pooling**: Efficient database connection management

### 7.2 Vertical Scaling
**Resource Optimization**:
- **CPU Scaling**: Increase CPU cores for computation-heavy tasks
- **Memory Scaling**: Add RAM for better caching and performance
- **Storage Scaling**: SSD storage for faster I/O operations

### 7.3 Microservices Scaling
**Service Decomposition**:
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │───►│   User Service  │───►│   Auth Service  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Problem       │    │   Submission    │    │   Compiler      │
│   Service       │    │   Service       │    │   Service       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 7.4 Caching Strategy
**Multi-level Caching**:
- **Redis**: Session storage and frequently accessed data
- **CDN**: Static assets and media files
- **Browser Cache**: Client-side caching for better performance



## 8. Deployment Strategy

### 8.1 Deployment Strategy
**Current Implementation**:
```javascript
// Frontend (Vite)
"scripts": {
  "dev": "vite --host",
  "build": "vite build",
  "preview": "vite preview"
}

// Backend (Express)
"scripts": {
  "start": "node index"
}
```

### 8.2 Current Deployment Setup
**Manual Deployment Process**:
```bash
# Frontend Deployment
cd client
npm run build
# Deploy built files to web server

# Backend Deployment
cd server
npm start
# Run on production server

# Compiler Service Deployment
cd compiler
node index.js
# Run on separate server
```

**No CI/CD Pipeline Currently Implemented**:
- Manual deployment process
- No automated testing pipeline
- No automated deployment to cloud platforms
- Development and production environments managed separately

### 8.3 Environment Configuration
**Current Environment Setup**:
```
Development:
  - Local development with hot reloading (Vite)
  - Local MongoDB instance
  - Local Node.js servers for backend and compiler

Production:
  - Manual deployment to servers
  - Production MongoDB database
  - Separate servers for frontend, backend, and compiler services
```

### 8.4 Monitoring and Logging
**Current Monitoring Setup**:
- **Basic Logging**: Console logging for debugging
- **Error Handling**: Try-catch blocks with error responses
- **No External Monitoring**: No third-party monitoring services implemented
- **Manual Health Checks**: Manual verification of service status

## 9. Future Enhancements

### 9.1 Feature Enhancements
**Competitive Programming Features**:
- **Contest System**: Timed programming competitions
- **Leaderboard**: User rankings and statistics
- **Rating System**: Elo-based rating algorithm
- **Problem Categories**: Algorithm, data structures, etc.
- **Discussion Forum**: Problem discussions and solutions

**Code Quality Features**:
- **Code Templates**: Pre-built code snippets
- **Code Analysis**: Performance and complexity analysis
- **Best Practices**: Automated code quality suggestions
- **Code Sharing**: Public/private code sharing

### 9.2 Technical Improvements
**Architecture Enhancements**:
- **GraphQL API**: More efficient data fetching
- **WebSocket Integration**: Real-time updates and notifications
- **Microservices**: Service decomposition for better scalability
- **Event-Driven Architecture**: Asynchronous event processing

**Performance Optimizations**:
- **Redis Caching**: Frequently accessed data caching
- **CDN Integration**: Global content delivery
- **Database Optimization**: Query optimization and indexing
- **Load Balancing**: Intelligent request distribution

### 9.3 Platform Extensions
**Mobile Application**:
- **React Native**: Cross-platform mobile app
- **Offline Support**: Offline problem solving
- **Push Notifications**: Contest and submission notifications

**Integration Features**:
- **GitHub Integration**: Code repository linking
- **IDE Plugins**: VS Code and IntelliJ extensions
- **API Access**: Public API for third-party integrations
- **Webhook Support**: Real-time event notifications

### 9.4 AI and ML Features
**Advanced AI Integration**:
- **Code Generation**: AI-assisted code writing
- **Problem Recommendation**: Personalized problem suggestions
- **Difficulty Prediction**: ML-based difficulty assessment
- **Plagiarism Detection**: AI-powered code similarity detection

**Analytics and Insights**:
- **Learning Analytics**: User progress tracking
- **Performance Analytics**: Code execution statistics
- **Trend Analysis**: Popular problems and solutions
- **Predictive Analytics**: Success rate predictions

---

**Document Version**: 1.0  
**Last Updated**: December 2024  
**Maintained By**: GenoCode Development Team  
**Next Review**: January 2025 