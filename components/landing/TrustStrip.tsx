export function TrustStrip() {
  return (
    <div className="flex flex-col items-center gap-3 border-y py-6 text-xs text-muted-foreground sm:flex-row sm:justify-center sm:gap-8">
      <span className="font-medium uppercase tracking-wider">Built on</span>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <span className="inline-flex items-center gap-1.5">
          <MicrosoftMark />
          <span>Microsoft Graph</span>
        </span>
        <span className="hidden text-muted-foreground/40 sm:inline">·</span>
        <span className="inline-flex items-center gap-1.5">
          <GoogleMark />
          <span>Google Gemini</span>
        </span>
        <span className="hidden text-muted-foreground/40 sm:inline">·</span>
        <span className="inline-flex items-center gap-1.5">
          <CloudMark />
          <span>Your OneDrive</span>
        </span>
      </div>
    </div>
  );
}

function MicrosoftMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <rect x="2" y="2" width="9" height="9" className="fill-current opacity-80" />
      <rect x="13" y="2" width="9" height="9" className="fill-current opacity-60" />
      <rect x="2" y="13" width="9" height="9" className="fill-current opacity-60" />
      <rect x="13" y="13" width="9" height="9" className="fill-current opacity-40" />
    </svg>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        d="M12 4l2.5 4.5L19 10l-3.5 3 .8 5L12 15.5 7.7 18l.8-5L5 10l4.5-1.5L12 4z"
        className="fill-current"
      />
    </svg>
  );
}

function CloudMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        d="M7 18a4 4 0 1 1 .8-7.9A5 5 0 0 1 17.8 11 3.5 3.5 0 0 1 17 18H7z"
        className="fill-current"
      />
    </svg>
  );
}
