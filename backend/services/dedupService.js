// ==============================================================================
// NEXGUIDE LIVE — DEDUPLICATION SERVICE
// Prevents duplicate listings across multiple aggregators (LinkedIn, Indeed, etc.)
// ==============================================================================

/**
 * Deduplicates opportunities using normalized URLs and title-company signatures.
 */
export function deduplicateOpportunities(opportunities) {
  if (!Array.isArray(opportunities)) return [];

  const seenUrls = new Set();
  const seenSignatures = new Set();
  const unique = [];

  for (const opp of opportunities) {
    // 1. Normalize URL
    const cleanUrl = normalizeUrl(opp.url);
    if (cleanUrl && cleanUrl !== '#' && seenUrls.has(cleanUrl)) {
      continue;
    }

    // 2. Compute canonical signature (simplified title + company)
    const signature = `${cleanString(opp.title)}__${cleanString(opp.organization)}`;
    if (seenSignatures.has(signature)) {
      continue;
    }

    // Register as seen
    if (cleanUrl && cleanUrl !== '#') {
      seenUrls.add(cleanUrl);
    }
    seenSignatures.add(signature);

    unique.push(opp);
  }

  return unique;
}

function normalizeUrl(rawUrl) {
  if (!rawUrl || rawUrl === '#') return '';
  try {
    const u = new URL(rawUrl);
    // Strip common tracking parameters (utm_*, ref, etc.)
    u.searchParams.delete('utm_source');
    u.searchParams.delete('utm_medium');
    u.searchParams.delete('utm_campaign');
    u.searchParams.delete('utm_term');
    u.searchParams.delete('utm_content');
    u.searchParams.delete('fbclid');
    u.searchParams.delete('gclid');
    return `${u.origin}${u.pathname}`.toLowerCase();
  } catch {
    return rawUrl.toLowerCase().trim();
  }
}

function cleanString(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}
