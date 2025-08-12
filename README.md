# HireFlow - AI-Powered Job Application Assistant

HireFlow is a comprehensive web application that helps job seekers (especially students/early-career professionals) create tailored resumes and cover letters using AI. The system analyzes job requirements and tailors applications to match, while tracking success rates for continuous improvement.

## 🚀 Features

### Core Functionality
- **AI-Powered Resume Tailoring**: Automatically customize resumes for specific job postings
- **Smart Cover Letter Generation**: Create personalized cover letters using AI
- **Job Description Analysis**: Extract key requirements and skills using NLP
- **Application Tracking**: Monitor application status and success metrics
- **Skill Gap Analysis**: Identify areas for improvement and development

### AI & Learning
- **Semantic Matching**: Use embeddings to match resumes with job requirements
- **Continuous Learning**: Improve suggestions based on user feedback and success rates
- **Q-Factor Optimization**: Quality, Query design, and Quantification for AI agents

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Chakra UI** for modern, accessible components
- **React Router** for navigation
- **Axios** for API communication

### Backend
- **FastAPI** (Python) for high-performance API
- **SQLAlchemy** with PostgreSQL for data persistence
- **JWT Authentication** with secure password hashing
- **Alembic** for database migrations

### AI & ML
- **OpenAI GPT-4** for content generation
- **Pinecone** for vector database and semantic search
- **LangChain** for AI workflow orchestration
- **Custom NLP** for skill extraction and analysis

### Infrastructure
- **PostgreSQL** for relational data
- **File Storage** for resume uploads
- **CORS** enabled for frontend integration

## 📁 Project Structure

```
HireFlow/
├── frontend/                 # React TypeScript application
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/                  # FastAPI Python backend
│   ├── app/
│   │   ├── api/             # API routes
│   │   ├── core/            # Configuration & database
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   └── services/        # Business logic
│   ├── requirements.txt
│   └── main.py
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- OpenAI API key
- Pinecone API key

### Backend Setup

1. **Create Virtual Environment**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   DATABASE_URL=postgresql://user:password@localhost/hireflow
   SECRET_KEY=your-secret-key-here
   OPENAI_API_KEY=your-openai-api-key
   PINECONE_API_KEY=your-pinecone-api-key
   PINECONE_ENVIRONMENT=your-pinecone-environment
   ```

4. **Database Setup**
   ```bash
   # Create database
   createdb hireflow
   
   # Run migrations (when implemented)
   alembic upgrade head
   ```

5. **Start Backend Server**
   ```bash
   python -m app.main
   # Or with uvicorn
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user info

### Users
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile

### Resumes
- `POST /api/v1/resumes/upload` - Upload resume
- `GET /api/v1/resumes/` - List user resumes
- `GET /api/v1/resumes/{id}` - Get specific resume
- `PUT /api/v1/resumes/{id}` - Update resume
- `DELETE /api/v1/resumes/{id}` - Delete resume

### Jobs
- `POST /api/v1/jobs/` - Create job posting
- `GET /api/v1/jobs/` - List user jobs
- `GET /api/v1/jobs/{id}` - Get specific job
- `PUT /api/v1/jobs/{id}` - Update job
- `DELETE /api/v1/jobs/{id}` - Delete job

### Applications
- `POST /api/v1/applications/` - Create application
- `GET /api/v1/applications/` - List user applications
- `GET /api/v1/applications/{id}` - Get application details
- `PUT /api/v1/applications/{id}` - Update application
- `POST /api/v1/applications/{id}/feedback` - Submit feedback

## 🤖 AI Features

### Resume Analysis
- **Content Extraction**: Parse PDF/DOCX files
- **Skill Identification**: Extract and categorize skills
- **Experience Summarization**: Generate professional summaries
- **Content Structuring**: Organize information into sections

### Job Matching
- **Requirement Analysis**: Extract key requirements from job descriptions
- **Skill Matching**: Calculate match scores between resumes and jobs
- **Industry Classification**: Identify job sectors and specializations
- **Experience Level Detection**: Determine required experience levels

### Content Generation
- **Tailored Resumes**: Customize content for specific job requirements
- **Cover Letters**: Generate personalized application letters
- **Optimization Suggestions**: Provide improvement recommendations
- **Interview Preparation**: Offer tips based on job requirements

## 📊 Learning & Improvement

### Q-Factor Implementation
- **Quality**: AI-generated content quality metrics
- **Query Design**: Optimized prompts for better AI responses
- **Quantification**: Success rate tracking and analytics

### User Feedback Loop
- **Satisfaction Ratings**: User feedback on AI suggestions
- **Success Metrics**: Application response and interview rates
- **Continuous Learning**: Improve AI models based on outcomes

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt encryption for user passwords
- **CORS Protection**: Controlled cross-origin resource sharing
- **Input Validation**: Pydantic schema validation
- **File Upload Security**: Type and size validation

## 🚧 Development Roadmap

### Phase 1 (Current)
- [x] User authentication system
- [x] Resume upload and management
- [x] Job posting creation and analysis
- [x] Basic AI-powered content generation
- [x] Application tracking system

### Phase 2 (Next)
- [ ] OpenAI GPT-4 integration
- [ ] Pinecone vector database setup
- [ ] Advanced AI content enhancement
- [ ] Real-time job scraping
- [ ] Enhanced analytics dashboard

### Phase 3 (Future)
- [ ] Machine learning model training
- [ ] Predictive success analytics
- [ ] Advanced interview preparation
- [ ] Multi-language support
- [ ] Mobile application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API access
- Pinecone for vector database services
- FastAPI community for the excellent framework
- React and Chakra UI teams for the frontend tools

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the API documentation at `/docs` when running the backend

---

**Built with ❤️ for job seekers everywhere** 