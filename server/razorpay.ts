import Razorpay from 'razorpay';
import crypto from 'crypto';
import { getAppCredentials } from './configManager.js';

export async function getRazorpayClient() {
  const creds = await getAppCredentials();
  const key_id = creds.razorpay?.keyId || process.env.RAZORPAY_KEY_ID;
  const key_secret = creds.razorpay?.keySecret || process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error('Razorpay credentials not configured');
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
}

export async function createRazorpayOrder(amountPaise: number, currency: string = 'INR', receipt: string) {
  const rzp = await getRazorpayClient();
  const options = {
    amount: amountPaise,
    currency,
    receipt,
    payment_capture: 1, // Auto capture
  };

  const order = await rzp.orders.create(options);
  return order;
}

export async function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string): Promise<boolean> {
  const creds = await getAppCredentials();
  const secret = creds.razorpay?.keySecret || process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const body = orderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body.toString())
    .digest('hex');

  return expectedSignature === signature;
}

export async function verifyRazorpayWebhookSignature(body: string, signature: string): Promise<boolean> {
  const creds = await getAppCredentials();
  const secret = creds.razorpay?.webhookSecret || process.env.RAZORPAY_WEBHOOK_SECRET || creds.razorpay?.keySecret || process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
    
  return expectedSignature === signature;
}

