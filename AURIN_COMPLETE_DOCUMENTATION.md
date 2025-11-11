# 🏆 AURIN - Complete Platform Documentation

## 📋 Table of Contents
1. [Platform Overview](#platform-overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [User Flows](#user-flows)
5. [Verification System](#verification-system)
6. [Blockchain Integration](#blockchain-integration)
7. [Security & Access Control](#security--access-control)
8. [API & Functions](#api--functions)

---

## 🎯 Platform Overview

**AURIN v1** — **Proof of Doing for Everyone.** One-tap check-in → verifiable badge → share anywhere.

**Tagline**: *Don't claim. **Prove.***

### Core Features (v1)
- ✅ **LiveProof™ Check-In**: QR + selfie + geo verification (no blockchain dependency)
- ✅ **ProofScore™**: 0-100 reputation score based on organizer rep, rarity, recency, streak
- ✅ **Badge Rarity System**: Common, Rare, Legendary badges
- ✅ **LinkedIn One-Tap Sharing**: Signed verification URLs for instant credibility
- ✅ **Invite Loops**: Viral growth with ProofScore bonuses
- ✅ **Event Management**: Organizers create events, attendees enroll and earn badges
- ✅ **Public Profiles**: Shareable profile links with ProofScore header
- ✅ **Organizer Reputation**: Trust scores for organizers
- ✅ **Design System**: Consistent tokens and 6 primitives
- ✅ **Three User Types**: Regular Users, Organizers, Admins
- ✅ **Soft Onboarding**: Optional profile setup (skip allowed)

### Technology Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Blockchain**: Ethereum (Base Mainnet) via ethers.js v5
- **Deployment**: Vercel/Netlify ready

---

## 🏗️ Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Landing  │  │ Dashboard│  │  Events  │  │  Admin   │   │
│  └────┬──────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │              │              │              │         │
│       └──────────────┴──────────────┴──────────────┘         │
│                        │                                      │
│              ┌─────────▼─────────┐                           │
│              │   AuthContext     │                           │
│              │   (Supabase Auth) │                           │
│              └─────────┬─────────┘                           │
└────────────────────────┼─────────────────────────────────────┘
                         │
┌─────────────────────────▼─────────────────────────────────────┐
│                    Supabase Backend                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  PostgreSQL  │  │   Auth API   │  │   Storage    │       │
│  │  (Database)  │  │              │  │  (Images)   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│         │                                                      │
│         └─────────────────────────────────────────────────────┘
└─────────────────────────┬─────────────────────────────────────┘
                         │
┌─────────────────────────▼─────────────────────────────────────┐
│              Blockchain (Base Mainnet)                         │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │         NFT Smart Contract (ERC-721/ERC-1155)            │ │
│  │         - Mint Badges                                    │ │
│  │         - Transfer Badges                                │ │
│  │         - Verify Ownership                              │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Component Structure

```
src/
├── components/          # Reusable UI components
│   ├── EnhancedNavbar.tsx
│   ├── DashboardLock.tsx
│   ├── BadgeEarningAnimation.tsx
│   └── ...
├── pages/              # Route pages
│   ├── Landing.tsx
│   ├── Dashboard.tsx
│   ├── Events.tsx
│   ├── OrganizerDashboard.tsx
│   └── Admin.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── lib/                # Utility functions
│   ├── supabase.ts
│   ├── blockchain.ts
│   ├── queries.ts
│   └── ...
└── hooks/              # Custom hooks
    └── useWallet.ts
```

---

## 📊 Database Schema

### Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   profiles  │────────▶│ achievements │◀───────│   badges    │
└─────────────┘         └──────────────┘         └─────────────┘
     │                        │
     │                        │
     ▼                        ▼
┌─────────────┐         ┌──────────────┐
│   events    │────────▶│event_enroll- │
└─────────────┘         │   ments      │
     │                  └──────────────┘
     │
     ▼
┌─────────────┐
│organizer_   │
│  profiles   │
└─────────────┘
```

### Tables

#### 1. `profiles`
User profiles with public-facing information.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Links to auth.users |
| `username` | text (UNIQUE) | Public URL identifier |
| `full_name` | text | Display name |
| `bio` | text | User biography |
| `avatar_url` | text | Profile picture URL |
| `location` | text | User location |
| `wallet_address` | text (UNIQUE) | Ethereum wallet address |
| `email_verified` | boolean | Email verification status |
| `wallet_connected` | boolean | Wallet connection status |
| `onboarding_completed` | boolean | Onboarding completion status |
| `is_verified` | boolean | Platform verification |
| `proofscore` | numeric (0-100) | ProofScore™ reputation (v1) |
| `profile_views` | integer | Total profile views |
| `created_at` | timestamptz | Account creation |
| `updated_at` | timestamptz | Last update |

**Constraints:**
- `username` must be 3-30 characters, alphanumeric + underscore/hyphen
- `wallet_address` is unique (if provided)

#### 2. `badges`
NFT badge definitions and metadata.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Badge ID |
| `name` | text | Badge name |
| `description` | text | Badge description |
| `image_url` | text | Badge visual |
| `category` | text | skill/achievement/certification/course/event |
| `rarity` | text | common/rare/legendary (v1) |
| `issuer_id` | uuid (FK) | Reference to issuers |
| `contract_address` | text | Smart contract address |
| `token_standard` | text | ERC-721 or ERC-1155 |
| `total_issued` | integer | Total badges issued |
| `is_active` | boolean | Whether badge can be issued |
| `created_at` | timestamptz | Creation timestamp |

#### 3. `achievements`
Individual badge ownership records (NFT ownership).

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Achievement ID |
| `user_id` | uuid (FK) | Badge owner |
| `badge_id` | uuid (FK) | Badge reference |
| `token_id` | text | Blockchain token ID |
| `transaction_hash` | text | Ethereum transaction hash |
| `mint_transaction_hash` | text | Mint transaction hash |
| `blockchain_verified` | boolean | Verification status |
| `nft_minted` | boolean | NFT minted status |
| `blockchain_network` | text | Network (base/mainnet) |
| `liveproof_id` | uuid (FK) | Reference to checkin (v1) |
| `earned_at` | timestamptz | When badge was earned |
| `metadata` | jsonb | Additional data |
| `is_featured` | boolean | Featured on profile |
| `is_public` | boolean | Public visibility |

#### 4. `events`
Event listings created by organizers.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Event ID |
| `organizer_id` | uuid (FK) | Event creator |
| `title` | text | Event name |
| `description` | text | Event description |
| `category` | text | technology/business/design/data/marketing/other |
| `location` | text | Event location |
| `event_type` | text | online/in-person/hybrid |
| `start_date` | timestamptz | Event start |
| `end_date` | timestamptz | Event end |
| `max_attendees` | integer | Max capacity |
| `current_attendees` | integer | Current enrollment count |
| `badge_id` | uuid (FK) | Badge to issue |
| `image_url` | text | Event cover image |
| `status` | text | draft/published/ongoing/completed/cancelled |
| `event_verified` | boolean | Admin verification status |
| `is_featured` | boolean | Featured event |
| `created_at` | timestamptz | Creation timestamp |
| `updated_at` | timestamptz | Last update |

#### 5. `event_enrollments`
Event participation records.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Enrollment ID |
| `event_id` | uuid (FK) | Event reference |
| `user_id` | uuid (FK) | Attendee |
| `enrolled_at` | timestamptz | Enrollment timestamp |
| `status` | text | enrolled/attended/completed/cancelled |
| `checked_in_at` | timestamptz | Check-in timestamp |
| `badge_issued` | boolean | Badge issued status |

**Constraints:**
- Unique `(event_id, user_id)` - one enrollment per user per event

#### 6. `organizer_profiles`
Organizer account information.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Organizer profile ID |
| `user_id` | uuid (FK, UNIQUE) | Organizer user |
| `organization_name` | text | Organization name |
| `organization_type` | text | company/university/nonprofit/community/individual |
| `verified_organizer` | boolean | Admin verification status |
| `total_events` | integer | Total events hosted |
| `total_attendees` | integer | Total attendees across events |
| `created_at` | timestamptz | Creation timestamp |

#### 7. `admin_users`
Admin account permissions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Admin record ID |
| `user_id` | uuid (FK, UNIQUE) | Admin user |
| `role` | text | super_admin/admin/moderator |
| `permissions` | jsonb | Detailed permissions |
| `created_at` | timestamptz | Creation timestamp |
| `created_by` | uuid (FK) | Who granted admin |

#### 8. `admin_activity_logs`
Admin action audit trail.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Log ID |
| `admin_id` | uuid (FK) | Admin who performed action |
| `action` | text | Action performed |
| `target_type` | text | user/event/badge/organizer/system |
| `target_id` | uuid | ID of affected entity |
| `details` | jsonb | Additional information |
| `created_at` | timestamptz | Action timestamp |

#### 9. `checkins` (v1)
LiveProof™ check-in records.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Check-in ID |
| `event_id` | uuid (FK) | Event reference |
| `user_id` | uuid (FK) | User who checked in |
| `photo_url` | text | Selfie photo URL |
| `lat` | numeric | Latitude |
| `lng` | numeric | Longitude |
| `device_fingerprint` | text | Device hash for duplicate detection |
| `verified` | boolean | Verification status |
| `created_at` | timestamptz | Check-in timestamp |

**Constraints:**
- Unique `(event_id, user_id)` - one check-in per user per event

#### 10. `organizer_reputation` (v1)
Organizer reputation scores.

| Column | Type | Description |
|--------|------|-------------|
| `organizer_id` | uuid (PK, FK) | Organizer profile reference |
| `score` | numeric (0-100) | Reputation score |
| `issued_on_time_rate` | numeric (0-1) | On-time badge issuance rate |
| `disputes` | integer | Number of disputes |
| `updated_at` | timestamptz | Last update |

#### 11. `invites` (v1)
User invite records.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Invite ID |
| `inviter_id` | uuid (FK) | User who sent invite |
| `invitee_email` | text | Invited email address |
| `accepted` | boolean | Acceptance status |
| `created_at` | timestamptz | Invite timestamp |

---

## 🔄 User Flows

### 1. User Signup Flow

```
Signup → Email Verification → Wallet Connection → Onboarding → Dashboard
```

**Step 1: Signup** (`/signup`)
- User enters email, password (OR magic link)
- Profile created in `profiles` table
- `email_verified: false` set (if email/password)
- `proofscore: 0` initialized

**Step 2: Soft Onboarding** (inline, optional)
- User can add avatar, full_name
- **Skip allowed** - not mandatory
- `onboarding_completed: true` set (even if skipped)

**Step 3: Enroll in Event** (`/explore`)
- User browses events
- One-tap enrollment
- `event_enrollments` record created

**Step 4: LiveProof Check-In** (at event)
- Scan QR code at event location
- Capture selfie photo
- Capture geo location (lat/lng)
- `checkins` record created with `verified: false`
- Organizer verifies → `verified: true`

**Step 5: Badge Reveal**
- Organizer issues badge
- Achievement created with `liveproof_id` reference
- Badge revealed with confetti animation
- ProofScore recalculated

**Step 6: Share** (`/my-proof`)
- Copy profile link
- One-tap LinkedIn share with signed verification URL

### 2. Event Creation Flow (Organizer)

```
Become Organizer → Create Event → Admin Verification → Event Published → Attendees Enroll
```

**Step 1: Become Organizer** (`/organizer`)
- User creates organizer profile
- Enters organization name and type
- `organizer_profiles` record created
- `verified_organizer: false` (default)

**Step 2: Create Event** (`/create-event`)
- Organizer fills event details
- Selects badge to issue (optional)
- Event created with `status: 'published'`, `event_verified: false`
- Admin notified for verification

**Step 3: Admin Verification**
- Admin reviews event in `/admin`
- Approves/rejects event
- If approved: `event_verified: true`
- Event visible to all users

**Step 4: Attendees Enroll**
- Users browse events on `/events`
- Click "Enroll" button
- `event_enrollments` record created
- Event `current_attendees` incremented

### 3. Badge Issuance Flow

```
Attendee Completes Event → Organizer Issues Badge → NFT Minted → Achievement Recorded
```

**Step 1: Event Completion**
- Attendee attends/completes event
- Organizer marks enrollment as `status: 'completed'`

**Step 2: Badge Issuance** (`/organizer`)
- Organizer views event enrollments
- Clicks "Issue Badge" for attendee
- System checks:
  - ✅ Organizer is verified (`verified_organizer: true`)
  - ✅ Event is verified (`event_verified: true`)
  - ✅ User is not the organizer (prevents self-issuance)
  - ✅ User has wallet address
  - ✅ Event has badge configured

**Step 3: NFT Minting**
- `mintBadgeNFT()` called with user's wallet address
- NFT minted on Base Mainnet
- Transaction hash and token ID returned

**Step 4: Achievement Record**
- `achievements` record created with:
  - `user_id`, `badge_id`
  - `token_id`, `transaction_hash`
  - `blockchain_verified: true`
  - `nft_minted: true`
- `event_enrollments.badge_issued: true` updated
- `badges.total_issued` incremented

### 4. Admin Verification Flow

```
Admin Reviews → Approves/Rejects → Status Updated → Notification Sent
```

**Admin Actions:**
- **Verify Organizer**: `verified_organizer: true`
- **Verify Event**: `event_verified: true`
- **Reject Event**: `status: 'cancelled'`
- **Ban User**: User access revoked
- **Create Badge**: New badge added to system

### 4. LiveProof™ Check-In Flow (v1)

```
QR Scan → Selfie Capture → Geo Capture → Organizer Verify → Badge Issued
```

**Step 1: QR Code Generation**
- Organizer generates QR code for event
- QR contains JWT: `{ event_id, nonce, exp }`
- QR displayed in organizer console

**Step 2: User Scans QR**
- User opens check-in modal
- Scans QR code at event location
- QR payload verified (expiration check)

**Step 3: Selfie Capture**
- User captures selfie photo
- Photo uploaded to Supabase Storage
- `photo_url` stored in `checkins`

**Step 4: Geo Capture**
- Browser requests geolocation
- Lat/lng captured (±200m accuracy)
- `lat`, `lng` stored in `checkins`

**Step 5: Device Fingerprint**
- Device hash generated (canvas + user agent + screen)
- `device_fingerprint` stored for duplicate detection

**Step 6: Organizer Verification**
- Organizer reviews check-ins in console
- Marks as "completed" → `verified: true`
- Badge can now be issued

### 5. ProofScore™ Calculation (v1)

**Formula:**
```
ProofScore = clamp(round(40*OrganizerRep + 30*Rarity + 20*Recency + 10*Streak), 0, 100)
```

**Components:**
- **OrganizerRep** (40%): `organizer_reputation.score / 100`
- **Rarity** (30%): common=0.2, rare=0.6, legendary=1.0
- **Recency** (20%): `exp(-daysSinceLastProof / 30)` scaled 0-1
- **Streak** (10%): `min(streakDays / 30, 1)`

**Calculation:**
- Recalculated nightly via cron job
- Cached in `profiles.proofscore`
- Updated after each badge issuance

### 6. LinkedIn One-Tap Sharing (v1)

**Process:**
1. User clicks "Share to LinkedIn" on badge
2. System generates signed verification URL
3. LinkedIn post text created with verification link
4. User copies text or opens LinkedIn share dialog
5. Verification URL resolves to badge view page

**Verification URL Format:**
```
https://aurin.com/verify/{token}
```

Token contains: `{ achievement_id, exp }` (1 year expiration)

### 7. Invite System (v1)

**Process:**
1. User sends invite via email
2. `invites` record created
3. Invitee signs up with email
4. System checks for invite → marks `accepted: true`
5. Inviter gets +10 ProofScore bonus (capped per month)

**Growth Loop:**
- Invite to unlock +10 ProofScore
- Monthly cap prevents abuse
- Leaderboards show top inviters

---

## ✅ Verification System

### Event Verification

**Purpose**: Prevent fake/spam events and ensure quality.

**Process:**
1. Organizer creates event → `event_verified: false` (default)
2. Event visible only to organizer (draft status)
3. Admin reviews event in `/admin` dashboard
4. Admin approves → `event_verified: true`
5. Event becomes visible to all users

**Rules:**
- Only verified events can have badges issued
- Unverified events are hidden from public
- Organizers can edit their unverified events

### Organizer Verification

**Purpose**: Ensure legitimate organizers before badge issuance.

**Process:**
1. User creates organizer profile → `verified_organizer: false` (default)
2. Admin reviews organizer profile
3. Admin verifies → `verified_organizer: true`
4. Organizer can now issue badges

**Rules:**
- Only verified organizers can issue badges
- Unverified organizers can create events but cannot issue badges
- Admin can revoke verification

### Self-Badge Issuance Prevention

**Security Rule**: Organizers cannot issue badges to themselves.

**Implementation:**
```typescript
// In issueBadgeToAttendee()
// Check if user is the organizer
const { data: event } = await supabase
  .from('events')
  .select('organizer_id')
  .eq('id', eventId)
  .single();

if (event.organizer_id === userId) {
  throw new Error('Organizers cannot issue badges to themselves');
}
```

**Why?**
- Prevents abuse
- Maintains badge credibility
- Ensures badges are earned, not self-awarded

---

## 🎨 Design System (v1)

### Tokens

**Radius:**
- `--radius-2xl`: 1rem
- `--radius-xl`: 0.75rem
- `--radius-lg`: 0.5rem

**Spacing:**
- `--space-4`: 1rem
- `--space-8`: 2rem
- `--space-12`: 3rem
- `--space-16`: 4rem

**Brand Colors:**
- `--brand-500`: Primary green (#22c55e)
- `--brand-600`: Hover state (#16a34a)

**Text Colors:**
- `--text-950`: Primary text (#0a0a0a)
- `--text-500`: Secondary text (#737373)

### Primitives

1. **Button**: `.btn`, `.btn-primary`, `.btn-secondary`
2. **Input**: `.input`
3. **Card**: `.card`
4. **Modal**: `.modal-overlay`, `.modal-content`
5. **Toast**: `.toast`
6. **Skeleton**: `.skeleton`

### Motion

- **Fade In**: 200ms ease-in-out
- **Slide Up**: 200ms ease-out
- **Confetti**: 0.5s on badge reveal
- **Transitions**: 200ms base duration

---

## ⛓️ Blockchain Integration

### Network Configuration
- **Network**: Base Mainnet
- **Chain ID**: 8453
- **Standards**: ERC-721 (default, ERC-1155 deferred for v1)
- **Contract**: Configurable via environment variables
- **v1 Change**: Blockchain minting is **optional** (toggle off by default)

### Minting Process

```typescript
// 1. Connect to wallet
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// 2. Get contract instance
const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  ABI,
  signer
);

// 3. Mint NFT
const tx = await contract.mint(toAddress, tokenURI);
const receipt = await tx.wait();

// 4. Get token ID from event logs
const tokenId = receipt.events[0].args.tokenId.toString();

// 5. Store in database
await supabase.from('achievements').insert({
  user_id: userId,
  badge_id: badgeId,
  token_id: tokenId,
  transaction_hash: tx.hash,
  blockchain_verified: true
});
```

### Verification

Badges can be verified on-chain:
1. Query contract for token owner
2. Verify transaction hash on blockchain explorer
3. Check token metadata (IPFS/Arweave)

---

## 🔐 Security & Access Control

### Row Level Security (RLS)

All tables have RLS enabled with policies:

**Profiles:**
- ✅ Public read access
- ✅ Users can update own profile
- ✅ Users can insert own profile

**Events:**
- ✅ Public read (published events only)
- ✅ Organizers can create/edit own events
- ✅ Admins can manage all events

**Achievements:**
- ✅ Public read (public achievements only)
- ✅ Users can view own achievements
- ✅ Organizers/admins can insert achievements

**Event Enrollments:**
- ✅ Users can view own enrollments
- ✅ Organizers can view event enrollments
- ✅ Users can enroll in events
- ✅ Organizers can update enrollment status

**Organizer Profiles:**
- ✅ Public read access
- ✅ Users can create/update own organizer profile

**Admin Users:**
- ✅ Only super_admins can view/manage

### Authentication Flow

1. **Supabase Auth**: Email/password authentication
2. **Session Management**: JWT tokens stored in cookies
3. **Protected Routes**: `ProtectedRoute` component checks:
   - User authenticated
   - Email verified
   - Wallet connected
   - Onboarding completed

### Input Validation

- **Zod Schemas**: All forms validated with Zod
- **Username**: 3-30 chars, alphanumeric + underscore/hyphen
- **Email**: Standard email format
- **Sanitization**: XSS prevention on all user inputs

---

## 🔧 API & Functions

### Key Functions

#### `awardBadge(userId, badgeId, toAddress, tokenURI)`
Awards a badge to a user (admin/organizer only).

**Parameters:**
- `userId`: User to award badge to
- `badgeId`: Badge to award
- `toAddress`: Wallet address (optional, for NFT minting)
- `tokenURI`: Token metadata URI

**Returns:** Achievement record

#### `issueBadgeToAttendee(enrollmentId, badgeId, userId)`
Issues badge to event attendee (organizer only).

**Checks:**
- ✅ Organizer is verified
- ✅ Event is verified
- ✅ User is not organizer (self-issuance prevention)
- ✅ User has wallet address
- ✅ Event has badge configured

**Returns:** Achievement record

#### `mintBadgeNFT(toAddress, name, description, imageUrl)`
Mints NFT badge on blockchain.

**Returns:**
```typescript
{
  success: boolean;
  tokenId?: string;
  transactionHash?: string;
  error?: string;
}
```

#### `getUserStatus(userId)`
Gets user verification status.

**Returns:**
```typescript
{
  emailVerified: boolean;
  walletConnected: boolean;
  onboardingComplete: boolean;
  isOrganizer: boolean;
  isAdmin: boolean;
}
```

#### `calculateProofScore(inputs)` (v1)
Calculates ProofScore from inputs.

**Parameters:**
- `organizerRep`: 0-100
- `rarity`: 'common' | 'rare' | 'legendary'
- `daysSinceLastProof`: number
- `streakDays`: number

**Returns:** 0-100 score

#### `generateCheckInQR(eventId)` (v1)
Generates QR code JWT for event check-in.

**Returns:** Base64-encoded JWT token

#### `createCheckIn(data)` (v1)
Creates LiveProof check-in record.

**Parameters:**
- `eventId`: Event ID
- `photoUrl`: Selfie photo URL
- `lat`: Latitude
- `lng`: Longitude
- `deviceFingerprint`: Device hash

**Returns:** Check-in ID

#### `generateLinkedInShare(data)` (v1)
Generates LinkedIn share text with verification URL.

**Returns:** LinkedIn post text

#### `sendInvite(data)` (v1)
Sends invite to email address.

**Parameters:**
- `inviteeEmail`: Email to invite

**Returns:** Invite ID

---

## 📝 Notes

### Important Constraints

1. **Username Uniqueness**: Enforced at database level
2. **Wallet Address Uniqueness**: One wallet per user
3. **Event Enrollment**: One enrollment per user per event
4. **Organizer Profile**: One organizer profile per user
5. **Admin Access**: Only via `admin_users` table

### Best Practices

1. **Always verify** before issuing badges
2. **Check wallet connection** before minting NFTs
3. **Log admin actions** for audit trail
4. **Validate inputs** on both client and server
5. **Use RLS policies** for security

---

---

## 📊 Metrics & Analytics (v1)

### North Star Metric (NSM)
- **Badges awarded per week**

### Input Metrics
- **TTFB**: Time-to-first-badge (target: <60s)
- **D1/D7 Retention**: Day 1 and Day 7 user retention
- **Invites/User**: Average invites sent per user
- **Organizer Activation**: Event → Issuance ≤7 days
- **Issuance Latency**: Time from check-in to badge issuance

### Dashboards

**Organizer Dashboard:**
- Attendees count
- Completion rate
- Issuance time
- LiveProof verification rate

**Admin Dashboard:**
- Reports and disputes
- Reputation deltas
- Abuse detection
- Platform health metrics

---

## 🚀 Growth Loops (v1)

1. **Invite to Unlock**: +10 ProofScore per accepted invite (monthly cap)
2. **Legendary Drops**: First 100 check-ins this week get legendary badges
3. **One-Tap LinkedIn**: Signed verification URLs for instant credibility
4. **Organizer Pro Trial**: Verified domains (edu/company) get free trial

---

## 💰 Pricing (v1)

- **Free (Earners)**: Unlimited badges, profile, share
- **Organizer Pro ($29–$99/mo)**: LiveProof console, reminders, LinkedIn one-tap, analytics, priority listing
- **Enterprise/University (contact)**: SSO, branding, cohorts, SLAs

---

**Last Updated**: 2025-11-10  
**Version**: 1.0.0 (Founder-Cut Spec)  
**Status**: Production Ready ✅

**v1 Changes Summary:**
- ✅ LiveProof™ check-in system
- ✅ ProofScore™ calculation
- ✅ Badge rarity system
- ✅ LinkedIn one-tap sharing
- ✅ Invite loops
- ✅ Organizer reputation
- ✅ Design system tokens
- ✅ Soft onboarding (skip allowed)
- ✅ Blockchain optional (toggle off by default)

