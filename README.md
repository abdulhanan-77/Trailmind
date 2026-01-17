# AI E-commerce Agent

A sophisticated multi-agent AI ecosystem for e-commerce, featuring a **Next.js 16** frontend and a **FastAPI** backend orchestrating **LangGraph** agents. This platform delivers an autonomous shopping experience with conversational AI assistance, personalized recommendations, and secure payment processing.

![Next.js](https://img.shields.io/badge/Next.js-16.1.3-black?logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-green?logo=fastapi)
![LangChain](https://img.shields.io/badge/LangChain-0.1+-blue)
![Stripe](https://img.shields.io/badge/Stripe-Payments-purple?logo=stripe)
![Three.js](https://img.shields.io/badge/Three.js-3D-orange?logo=three.js)

---

## AI Features

### Multi-Agent Architecture

Our platform uses a **LangGraph-powered multi-agent system** where specialized AI agents collaborate to provide the best shopping experience:

| Agent | Description |
|-------|-------------|
| **Supervisor** | Intelligent router that analyzes user intent and delegates to the appropriate specialist agent |
| **Shopping Concierge** | Product discovery expert with RAG capabilities - handles "show me...", "I need...", product searches and recommendations |
| **Deep Researcher** | Comparative analysis specialist - handles "is X better than Y?", product comparisons, and market research |
| **Support Agent** | Post-purchase specialist - handles order status, returns, shipping inquiries |
| **Transactional Agent** | Secure purchase handler with Human-in-the-Loop (HITL) confirmation for payment authorization |
| **Retention Agent** | Proactive engagement - triggers personalized offers and discounts for hesitant shoppers |

### AI Capabilities

- **Semantic Product Search**: AI understands natural language queries like "waterproof hiking boots under $150"
- **Smart Recommendations**: Context-aware suggestions based on browsing history and conversation
- **Product Comparisons**: Deep analysis of product features, pricing, and value propositions
- **Secure Transactions**: Agent Payments Protocol (AP2) with mandatory human confirmation
- **Intent Recognition**: Automatic routing to specialized agents based on user needs
- **Conversational Context**: Maintains conversation history for coherent multi-turn interactions

### 3D Product Showcase

- **Interactive 3D Viewer**: Three.js-powered product visualization with `@react-three/fiber`
- **Orbital Controls**: Rotate, zoom, and pan products with intuitive mouse/touch controls
- **Studio Lighting**: Professional lighting setup for realistic product presentation
- **Responsive Design**: Optimized for desktop and mobile experiences

---

## Coming Soon - AI Features Roadmap

| Feature | Description | Status |
|---------|-------------|--------|
| **Voice Shopping** | Natural voice commands for hands-free shopping | Planned |
| **Visual Search** | Upload an image to find similar products | Planned |
| **Personalized Bundles** | AI-curated product bundles based on user preferences | Planned |
| **Multi-language Support** | AI conversations in 20+ languages | Planned |
| **Predictive Analytics** | "You might run out of X" proactive notifications | Planned |
| **AR Try-On** | Augmented reality product preview | Planned |
| **Dynamic Pricing** | AI-optimized pricing based on demand and inventory | Planned |
| **Tavily Integration** | Real-time web search for competitor pricing | Planned |

---

## Tech Stack

### Backend
- **FastAPI** - High-performance async API framework
- **LangChain** - LLM orchestration and tool integration
- **LangGraph** - Multi-agent workflow management
- **FAISS** - Vector similarity search for product embeddings
- **Pydantic** - Data validation and settings management
- **Stripe** - Payment processing integration
- **OpenRouter** - LLM API gateway (supports multiple models)

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for react-three-fiber
- **Lucide React** - Modern icon library

---

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+
- **OpenRouter API Key** - Get from [openrouter.ai](https://openrouter.ai/)
- **Stripe API Keys** (optional) - Get from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-ecommerce.git
cd ai-ecommerce
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
.\venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys (REQUIRED: OPENROUTER_API_KEY, JWT_SECRET)

# Start the backend server
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and configure:

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Yes | Your OpenRouter API key |
| `OPENROUTER_MODEL` | No | LLM model (default: `meta-llama/llama-3.1-70b-instruct`) |
| `JWT_SECRET` | Yes | Secret key for JWT token signing |
| `PROJECT_NAME` | No | Application name (default: `AI_Ecommerce_Agent`) |
| `API_V1_STR` | No | API prefix (default: `/api/v1`) |
| `CORS_ORIGINS` | No | Allowed origins (default: `["http://localhost:3000"]`) |
| `STRIPE_SECRET_KEY` | No | Stripe secret key (for checkout) |
| `STRIPE_PUBLISHABLE_KEY` | No | Stripe publishable key (for checkout) |

> **Security Warning**: Never commit your `.env` file. It's already in `.gitignore`.

---

## Project Structure

```
ai_ecommerce/
├── backend/
│   ├── app/
│   │   ├── agents/           # AI Agent implementations
│   │   │   ├── supervisor.py    # Intent routing agent
│   │   │   ├── concierge.py     # Product discovery agent
│   │   │   ├── researcher.py    # Comparison agent
│   │   │   ├── support.py       # Customer support agent
│   │   │   ├── transactional.py # Payment handling agent
│   │   │   ├── retention.py     # Customer retention agent
│   │   │   └── tools.py         # Agent tools (search, product details)
│   │   ├── api/              # API routes
│   │   ├── core/             # Core configuration & LLM setup
│   │   ├── data/             # Product data & embeddings
│   │   └── services/         # Business logic services
│   ├── .env.example          # Environment template
│   └── requirements.txt      # Python dependencies
│
├── frontend/
│   ├── app/                  # Next.js App Router pages
│   ├── components/           # React components
│   │   ├── ChatInterface.tsx    # AI chat overlay
│   │   ├── OnboardingTour.tsx   # Interactive onboarding
│   │   ├── product/             # Product display components
│   │   │   ├── ProductViewer.tsx   # 3D product viewer
│   │   │   ├── ProductCard.tsx     # Product cards
│   │   │   └── ProductDetailModal.tsx
│   │   └── header/           # Navigation components
│   ├── context/              # React contexts (Cart, etc.)
│   ├── types/                # TypeScript definitions
│   └── package.json          # Node dependencies
│
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

---

## API Endpoints

### Chat & AI
- `POST /api/v1/chat` - Send message to AI agent system
- `POST /api/v1/chat/resume` - Resume interrupted transaction

### Products
- `GET /api/v1/products` - List all products
- `GET /api/v1/products/{id}` - Get product details
- `GET /api/v1/products/search?q={query}` - Search products

### Checkout (Stripe)
- `POST /api/v1/checkout/create-session` - Create Stripe checkout session
- `GET /api/v1/checkout/config` - Get Stripe publishable key

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
