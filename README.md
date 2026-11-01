# AGRI-SETU (कृषि-सेतु)
## AI-Powered Smart Agriculture Support Platform • HACKFEST 3.0

> **"Connecting Farmers to Right Support – Smart Farming. Right Support. Better Future."**

AGRI-SETU is an integrated full-stack agricultural technology platform built for Indian farmers. It bridges the critical information and assistance gap by combining **Google Gemini Multimodal AI**, **live APMC Mandi price feeds**, **hyperlocal agro-weather advisories**, **direct government scheme eligibility (DBT)**, and verified **Krishi Vigyan Kendra (KVK) scientists**.

---

## 1. Key Features

1. **AI Crop Disease Doctor**:
   - Camera & gallery photo upload.
   - Multimodal Gemini 3.8 Flash leaf pathogen vision detection.
   - Outputs: detected issue, confidence score (%), symptoms, cultural precautions, CIBRC approved chemical fungicides, and biological/organic remedies (Neem oil, Trichoderma).
   - Instant sample testing leaves (Wheat Yellow Rust, Tomato Early Blight, Soybean Spotting, Mustard).
2. **Government Schemes & DBT**:
   - Directory of central & state schemes (PM-KISAN, PMFBY, KCC, PMKSY Per Drop More Crop, e-NAM, Soil Health Card, PKVY).
   - Document requirements checklist and official portal links.
   - Bookmark schemes to farmer profile.
3. **Interactive Scheme Eligibility Checker**:
   - Landholding slider, state selector, and document verification.
   - Calculates real-time percentage match score and eligibility explanations.
4. **Mandi Price Intelligence**:
   - Live APMC rates across Wheat, Soybean, Mustard, Cotton, Onion, and Paddy.
   - 7-day price trajectory charts rendered with Recharts.
   - Inter-mandi price arbitrage (highlights highest-paying regional APMCs).
5. **Hyperlocal Agro-Weather & Spray Advisories**:
   - Temperature, humidity, 24h rainfall, wind speed, and 5-day forecast.
   - Agricultural warnings on mist, humidity, and spray suitability.
6. **Agri-Setu Mitra (AI Assistant)**:
   - Multilingual voice dictation (Web Speech API) and text chat in Hindi & English.
   - Text-to-speech audio readout for rural accessibility.
   - Context-aware responses referencing farmer's district and sown crops.
7. **Krishi Vigyan Kendra (KVK) & Expert Connect**:
   - Empaneled ICAR & KVK agricultural scientists directory.
   - Submit crop inquiries with photos; scientists can review and reply.
8. **Farmer Dashboard**:
   - Aggregated overview with active crops, local weather, top mandi prices, and recent AI health records.
9. **Admin Operations Portal**:
   - Analytics charts (farmer registrations, crop distribution, disease prevalence).
   - Farmer directory and scheme CRUD management.
10. **Bilingual Support & 1-Click Demo Accounts**:
    - Hindi (हिंदी) and English language toggle.
    - 1-Click Instant Demo login buttons for Farmer, Admin, and KVK Scientist.

---

## 2. Technology Stack

### Frontend:
- **Framework**: React 19 with TypeScript, Vite
- **Styling**: Tailwind CSS v4 (Agriculture Green `#15803d`, Sky Blue, Clean White)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Motion
- **Accessibility**: Web Speech API for voice dictation & speech synthesis

### Backend:
- **Runtime**: Node.js & Express with TypeScript
- **Architecture**: Modular Controller-Service-Route structure
- **Authentication**: JWT tokens, bcrypt password hashing, role-based access control (FARMER, ADMIN, EXPERT)
- **Validation**: Zod schema validation
- **Dev & Prod Server**: `server.ts` mounting Express REST APIs (`/api/*`) and Vite middleware on port 3000

### Database:
- **PostgreSQL & Prisma ORM**: Schema (`prisma/schema.prisma`) and seed file (`prisma/seed.ts`) covering all 13 relational tables:
  `Users`, `FarmerProfiles`, `Crops`, `CropAnalyses`, `GovernmentSchemes`, `SavedSchemes`, `WeatherRecords`, `MandiPrices`, `ExpertProfiles`, `ExpertRequests`, `ChatMessages`, `Notifications`, `Feedback`.
