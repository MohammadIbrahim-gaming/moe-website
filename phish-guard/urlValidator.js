/**
 * URL Validator - Detects suspicious domains and phishing attempts
 */

// List of well-known legitimate domains to check against
const TRUSTED_DOMAINS = [
  'apple.com',
  'google.com',
  'microsoft.com',
  'amazon.com',
  'facebook.com',
  'twitter.com',
  'instagram.com',
  'linkedin.com',
  'github.com',
  'paypal.com',
  'ebay.com',
  'netflix.com',
  'youtube.com',
  'adobe.com',
  'dropbox.com',
  'bankofamerica.com',
  'wellsfargo.com',
  'chase.com',
  'citibank.com',
  'usbank.com'
];

// Common TLDs
const COMMON_TLDS = ['.com', '.net', '.org', '.edu', '.gov', '.io', '.co', '.uk', '.ca', '.au'];

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,      // deletion
          dp[i][j - 1] + 1,      // insertion
          dp[i - 1][j - 1] + 1   // substitution
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * Extract domain from URL
 */
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.toLowerCase().replace(/^www\./, '');
  } catch (e) {
    // If URL parsing fails, try to extract domain manually
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?([^\/\s]+)/);
    return match ? match[1].toLowerCase() : url.toLowerCase();
  }
}

/**
 * Check if domain is suspiciously similar to a trusted domain
 */
function checkTyposquatting(domain) {
  const domainWithoutTld = domain.split('.')[0];
  const suspiciousMatches = [];

  for (const trustedDomain of TRUSTED_DOMAINS) {
    const trustedWithoutTld = trustedDomain.split('.')[0];
    const distance = levenshteinDistance(domainWithoutTld, trustedWithoutTld);
    
    // If the distance is 1-2 characters, it's likely a typo or typosquatting
    if (distance > 0 && distance <= 2 && domainWithoutTld.length >= 3) {
      const similarity = 1 - (distance / Math.max(domainWithoutTld.length, trustedWithoutTld.length));
      if (similarity > 0.7) {
        suspiciousMatches.push({
          trusted: trustedDomain,
          similarity: similarity,
          distance: distance
        });
      }
    }
  }

  return suspiciousMatches.length > 0 ? suspiciousMatches : null;
}

/**
 * Check for homoglyph attacks (using similar-looking characters)
 */
function checkHomoglyphs(domain) {
  const homoglyphMap = {
    '0': 'o',
    '1': 'l',
    '3': 'e',
    '5': 's',
    '8': 'b',
    'а': 'a',  // Cyrillic
    'е': 'e',  // Cyrillic
    'о': 'o',  // Cyrillic
    'р': 'p',  // Cyrillic
    'с': 'c',  // Cyrillic
    'у': 'y',  // Cyrillic
    'х': 'x'   // Cyrillic
  };

  let normalizedDomain = domain;
  for (const [homoglyph, normal] of Object.entries(homoglyphMap)) {
    normalizedDomain = normalizedDomain.replace(new RegExp(homoglyph, 'gi'), normal);
  }

  const domainWithoutTld = normalizedDomain.split('.')[0];
  for (const trustedDomain of TRUSTED_DOMAINS) {
    const trustedWithoutTld = trustedDomain.split('.')[0];
    if (domainWithoutTld === trustedWithoutTld && domain !== trustedDomain) {
      return { trusted: trustedDomain, type: 'homoglyph' };
    }
  }

  return null;
}

/**
 * Check for suspicious patterns
 */
function checkSuspiciousPatterns(domain) {
  const patterns = [
    /^[0-9]+/,  // Starts with numbers
    /-[0-9]+$/, // Ends with numbers after dash
    /^[a-z0-9]{1,3}\./, // Very short subdomain
    /\.(tk|ml|ga|cf|gq)$/i, // Suspicious TLDs
    /(secure|verify|update|account|login|signin|support)[0-9]+/i, // Phishing keywords with numbers
  ];

  for (const pattern of patterns) {
    if (pattern.test(domain)) {
      return { type: 'suspicious_pattern', pattern: pattern.toString() };
    }
  }

  return null;
}

/**
 * Check if domain uses IP address instead of domain name
 */
function checkIPAddress(url) {
  const ipPattern = /^https?:\/\/(\d{1,3}\.){3}\d{1,3}/;
  if (ipPattern.test(url)) {
    return { type: 'ip_address', risk: 'high' };
  }
  return null;
}

/**
 * Main validation function
 */
function validateURL(url) {
  const results = {
    isSafe: true,
    warnings: [],
    riskLevel: 'low',
    domain: extractDomain(url)
  };

  // Check IP address
  const ipCheck = checkIPAddress(url);
  if (ipCheck) {
    results.isSafe = false;
    results.warnings.push('URL uses IP address instead of domain name');
    results.riskLevel = 'high';
  }

  const domain = results.domain;

  // Check if domain is in trusted list
  const isTrusted = TRUSTED_DOMAINS.some(trusted => 
    domain === trusted || domain.endsWith('.' + trusted)
  );

  if (isTrusted) {
    return results; // Trusted domain, no further checks needed
  }

  // Check for typosquatting
  const typosquatting = checkTyposquatting(domain);
  if (typosquatting) {
    results.isSafe = false;
    results.riskLevel = 'high';
    results.warnings.push(
      `Domain "${domain}" is suspiciously similar to trusted domain "${typosquatting[0].trusted}" ` +
      `(similarity: ${Math.round(typosquatting[0].similarity * 100)}%)`
    );
  }

  // Check for homoglyphs
  const homoglyph = checkHomoglyphs(domain);
  if (homoglyph) {
    results.isSafe = false;
    results.riskLevel = 'high';
    results.warnings.push(
      `Domain "${domain}" uses similar-looking characters to mimic "${homoglyph.trusted}"`
    );
  }

  // Check for suspicious patterns
  const suspiciousPattern = checkSuspiciousPatterns(domain);
  if (suspiciousPattern) {
    results.isSafe = false;
    if (results.riskLevel === 'low') {
      results.riskLevel = 'medium';
    }
    results.warnings.push(`Domain contains suspicious pattern: ${suspiciousPattern.type}`);
  }

  return results;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validateURL, extractDomain };
}
