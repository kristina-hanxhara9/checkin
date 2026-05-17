export const PDF_STYLES = `
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    color: #0f172a;
    margin: 0;
    padding: 0;
    font-size: 12px;
    line-height: 1.5;
  }
  h1 { font-size: 24px; margin: 0 0 4px 0; color: #0f172a; }
  h2 { font-size: 16px; margin: 24px 0 8px 0; padding-bottom: 4px; border-bottom: 1px solid #e2e8f0; }
  h3 { font-size: 13px; margin: 12px 0 4px 0; color: #334155; }
  p { margin: 0 0 8px 0; }
  .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 24px; }
  .header .meta { color: #64748b; font-size: 11px; }
  .summary { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 24px; }
  .summary-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
  table { width: 100%; border-collapse: collapse; margin: 8px 0 16px 0; }
  th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #e2e8f0; vertical-align: top; font-size: 11px; }
  th { background: #f1f5f9; font-weight: 600; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 600; }
  .badge-good { background: #dcfce7; color: #166534; }
  .badge-fair { background: #fef9c3; color: #854d0e; }
  .badge-poor { background: #fee2e2; color: #991b1b; }
  .badge-flag { background: #fef3c7; color: #92400e; margin-left: 4px; }
  .verdict-no_change { background: #e2e8f0; color: #334155; }
  .verdict-fair_wear { background: #dbeafe; color: #1e40af; }
  .verdict-tenant_liable { background: #fee2e2; color: #991b1b; }
  .verdict-pre_existing { background: #f3e8ff; color: #6b21a8; }
  .room-note { color: #64748b; font-style: italic; margin-bottom: 8px; font-size: 11px; }
  .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 10px; text-align: center; }
  .total-row td { font-weight: 600; background: #f8fafc; }
`;

export function ratingClass(rating: string): string {
  switch (rating) {
    case "Good": return "badge-good";
    case "Fair": return "badge-fair";
    case "Poor": return "badge-poor";
    default: return "";
  }
}
