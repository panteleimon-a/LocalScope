const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Utility to extract JWT from a JSON object or string
export function extractJwtToken(tokenObjOrString) {
  if (!tokenObjOrString) return null;
  if (typeof tokenObjOrString === "string") {
    try {
      // Try to parse as JSON
      const obj = JSON.parse(tokenObjOrString);
      if (obj && obj.token) return obj.token;
      return tokenObjOrString;
    } catch {
      // Not JSON, assume it's already a JWT string
      return tokenObjOrString;
    }
  }
  if (typeof tokenObjOrString === "object" && tokenObjOrString.token) {
    return tokenObjOrString.token;
  }
  return null;
}

export default reportWebVitals;
