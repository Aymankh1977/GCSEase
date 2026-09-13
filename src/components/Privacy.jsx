export default function Privacy({ onBack }) {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <button onClick={onBack} className="btn-ghost text-sm">← Back</button>

      <div className="card p-6 space-y-5">
        <div>
          <h1 className="font-display text-2xl font-bold">Privacy Policy</h1>
          <p className="mt-1 text-sm text-slate2">Last updated: September 2026 · GCSEasy (gcseasy.org)</p>
        </div>

        <section className="space-y-2">
          <h2 className="font-semibold">1. Who we are</h2>
          <p className="text-sm text-slate2 leading-relaxed">
            GCSEasy is operated by DentEdTech. We provide an AI-powered GCSE revision platform at
            gcseasy.org. You can contact us at <a href="mailto:support@gcseasy.org" className="text-accent underline">support@gcseasy.org</a>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">2. What data we collect</h2>
          <ul className="text-sm text-slate2 leading-relaxed space-y-1 list-disc list-inside">
            <li><strong>Account data:</strong> your name and email address when you sign up</li>
            <li><strong>Usage data:</strong> which subjects and topics you practise, your scores, and daily usage counts</li>
            <li><strong>Payment data:</strong> handled entirely by Lemon Squeezy — we never see your card details</li>
            <li><strong>AI interactions:</strong> questions and answers you submit are sent to Anthropic's API to generate responses and are not stored permanently by us</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">3. How we use your data</h2>
          <ul className="text-sm text-slate2 leading-relaxed space-y-1 list-disc list-inside">
            <li>To provide and improve the GCSEasy service</li>
            <li>To track your revision progress and personalise questions to your level</li>
            <li>To enforce daily usage limits and manage your subscription</li>
            <li>To send account-related emails (confirmation, password reset)</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">4. Third-party services</h2>
          <ul className="text-sm text-slate2 leading-relaxed space-y-1 list-disc list-inside">
            <li><strong>Supabase</strong> — stores your account and progress data (servers in the EU)</li>
            <li><strong>Anthropic</strong> — processes your questions to generate AI responses</li>
            <li><strong>Netlify</strong> — hosts the application</li>
            <li><strong>Lemon Squeezy</strong> — processes Pro subscription payments</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">5. Your rights (UK GDPR)</h2>
          <p className="text-sm text-slate2 leading-relaxed">
            You have the right to access, correct, or delete your personal data at any time.
            To exercise these rights or to close your account, email us at{' '}
            <a href="mailto:support@gcseasy.org" className="text-accent underline">support@gcseasy.org</a>.
            We will respond within 30 days.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">6. Cookies</h2>
          <p className="text-sm text-slate2 leading-relaxed">
            We use only essential cookies and browser local storage to keep you logged in and
            remember your preferences (theme, collapsed panels). We do not use advertising or
            tracking cookies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">7. Children</h2>
          <p className="text-sm text-slate2 leading-relaxed">
            GCSEasy is designed for students aged 11–16. If you are under 13, please ensure a
            parent or guardian has consented to your use of this service. We do not knowingly
            collect data from children under 13 without parental consent.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">8. Contact</h2>
          <p className="text-sm text-slate2 leading-relaxed">
            Questions about this policy? Email{' '}
            <a href="mailto:support@gcseasy.org" className="text-accent underline">support@gcseasy.org</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
