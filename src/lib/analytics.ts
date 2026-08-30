/**
 * Privacy-Respecting Funnel Analytics Utility for DECK / divider
 * 
 * Guarantees zero PII collection:
 * - No IP addresses stored
 * - No email addresses or user identities logged
 * - Uses an ephemeral session token in sessionStorage (resets per session)
 * - Tracks conversion funnel: Landing -> CTA -> Auth -> Signup -> Dashboard -> First Meaningful Action
 */

export type FunnelStep =
  | '1_landing_view'
  | '2_cta_click'
  | '3_auth_view'
  | '4_signup_submit'
  | '5_signup_success'
  | '6_dashboard_view'
  | '7_first_action';

export interface AnalyticsEvent {
  sid: string;
  step: FunnelStep;
  timestamp: number;
  metadata?: Record<string, any>;
}

import { safeGetItem, safeSetItem, safeGetSessionItem, safeSetSessionItem } from '../utils/safeStorage';

// Session Token Management (ephemeral, stored in sessionStorage)
function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  try {
    let sid = safeGetSessionItem('dd_analytics_sid');
    if (!sid) {
      sid = 'sid_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
      safeSetSessionItem('dd_analytics_sid', sid);
    }
    return sid;
  } catch (e) {
    return 'sid_anonymous';
  }
}

/**
 * Core event dispatcher
 */
export async function sendAnalyticsEvent(step: FunnelStep, metadata?: Record<string, any>): Promise<void> {
  if (typeof window === 'undefined') return;

  const sid = getSessionId();
  const event: AnalyticsEvent = {
    sid,
    step,
    timestamp: Date.now(),
    metadata,
  };

  // Fail-silent async transmission
  try {
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
      keepalive: true,
    }).catch(() => {
      // Intentionally ignore network/telemetry connection drops
    });
  } catch (e) {
    // Fail silent
  }
}

// Step-specific helpers for clean instrumentation
export function trackLandingView(): void {
  sendAnalyticsEvent('1_landing_view');
}

export function trackCtaClick(ctaName?: string): void {
  sendAnalyticsEvent('2_cta_click', { ctaName: ctaName || 'get_started' });
}

export function trackAuthView(): void {
  sendAnalyticsEvent('3_auth_view');
}

export function trackSignupSubmit(method: 'email' | 'google' = 'email'): void {
  sendAnalyticsEvent('4_signup_submit', { method });
}

export function trackSignupSuccess(method: 'email' | 'google' = 'email'): void {
  sendAnalyticsEvent('5_signup_success', { method });
}

export function trackLoginSuccess(method: 'email' | 'google' = 'email'): void {
  sendAnalyticsEvent('5_signup_success', { method, isLogin: true });
}

export function trackDashboardView(): void {
  sendAnalyticsEvent('6_dashboard_view');
}

/**
 * Tracks first meaningful action in authenticated dashboard.
 * Uses localStorage to fire strictly ONCE per account/device installation.
 */
export function trackFirstMeaningfulAction(actionType: 'first_card_added' | 'first_sealed_added' | 'first_deck_created' | 'first_list_created', details?: Record<string, any>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const alreadyLogged = safeGetItem('dd_first_action_logged');
    if (alreadyLogged) return; // Fire strictly once
    
    safeSetItem('dd_first_action_logged', 'true');
    sendAnalyticsEvent('7_first_action', {
      actionType,
      ...details,
    });
  } catch (e) {
    // Fallback
    sendAnalyticsEvent('7_first_action', { actionType, ...details });
  }
}
