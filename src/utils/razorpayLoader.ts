let razorpayScriptPromise: Promise<any> | null = null;

export function loadRazorpaySdk(): Promise<any> {
  if (typeof window === 'undefined') {
    return Promise.resolve(null);
  }

  if ((window as any).Razorpay) {
    return Promise.resolve((window as any).Razorpay);
  }

  if (razorpayScriptPromise) {
    return razorpayScriptPromise;
  }

  razorpayScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[src*="checkout.razorpay.com"]');
    if (existingScript) {
      if ((window as any).Razorpay) {
        resolve((window as any).Razorpay);
      } else {
        existingScript.addEventListener('load', () => resolve((window as any).Razorpay));
        existingScript.addEventListener('error', () => {
          razorpayScriptPromise = null;
          reject(new Error('Failed to load Razorpay SDK'));
        });
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => {
      if ((window as any).Razorpay) {
        resolve((window as any).Razorpay);
      } else {
        razorpayScriptPromise = null;
        reject(new Error('Razorpay SDK loaded but window.Razorpay is not defined'));
      }
    };

    script.onerror = () => {
      razorpayScriptPromise = null;
      reject(new Error('Failed to load Razorpay SDK. Check connection or CSP settings.'));
    };

    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
}

