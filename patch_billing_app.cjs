const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const changeTierLogic = `
  const handleChangeTier = async (newTier: AccountTier) => {
    if (!user) return alert("Must be logged in to upgrade");
    triggerSyncPulse();
    if (newTier === 'Starter') {
       alert("To cancel, please visit PayPal directly.");
       return;
    }
    const token = await auth.currentUser?.getIdToken();
    const returnUrl = window.location.origin + '/?paypal_success=true&tier=' + newTier;
    const cancelUrl = window.location.origin + '/?paypal_cancel=true';

    try {
      if (subscription?.paypalSubscriptionId) {
        // Revise
        const res = await fetch('/api/billing/revise', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\` },
          body: JSON.stringify({ subscriptionId: subscription.paypalSubscriptionId, newTier, returnUrl, cancelUrl })
        });
        const data = await res.json();
        if (data.status === 'NO_APPROVAL_NEEDED') {
          // It's a downgrade or simple switch
          await fetch('/api/billing/execute-revision', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\` },
            body: JSON.stringify({ subscriptionId: subscription.paypalSubscriptionId, newTier, isDowngrade: true })
          });
          alert('Subscription updated. Downgrades take effect on your next billing cycle.');
          window.location.reload();
        } else if (data.links) {
          const approveLink = data.links.find((l: any) => l.rel === 'approve');
          if (approveLink) window.location.href = approveLink.href;
        } else {
          alert('Failed to revise subscription.');
        }
      } else {
        // New sub
        const res = await fetch('/api/billing/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\` },
          body: JSON.stringify({ tier: newTier, returnUrl, cancelUrl })
        });
        const data = await res.json();
        if (data.links) {
          const approveLink = data.links.find((l: any) => l.rel === 'approve');
          if (approveLink) window.location.href = approveLink.href;
        } else {
          alert('Failed to create subscription.');
        }
      }
    } catch (err) {
      alert('Error updating subscription: ' + (err as Error).message);
    }
  };

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paypalSuccess = urlParams.get('paypal_success');
    const subscriptionId = urlParams.get('subscription_id');
    const tier = urlParams.get('tier');
    
    if (paypalSuccess && subscriptionId && tier && user) {
       auth.currentUser?.getIdToken().then(token => {
         fetch('/api/billing/execute', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\` },
           body: JSON.stringify({ subscriptionId, tier })
         }).then(() => {
           window.location.href = '/';
         });
       });
    }
  }, [user]);
`;

if (!code.includes('paypal_success')) {
  // insert after isSyncing state
  code = code.replace("const [isSyncing, setIsSyncing] = useState(false);", "const [isSyncing, setIsSyncing] = useState(false);\n" + changeTierLogic);
  // replace the prop being passed
  code = code.replace(/onChangeTier=\{\(t\) => \{\s*setCurrentTier\(t\);\s*triggerSyncPulse\(\);\s*\}\}/, 'onChangeTier={handleChangeTier}');
  fs.writeFileSync(file, code);
}

