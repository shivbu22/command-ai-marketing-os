import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function createOrder(amount: number, currency: string = 'INR', receipt: string) {
  try {
    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency,
      receipt,
    };
    const order = await razorpay.orders.create(options);
    return { success: true, order };
  } catch (error) {
    console.error('[Razorpay Error] Failed to create order:', error);
    return { success: false, error };
  }
}

export async function verifyPayment(_paymentId: string, _orderId: string, _signature: string) {
  // Logic to verify payment signature
  // In a real app, you'd use crypto.createHmac
  return { success: true }; // Placeholder
}