- **In-Memory Store**: Auto-seeded relational data store in `backend/src/config/database.ts` allowing immediate zero-setup execution.

### AI Integration:
- **SDK**: `@google/genai` TypeScript SDK
- **Model**: `gemini-3.8-flash` for multimodal leaf vision diagnostics and conversational farmer advice

---

## 3. Demo Accounts (HACKFEST 3.0 Instant Access)

Use the 1-click **"Quick Demo Mode"** button in the top navigation bar, or enter these credentials:

| Role | Identifier (Mobile / Email) | Password | Description |
| :--- | :--- | :--- | :--- |
| **Demo Farmer** | `9876543210` | `farmer123` | Rameshwar Patil (Nashik, 4.5 Acres, Wheat & Soybean) |
| **Demo Admin** | `admin@agrisetu.in` | `admin123` | Dr. Anand Verma (Agronomy Director) |
| **Demo KVK Expert** | `expert.sharma@agrisetu.in` | `expert123` | Dr. Sunita Sharma (ICAR Crop Protection Scientist) |

---

## 4. Installation & Local Development

### Prerequisites:
- Node.js 20+
- npm or yarn

### Steps:

1. **Clone repository & install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key (or let AI Studio inject it automatically):
   ```env
   GEMINI_API_KEY="your-gemini-api-key"
   PORT=3000
   JWT_SECRET="agri_setu_secret_key"
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agrisetu"
   ```

3. **Database Setup with Prisma (PostgreSQL)**:
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Push schema to PostgreSQL database
   npx prisma db push

   # Seed database with initial agro-data & demo accounts
   npx tsx prisma/seed.ts
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` in your browser. Both the Express backend APIs and React frontend run concurrently on port 3000.

5. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 5. REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create farmer account and profile
- `POST /api/auth/login` - Authenticate and retrieve JWT token
- `POST /api/auth/logout` - Invalidate session
- `GET /api/auth/me` - Get logged-in user profile

### Farmer Operations (`/api/farmers`)
- `GET /api/farmers/profile` - Fetch profile details
- `PUT /api/farmers/profile` - Update land size, soil type, district
- `GET /api/farmers/dashboard` - Aggregated dashboard metrics

### AI Crop Diagnostics (`/api/crops`)
- `POST /api/crops/analyze` - Multimodal vision analysis via Gemini
- `GET /api/crops/history` - Historical diagnostic records
- `GET /api/crops/guidance` - Scientific crop calendar
- `POST /api/crops` - Add sown crop to farm
- `GET /api/crops` - List farmer's crops
- `DELETE /api/crops/:id` - Remove crop record

### Government Schemes (`/api/schemes`)
- `GET /api/schemes` - Search & filter schemes
- `GET /api/schemes/:id` - Scheme details
- `POST /api/schemes/check-eligibility` - Rule-based eligibility scoring
- `POST /api/schemes/save` - Bookmark scheme
- `GET /api/schemes/saved` - View saved schemes

### Mandi Prices (`/api/mandi`)
- `GET /api/mandi/prices` - Spot APMC rates
- `GET /api/mandi/compare` - Compare rates across mandis
- `GET /api/mandi/history` - 7-day price trajectory

### Weather (`/api/weather`)
- `GET /api/weather/current` - Live meteorological data & field advisory
- `GET /api/weather/forecast` - 5-day forecast
- `GET /api/weather/alerts` - Active weather warnings

### KVK Experts (`/api/experts`)
- `GET /api/experts` - Directory of ICAR/KVK scientists
- `POST /api/experts/request` - Submit advisory inquiry
- `GET /api/experts/requests` - View inquiries and answers
- `PUT /api/experts/requests/:id/reply` - Scientist resolution (Requires EXPERT role)

### Chatbot (`/api/chatbot`)
- `POST /api/chatbot/message` - Contextual AI query (Hindi/English)
- `GET /api/chatbot/history` - Conversation log

### Admin Operations (`/api/admin`)
- `GET /api/admin/dashboard` - Platform statistics
- `GET /api/admin/farmers` - Registered farmers directory
- `POST /api/admin/schemes` - Add new scheme
- `DELETE /api/admin/schemes/:id` - Remove scheme
- `GET /api/admin/analytics` - Charts dataset

---

## 6. License
Built under Apache-2.0 License for HACKFEST 3.0. In dedicated service of India's Annadata (किसान).
