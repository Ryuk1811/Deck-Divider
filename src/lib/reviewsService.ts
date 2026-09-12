import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { CommunityReview } from '../types';

// Zero mock/seed reviews — reviews will populate exclusively from live Firestore or real user submissions
const INITIAL_COMMUNITY_REVIEWS: CommunityReview[] = [];

const LOCAL_STORAGE_REVIEWS_KEY = 'deckdivider_user_reviews';
const LOCAL_STORAGE_LIKES_KEY = 'deckdivider_liked_reviews';

/**
 * Get stored local reviews submitted on this browser
 */
function getLocalSubmittedReviews(): CommunityReview[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Could not read local reviews from localStorage:', e);
    return [];
  }
}

/**
 * Save newly submitted review locally
 */
function saveLocalReview(review: CommunityReview): void {
  try {
    const existing = getLocalSubmittedReviews();
    localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify([review, ...existing]));
  } catch (e) {
    console.warn('Could not save local review to localStorage:', e);
  }
}

/**
 * Fetch all community reviews (combines Firestore live items + seeds + local offline items)
 */
export async function getCommunityReviews(): Promise<CommunityReview[]> {
  const localItems = getLocalSubmittedReviews();
  
  if (!db) {
    // Return seeds + local items if Firestore not connected
    const merged = [...localItems, ...INITIAL_COMMUNITY_REVIEWS];
    const seen = new Set<string>();
    return merged.filter(item => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }

  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, orderBy('createdAt', 'desc'), limit(100));
    const snapshot = await getDocs(q);

    const firestoreReviews: CommunityReview[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      firestoreReviews.push({
        id: doc.id,
        authorName: data.isAnonymous ? 'Anonymous Trainer' : (data.authorName || 'Anonymous Trainer'),
        isAnonymous: Boolean(data.isAnonymous),
        userId: data.userId,
        rating: typeof data.rating === 'number' ? data.rating : 5,
        title: data.title || '',
        comment: data.comment || '',
        category: data.category || 'General & UI',
        userRole: data.userRole || 'Community Trainer',
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
        likesCount: data.likesCount || 0,
        isVerified: Boolean(data.isVerified)
      });
    });

    const allCombined = [...localItems, ...firestoreReviews, ...INITIAL_COMMUNITY_REVIEWS];
    const seen = new Set<string>();
    const unique = allCombined.filter(item => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });

    return unique.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.warn('Firestore query failed, falling back to local and seeds:', err);
    const fallback = [...localItems, ...INITIAL_COMMUNITY_REVIEWS];
    return fallback;
  }
}

/**
 * Subscribe to real-time review updates
 */
export function subscribeToReviews(onUpdate: (reviews: CommunityReview[]) => void): () => void {
  if (!db) {
    getCommunityReviews().then(onUpdate);
    return () => {};
  }

  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, orderBy('createdAt', 'desc'), limit(50));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveReviews: CommunityReview[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        liveReviews.push({
          id: doc.id,
          authorName: data.isAnonymous ? 'Anonymous Trainer' : (data.authorName || 'Anonymous Trainer'),
          isAnonymous: Boolean(data.isAnonymous),
          userId: data.userId,
          rating: typeof data.rating === 'number' ? data.rating : 5,
          title: data.title || '',
          comment: data.comment || '',
          category: data.category || 'General & UI',
          userRole: data.userRole || 'Community Trainer',
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
          likesCount: data.likesCount || 0,
          isVerified: Boolean(data.isVerified)
        });
      });

      const localItems = getLocalSubmittedReviews();
      const allCombined = [...localItems, ...liveReviews, ...INITIAL_COMMUNITY_REVIEWS];
      const seen = new Set<string>();
      const unique = allCombined.filter(item => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });

      onUpdate(unique.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }, (error) => {
      console.warn('Reviews real-time snapshot error:', error);
      getCommunityReviews().then(onUpdate);
    });

    return unsubscribe;
  } catch (err) {
    console.warn('Could not setup real-time listener, falling back to static fetch:', err);
    getCommunityReviews().then(onUpdate);
    return () => {};
  }
}

/**
 * Submit a new community review
 */
export async function submitReview(data: {
  authorName: string;
  isAnonymous: boolean;
  userId?: string;
  rating: number;
  title: string;
  comment: string;
  category: string;
  userRole?: string;
}): Promise<CommunityReview> {
  const newReview: CommunityReview = {
    id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    authorName: data.isAnonymous ? 'Anonymous Trainer' : (data.authorName.trim() || 'Trainer'),
    isAnonymous: data.isAnonymous,
    userId: data.userId,
    rating: Math.min(5, Math.max(1, data.rating)),
    title: data.title.trim() || 'Community Feedback',
    comment: data.comment.trim(),
    category: data.category || 'General & UI',
    userRole: data.userRole || (data.isAnonymous ? 'Anonymous Member' : 'Verified Trainer'),
    createdAt: new Date().toISOString(),
    likesCount: 0,
    isVerified: !data.isAnonymous
  };

  // Always save locally for instant optimistic UI
  saveLocalReview(newReview);

  // Attempt Firestore write
  if (db) {
    try {
      const docRef = await addDoc(collection(db, 'reviews'), {
        authorName: newReview.authorName,
        isAnonymous: newReview.isAnonymous,
        userId: newReview.userId || null,
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
        category: newReview.category,
        userRole: newReview.userRole,
        createdAt: newReview.createdAt,
        likesCount: 0,
        isVerified: newReview.isVerified
      });
      newReview.id = docRef.id;
    } catch (e) {
      console.warn('Firestore write failed, stored in local browser state:', e);
    }
  }

  return newReview;
}

/**
 * Check if a user has liked a specific review
 */
export function isReviewLiked(reviewId: string): boolean {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LIKES_KEY);
    const liked = raw ? JSON.parse(raw) : [];
    return liked.includes(reviewId);
  } catch {
    return false;
  }
}

/**
 * Toggle like on a review locally
 */
export function toggleLikeReview(reviewId: string): boolean {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LIKES_KEY);
    let liked: string[] = raw ? JSON.parse(raw) : [];
    const isAlreadyLiked = liked.includes(reviewId);
    
    if (isAlreadyLiked) {
      liked = liked.filter(id => id !== reviewId);
    } else {
      liked.push(reviewId);
    }
    
    localStorage.setItem(LOCAL_STORAGE_LIKES_KEY, JSON.stringify(liked));
    return !isAlreadyLiked;
  } catch {
    return false;
  }
}

/**
 * Calculate aggregate review metrics
 */
export function calculateReviewStats(reviews: CommunityReview[]) {
  if (!reviews || reviews.length === 0) {
    return {
      average: 0.0,
      total: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;

  reviews.forEach(r => {
    const score = Math.round(r.rating) as 1 | 2 | 3 | 4 | 5;
    if (distribution[score] !== undefined) {
      distribution[score]++;
    }
    sum += r.rating;
  });

  const total = reviews.length;
  const average = Number((sum / total).toFixed(1));

  const percentages = {
    5: Math.round((distribution[5] / total) * 100),
    4: Math.round((distribution[4] / total) * 100),
    3: Math.round((distribution[3] / total) * 100),
    2: Math.round((distribution[2] / total) * 100),
    1: Math.round((distribution[1] / total) * 100),
  };

  return { average, total, distribution, percentages };
}
