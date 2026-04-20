/**
 * Trigger a browser download for a payment proof image.
 * Works with both blob/data URLs (uploaded locally) and remote URLs.
 * Falls back to opening in a new tab if the download attribute is blocked.
 */
export async function downloadPaymentProof(url: string, filename: string = 'payment-proof.jpg') {
  try {
    let href = url;
    let revoke = false;

    if (!url.startsWith('blob:') && !url.startsWith('data:')) {
      const res = await fetch(url, { mode: 'cors' });
      if (!res.ok) throw new Error(`Failed to fetch proof (${res.status})`);
      const blob = await res.blob();
      href = URL.createObjectURL(blob);
      revoke = true;
    }

    const a = document.createElement('a');
    a.href = href;
    a.download = filename || 'payment-proof.jpg';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();

    if (revoke) setTimeout(() => URL.revokeObjectURL(href), 1000);
  } catch (err) {
    window.open(url, '_blank', 'noopener');
  }
}
