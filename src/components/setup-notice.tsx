export function SetupNotice() {
  return (
    <main className="screen stack">
      <h1 className="title">Setup needed</h1>
      <p className="body secondary">
        Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
        <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code>, then restart the
        dev server.
      </p>
    </main>
  );
}
