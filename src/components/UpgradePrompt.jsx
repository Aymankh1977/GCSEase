const CHECKOUT_URL = 'https://gcseasey.lemonsqueezy.com/checkout/buy/a4bddc75-a0f9-454e-a812-8f2ca2d5eac9';

export default function UpgradePrompt({ type = 'questions' }) {
  const what = type === 'tutor_msgs' ? 'AI tutor messages' : 'AI questions';
  return (
    <div className="card rise border-accent/30 p-6 text-center space-y-4">
      <div className="text-4xl">🚀</div>
      <div>
        <p className="font-display text-xl font-semibold">You've reached today's free limit</p>
        <p className="mt-1 text-sm text-slate2">
          Your 5 free {what} for today have been used. Your allowance resets at midnight —
          or upgrade to <strong>Pro</strong> for unlimited daily practice.
        </p>
      </div>

      <div className="rounded-2xl border border-accent/20 bg-accentSoft/30 p-4 text-left space-y-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-white tracking-wide">PRO</span>
          <p className="text-sm font-semibold">GCSEasy Pro — everything you need to succeed</p>
        </div>
        <ul className="space-y-1.5 text-xs text-slate2">
          <li>✓ <strong>30 AI exam questions</strong> per day — every subject &amp; topic</li>
          <li>✓ <strong>30 AI tutor messages</strong> per day — ask anything, get clear explanations</li>
          <li>✓ <strong>Instant examiner-style marking</strong> with detailed feedback</li>
          <li>✓ <strong>Full progress tracking</strong> — see exactly where to improve</li>
          <li>✓ <strong>All subjects</strong> including KS3 Maths, available 24/7</li>
          <li>✓ <strong>Cancel anytime</strong> — no hidden fees</li>
        </ul>
        <div className="pt-1 flex items-baseline gap-2 border-t border-line">
          <span className="font-display text-2xl font-bold">£3.99</span>
          <span className="text-xs text-slate2">/month</span>
          <span className="ml-auto text-sm font-semibold text-accent">or £29.99/year — save 37%</span>
        </div>
      </div>

      <a
        href={CHECKOUT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-accent block w-full py-3 text-center text-sm font-semibold"
      >
        Upgrade to Pro — start today →
      </a>
      <p className="text-xs text-slate2">
        Free plan: 5 AI questions + 5 tutor messages per day, resets at midnight.
        Secure payment via Lemon Squeezy. Cancel anytime.
      </p>
    </div>
  );
}
