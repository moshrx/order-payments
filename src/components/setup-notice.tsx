export function SetupNotice({ missing }: { missing: string[] }) {
  return (
    <main className="screen stack">
      <h1 className="title">Setup needed</h1>
      <p className="body secondary">
        Add{' '}
        {missing.map((name, i) => (
          <span key={name}>
            {i > 0 ? ' and ' : ''}
            <code>{name}</code>
          </span>
        ))}{' '}
        to <code>.env.local</code>, then restart the dev server.
      </p>
    </main>
  );
}
