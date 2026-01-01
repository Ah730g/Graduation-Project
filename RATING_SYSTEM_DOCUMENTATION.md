# Two-Sided Rating System - Complete Documentation

## Overview
The Two-Sided Rating System allows renters and owners to rate each other only after a stay ends successfully. Ratings remain hidden until both parties submit their ratings or a 14-day time window expires. Once revealed, ratings are immutable and contribute to each user's public reputation.

---

## Frontend Process Flow

### 1. **After Stay Completion - Rating Eligibility**

When a contract status becomes `expired` (stay completed), users can rate each other.

#### Location: Contract Signing Page (`/contracts/:id`)
- **Trigger**: Contract status is `expired`
- **Who Can Rate**: Both owner and renter involved in the contract
- **Display**:
  - Section titled "Rate Your Experience"
  - Shows the other party's information (name, avatar)
  - Shows whether user has already rated
  - Displays user's own rating if submitted (with hidden/revealed status)
  - Displays other party's rating if revealed

#### Key Features:
- **"Rate Now" Button**: Opens rating modal if user hasn't rated yet
- **Rating Status Indicators**:
  - ✅ "Rated" badge if user has submitted rating
  - 🔒 "Hidden" indicator if rating is not yet revealed
  - ✅ Shows revealed ratings from both parties

---

### 2. **Rating Submission Process**

#### Component: `RatingModal` (`/components/RatingModal.jsx`)

**Steps:**
1. User clicks "Rate Now" on contract page
2. Modal opens with:
   - Other party's name and avatar
   - Star rating selector (1-5 stars)
   - Comment textarea (required, max 1000 characters)
   - Info message: "Your rating will be hidden until both parties submit or after 14 days"

3. User fills:
   - Selects rating (1-5 stars)
   - Writes comment

4. On submit:
   - Validates: comment is required
   - Sends POST request to `/api/reviews`
   - Backend validates:
     - Contract is expired (stay completed)
     - User is part of the contract (owner or renter)
     - User hasn't rated this contract before
     - User isn't rating themselves

5. Success response:
   - Rating saved with `status: 'hidden'`
   - Modal closes
   - Contract page refreshes to show new rating
   - Success toast: "Rating submitted successfully. It will be revealed when both parties submit or after 14 days."

---

### 3. **Rating Visibility Rules**

#### Hidden Ratings:
- User can see their own hidden ratings
- Other party cannot see hidden ratings
- Rating status shows: "Hidden - will be revealed when both parties rate or after 14 days"

#### Revealed Ratings:
- **Automatic Reveal Triggers:**
  1. Both parties submit ratings → Revealed immediately
  2. 14 days pass after stay end date → Revealed automatically (via scheduled job)

- Once revealed:
  - Visible to both parties and public
  - Cannot be edited or deleted (immutable)
  - Contributes to user's reputation score

---

### 4. **Ratings Page** (`/ratings`)

#### Purpose:
List all completed stays that are eligible for rating

#### Features:
- **Eligible Contracts List:**
  - Shows contracts with status `expired`
  - Displays:
    - Apartment title and address
    - Start and end dates
    - Other party's name and avatar
    - Whether user has rated or not

- **Actions Available:**
  - "Rate Now" button (if not rated)
  - "View Contract" link (to see contract details and existing ratings)
  - "View Reviews" button (if rating is revealed)

- **Status Indicators:**
  - Green "Rated" badge if already rated
  - User's rating preview (if submitted)
  - Hidden/Revealed status indicator

#### Access:
- Link in navbar (visible to logged-in users)
- Direct URL: `/ratings`

---

### 5. **User Reputation Display**

#### Locations:

##### A. User Profile Page (`/user/profile`)
- **Section**: Reputation Card
- **Displays:**
  - ⭐ Average Rating (e.g., "4.5")
  - Total Reviews Count (e.g., "12 reviews")
  - "No reviews yet" message if user has no reviews

##### B. Apartment Listing Page (`/:id`)
- **Location**: Owner information card
- **Displays:**
  - ⭐ Average rating (if user has reviews)
  - Total reviews count
  - Only shows if user has received at least one review

##### C. User Resource (API Response)
- Automatically included in user data
- Available throughout the app
- Structure:
  ```json
  {
    "reputation": {
      "average_rating": 4.5,
      "total_reviews": 12
    }
  }
  ```

---

### 6. **Contract Reviews Section**

On contract page (`/contracts/:id`), when contract is expired:

#### Displays:
1. **User's Own Rating**:
   - Rating (stars)
   - Comment
   - Status (Hidden/Revealed)
   - Edit/Delete options (only if hidden)

2. **Other Party's Rating** (if revealed):
   - Rating (stars)
   - Comment
   - Other party's name

