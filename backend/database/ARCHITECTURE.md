# ImpactTrace System Architecture

## 📊 Database Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         IMPACTTRACE SYSTEM                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    ADMIN     │         │ BENEFICIARY  │         │    DONOR     │
│  (NGO Staff) │         │ (Aid Seeker) │         │ (Supporter)  │
└──────┬───────┘         └──────┬───────┘         └──────┬───────┘
       │                        │                        │
       │ 1. Creates             │                        │
       ├────────────┐           │                        │
       │            ▼           │                        │
       │      ┌──────────┐     │                        │
       │      │ PROJECT  │     │                        │
       │      └────┬─────┘     │                        │
       │           │           │                        │
       │           │           │ 2. Applies             │
       │           │           ├───────────────┐        │
       │           │           │               ▼        │
       │           │           │       ┌───────────────┐│
       │           │           │       │ APPLICATION   ││
       │           │           │       │ (PENDING)     ││
       │           │           │       └───────┬───────┘│
       │           │           │               │        │
       │ 3. Reviews & Approves │               │        │
       ├───────────────────────────────────────┘        │
       │           │           │                        │
       │           │           │       ┌───────────────┐│
       │           │           │       │ APPLICATION   ││
       │           │           │       │ (APPROVED)✅  ││
       │           │           │       └───────┬───────┘│
       │           │           │               │        │
       │           │           │               │        │ 4. Donates to
       │           │           │               │        │ APPROVED App
       │           │           │               │        ├──────────┐
       │           │           │               │        │          ▼
       │           │           │               │        │   ┌─────────────┐
       │           │           │               │        │   │  DONATION   │
       │           │           │               │        │   │ (to App)    │
       │           │           │               │        │   └──────┬──────┘
       │           │           │               │        │          │
       │           │           │ 5. Receives   │◄───────┴──────────┘
       │           │           │ Notification  │
       │           │           │               │
       │           │           │ 6. Gives      │
       │           │           ├───────────────┐
       │           │           │               ▼
       │           │           │       ┌───────────────┐
       │           │           │       │   FEEDBACK    │
       │           │           │       └───────────────┘
       │           │           │
       │ 7. Views Reports      │                        │ 8. Tracks Impact
       ├───────────┘           │                        ├──────────┐
       ▼                       │                        │          ▼
┌──────────────┐              │                 ┌──────────────────┐
│   REPORTS    │              │                 │  IMPACT TRACKING │
│  & INSIGHTS  │              │                 │   & ANALYTICS    │
└──────────────┘              │                 └──────────────────┘
                              │
                              │ 9. Views Status
                              ├──────────────────┐
                              │                  ▼
                              │          ┌──────────────┐
                              │          │ APPLICATION  │
                              │          │   STATUS     │
                              │          └──────────────┘
```

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE TABLES                           │
└─────────────────────────────────────────────────────────────────┘

users (Admin, Donor, Beneficiary)
   │
   ├─── (Admin creates) ──────────────────┐
   │                                       ▼
   │                                  ┌─────────┐
   │                                  │projects │
   │                                  └────┬────┘
   │                                       │
   ├─── (Beneficiary applies) ─────────────┤
   │                                       ▼
   │                            ┌────────────────────┐
   │                            │ aid_applications   │
   │                            │ (PENDING)          │
   │                            └─────────┬──────────┘
   │                                      │
   ├─── (Admin reviews) ──────────────────┤
   │                                      │
   │                            ┌────────────────────┐
   │                            │ aid_applications   │
   │                            │ (APPROVED) ✅      │
   │                            └─────────┬──────────┘
   │                                      │
   ├─── (Donor donates) ──────────────────┤
   │                                      ▼
   │                            ┌─────────────────────┐
   │                            │ donations           │
   │                            │ (application_id FK) │
   │                            └─────────────────────┘
   │
   ├─── (Beneficiary feedback) ────────────┐
   │                                        ▼
   │                              ┌──────────────┐
   │                              │  feedback    │
   │                              └──────────────┘
   │
   ├─── (Admin updates) ──────────────────┐
   │                                       ▼
   │                            ┌───────────────────┐
   │                            │ project_updates   │
   │                            └───────────────────┘
   │
   └─── (Admin reports) ──────────────────┐
                                           ▼
                                  ┌─────────────┐
                                  │   reports   │
                                  └─────────────┘
```

## 🎯 Critical Business Logic

### ❌ WRONG: Direct Project Donation
```
Donor → Project (WRONG!)
```

### ✅ CORRECT: Application-Based Donation
```
Donor → Approved Application → Project
```

## 📋 Status Transitions

### Application Status Flow:
```
pending → under_review → approved ✅
                      └→ rejected ❌
```

### Donation Status Flow:
```
pending → completed ✅
       └→ cancelled ❌
```

### Project Status Flow:
```
active → completed → archived
```

## 🔗 Foreign Key Relationships

```sql
projects
    ← project_id ── aid_applications
                        ← application_id ── donations
                                                ↑
                                            donor_id
                                                ↑
                                              users
```

## 📱 Frontend Component Mapping

### Admin Panel (Component 1)
- Create projects → `projects` table
- Review applications → `aid_applications` table
- View donations → `donations` table
- Generate reports → `reports` table
- AI insights → Chart.js + aggregated data

### Donor App (Component 3)
- Browse projects → `projects` table
- View approved applications → `aid_applications` WHERE status='approved'
- Make donations → `donations` table (MUST link to application_id)
- Track impact → JOIN donations + applications + feedback

### Beneficiary Portal (Component 4)
- Apply for aid → `aid_applications` table
- Track status → `aid_applications` table
- View donations received → JOIN donations + applications
- Submit feedback → `feedback` table

### Donation Tracking System (Component 2)
- Log donations → `donations` table
- Photo uploads → photo_url field
- Search/filter → Query donations table
- History → donations with timestamps

## 🚀 Setup Commands

```bash
# First time setup
npm install
npm run db:setup    # Create tables
npm run db:seed     # Add sample data (optional)
npm start           # Start server

# Reset database (if needed)
npm run db:reset    # Delete database
npm run db:setup    # Recreate tables
npm run db:seed     # Re-add sample data
```

## 📊 Sample Queries

### Get approved applications for a project:
```javascript
GET /api/projects/:projectId/applications?status=approved
```

### Make a donation to an approved application:
```javascript
POST /api/donations
{
  "application_id": 123,  // REQUIRED
  "donor_id": 456,
  "amount": 500,
  "item_name": "School Supplies"
}
```

### Track donor's impact:
```javascript
GET /api/donors/:donorId/impact
// Returns: donations + applications + projects + feedback
```

### Beneficiary's application status:
```javascript
GET /api/beneficiaries/:beneficiaryId/applications
// Returns: all applications with status and donations
```
