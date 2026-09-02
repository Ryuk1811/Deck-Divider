import Razorpay from 'razorpay';
import crypto from 'crypto';

export function getRazorpayClient() {
  const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_live_TX714Wy6Wko6ZX';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || 'jHvqKM1bZhq3IE2hvcaOg2J1';

  if (!key_id || !key_secret) {
    throw new Error('Razorpay credentials not configured');
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
}

export async function createRazorpayOrder(amountPaise: number, currency: string = 'INR', receipt: string) {
  const rzp = getRazorpayClient();
  const options = {
    amount: amountPaise,
    currency,
    receipt,
    payment_capture: 1, // Auto capture
  };

  const order = await rzp.orders.create(options);
  return order;
}

export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET || 'jHvqKM1bZhq3IE2hvcaOg2J1';
  if (!secret) return false;

  const body = orderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body.toString())
    .digest('hex');

  return expectedSignature === signature;
}

export function verifyRazorpayWebhookSignature(body: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
    
  return expectedSignature === signature;
}
