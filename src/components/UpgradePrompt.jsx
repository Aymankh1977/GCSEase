// Shown when a free user hits their daily question or tutor limit.
// Replace CHECKOUT_URL with your Lemon Squeezy checkout link.
const CHECKOUT_URL = 'https://gcsease.lemonsqueezy.com/buy/pro'; // ← replace this

export default function UpgradePrompt({ type = 'questions' }) {
  const what = type === 'tutor_msgs' ? 'tutor messages' : 'AI questions';
  return (
    <div className="card rise border-accent/30 p-6 text-center space-y-4">
      <div className="text-4xl">🎯</div>
      <div>
        <p className="font-display text-xl font-semibold">Daily limit reached</p>
        <p className="mt-1 text-sm text-slate2">
          You've used your 3 free {what} for today. Come back tomorrow, or upgrade
          to <strong>Pro</strong> for 30/day.
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-surface/60 p-4 text-left space-y-2">
        <p className="text-sm font-semibold">GCSEase Pro</p>
        <ul className="space-y-1 text-xs text-slate2">
          <li>✓ 30 AI questions per day</li>
          <li>✓ 30 AI tutor messages per day</li>
          <li>✓ Higher-quality AI (Claude Sonnet)</li>
          <li>✓ All subjects &amp; KS3 Maths</li>
          <li>✓ Progress saved to your account</li>
        </ul>
        <div className="pt-2 flex items-baseline gap-2">
          <span className="font-display text-2xl font-bold">£3.99</span>
          <span className="text-xs text-slate2">/month</span>
          <span className="ml-auto text-xs text-slate2">or £24.99/year</span>
        </div>
      </div>

      <a
        href={CHECKOUT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-accent block w-full py-3 text-center text-sm font-semibold"
      >
        Upgrade to Pro →
      </a>
      <p className="text-xs text-slate2">Resets daily at midnight. Free tier resets automatically.</p>
    </div>
  );
}
