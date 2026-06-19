export function TrustStrip() {
  return (
    <div className="flex flex-col items-center gap-4 text-sm sm:flex-row sm:justify-center sm:gap-10">
      <span className="font-semibold uppercase tracking-widest text-muted-foreground">Built on</span>
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        <span className="inline-flex items-center gap-2">
          <MicrosoftMark />
          <span className="font-medium">Microsoft Graph</span>
        </span>
        <span className="inline-flex items-center gap-2">
          <GoogleMark />
          <span className="font-medium">Google Gemini</span>
        </span>
        <span className="inline-flex items-center gap-2">
          <CloudMark />
          <span className="font-medium">Your OneDrive</span>
        </span>
      </div>
    </div>
  );
}

function MicrosoftMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <rect x="2" y="2" width="9" height="9" fill="#F25022" />
      <rect x="13" y="2" width="9" height="9" fill="#7FBA00" />
      <rect x="2" y="13" width="9" height="9" fill="#00A4EF" />
      <rect x="13" y="13" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path d="M12 5c1.6 0 3 .6 4.1 1.6l2.3-2.3A9.8 9.8 0 0 0 12 2a10 10 0 0 0 0 20c5.8 0 9.6-4 9.6-9.7 0-.7-.1-1.2-.2-1.7H12v3.6h5.4c-.3 1.2-1 2.2-2 2.9v2.5h3.4c2-1.9 3.2-4.7 3.2-8.1z" fill="#4285F4" />
      <path d="M12 22c2.6 0 4.9-.9 6.5-2.4l-3.4-2.5c-.9.6-2 1-3.1 1-2.4 0-4.4-1.6-5.1-3.8H3.4v2.5A10 10 0 0 0 12 22z" fill="#34A853" />
      <path d="M6.9 14.3a6 6 0 0 1 0-3.8V8H3.4a10 10 0 0 0 0 8l3.5-1.7z" fill="#FBBC05" />
      <path d="M12 6.6c1.4 0 2.6.5 3.6 1.4l2.7-2.7A10 10 0 0 0 3.4 8L7 10.5C7.7 8.3 9.6 6.6 12 6.6z" fill="#EA4335" />
    </svg>
  );
}

function CloudMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M7 18a4 4 0 1 1 .8-7.9A5 5 0 0 1 17.8 11 3.5 3.5 0 0 1 17 18H7z"
        fill="#0078D4"
      />
    </svg>
  );
}