3. **Rating Actions**:
   - Rate button (if not rated)
   - Edit button (if user's rating is hidden)
   - Delete button (if user's rating is hidden)
   - View revealed reviews

---

## API Endpoints Used

### Frontend → Backend Communication:

1. **GET `/api/reviews/eligible-contracts`**
   - Fetches contracts user can rate
   - Used in: Ratings page

2. **POST `/api/reviews`**
   - Creates a new rating
   - Used in: RatingModal component
   - Body: `{ contract_id, rating, comment }`

3. **GET `/api/reviews/contract/:contractId`**
   - Gets all reviews for a contract
   - Used in: ContractSigning page
   - Returns: User's own reviews (even hidden) + All revealed reviews

4. **GET `/api/reviews/user/:userId`**
   - Gets all revealed reviews for a user
   - Used for: Displaying user's public reviews

5. **GET `/api/users/:userId/reputation`**
   - Gets user's reputation (average rating, total count)
   - Used in: Profile page, User displays

6. **PUT `/api/reviews/:id`**
   - Updates a rating (only if hidden)
   - Used for: Editing ratings before they're revealed

7. **DELETE `/api/reviews/:id`**
   - Deletes a rating (only if hidden)
   - Used for: Removing ratings before they're revealed

---

## Business Rules Enforcement

### Frontend Validation:
1. ✅ Comment is required (cannot submit empty comment)
2. ✅ Rating must be between 1-5 stars
3. ✅ Cannot rate if contract is not expired
4. ✅ Cannot edit/delete revealed ratings (buttons hidden)
5. ✅ Shows appropriate error messages from backend

### Backend Validation:
1. ✅ Stay must be completed (contract expired)
2. ✅ User must be owner or renter
3. ✅ One rating per user per contract
4. ✅ Cannot rate yourself
5. ✅ Immutability after reveal (no edit/delete)
6. ✅ 14-day expiration window enforced

---

## User Experience Flow

### Scenario 1: Both Parties Rate
1. Stay ends → Contract becomes `expired`
2. Owner sees "Rate Your Experience" section
3. Owner submits rating → Rating saved as `hidden`
4. Renter sees "Rate Your Experience" section
5. Renter submits rating → Both ratings revealed **immediately**
6. Both parties can now see each other's ratings

### Scenario 2: Only One Party Rates
1. Stay ends → Contract becomes `expired`
2. Owner submits rating → Rating saved as `hidden`
3. Renter doesn't submit rating
4. After 14 days → Owner's rating automatically revealed
5. Renter can still submit rating later (but owner's rating is already visible)

### Scenario 3: Viewing Reputation
1. User completes multiple stays
2. Receives ratings from different parties
3. Reputation updates automatically:
   - Average rating recalculated
   - Total reviews count updated
4. Reputation visible on:
   - Profile page
   - Apartment listings (if user is owner)
   - Public user displays

---

## UI/UX Features

### Visual Indicators:
- ⭐ Star icons for ratings
- 🔒 "Hidden" status badges
- ✅ "Rated" badges
- Color-coded status messages:
  - Blue: Info messages
  - Green: Success/Completed
  - Yellow: Actions needed

### Responsive Design:
- Works on desktop and mobile
- Modal is mobile-friendly
- Cards adapt to screen size

### Internationalization:
- Supports English and Arabic
- All text is translatable
- RTL support for Arabic

---

## Security & Privacy

1. **Authorization Checks**:
   - Only authenticated users can rate
   - Users can only rate contracts they're part of
   - Users can only see their own hidden ratings

2. **Data Privacy**:
   - Hidden ratings are private
   - Only revealed ratings are public
   - Users cannot see who rated them until reveal

3. **Abuse Prevention**:
   - One rating per stay
   - Cannot rate yourself
   - Cannot edit/delete after reveal
   - Backend validates all requests

---

## Technical Implementation

### Components:
- `RatingModal.jsx` - Rating submission form
- `Ratings.jsx` - List of eligible contracts
- `ContractSigning.jsx` - Shows rating section for expired contracts
- `Profile.jsx` - Displays user reputation
- `EstateInfo.jsx` - Shows owner reputation on listings

### State Management:
- React hooks (`useState`, `useEffect`)
- API calls via Axios
- Real-time updates after actions

### Error Handling:
- User-friendly error messages
- Validation feedback
- Network error handling
- Loading states

---

## Testing Checklist

### Frontend Testing:
- [ ] Submit rating successfully
- [ ] View own hidden rating
- [ ] Cannot see other party's hidden rating
- [ ] Both ratings revealed after both submit
- [ ] Cannot edit revealed rating
- [ ] Reputation displays correctly
- [ ] Ratings page shows eligible contracts
- [ ] Error messages display properly
- [ ] Mobile responsive
- [ ] Translations work (EN/AR)

### Backend Testing:
- [ ] Can only rate expired contracts
- [ ] Cannot rate twice
- [ ] Cannot rate yourself
- [ ] Ratings reveal correctly (both submitted OR 14 days)
- [ ] Immutability enforced
- [ ] Reputation calculated correctly

---

## Future Enhancements (Optional)

1. Email notifications when rating is revealed
2. Rating reminders for users who haven't rated
3. Rating breakdown (5 stars, 4 stars, etc.)
4. Recent reviews feed
5. Rating analytics dashboard
6. Photo attachments in ratings
7. Helpful/Not helpful voting on reviews

---

## Summary

The Two-Sided Rating System provides a fair, transparent, and abuse-resistant way for renters and owners to rate each other. By hiding ratings until both parties submit or after a grace period, it encourages honest feedback while preventing retaliation. The system automatically calculates and displays reputation scores, helping users make informed decisions about potential rental partners.

