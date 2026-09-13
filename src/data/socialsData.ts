import { SocialChannel } from '../types';

export const OFFICIAL_SOCIAL_CHANNELS: SocialChannel[] = [
  {
    id: 'reddit',
    name: 'Reddit Community',
    handle: 'r/DeckDivider',
    url: 'https://www.reddit.com/r/DeckDivider/',
    category: 'Community',
    description: 'Official community subreddit for Pokémon TCG master sets, deck strategies, collection showcases, and feature discussions.',
    memberCount: 'Official Subreddit',
    status: 'Official',
    accentColor: '#FF4500',
    iconName: 'Reddit'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@deckdivider',
    url: 'https://www.instagram.com/deckdivider/',
    category: 'Photos',
    description: 'High-res card photography, PSA/BGS graded slab showcases, expansion pack openings, and illustration highlights.',
    memberCount: 'Visual Showcase',
    status: 'Official',
    accentColor: '#E1306C',
    iconName: 'Instagram'
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    handle: '@DeckDivider',
    url: 'https://x.com/DeckDivider',
    category: 'Updates',
    description: 'Official announcements, live market price alerts, set release updates, and PTCGL tournament meta discussions.',
    memberCount: 'Updates & Alerts',
    status: 'Official',
    accentColor: '#0F172A',
    iconName: 'Twitter'
  }
];

export const SOCIAL_FAQS = [
  {
    question: 'How do I join the official DECK / divider community on Reddit?',
    answer: 'Visit r/DeckDivider (https://www.reddit.com/r/DeckDivider/) to share collection binders, trade decks, and discuss upcoming Pokémon TCG expansions with fellow trainers.'
  },
  {
    question: 'Where can I see high-resolution slab and card photography?',
    answer: 'Follow @deckdivider on Instagram (https://www.instagram.com/deckdivider/) for daily high-res PSA 10 gem mint slab showcases, special illustration rare highlights, and collection reels.'
  },
  {
    question: 'Where can I get real-time price trend alerts and platform updates?',
    answer: 'Follow @DeckDivider on X / Twitter (https://x.com/DeckDivider) for real-time market updates, expansion catalog additions, and maintenance announcements.'
  },
  {
    question: 'How do I leave a community review or feature suggestion?',
    answer: 'You can submit directly using the "Drop a Review" button on this page. You can choose to display your trainer name or share your feedback anonymously.'
  }
];

