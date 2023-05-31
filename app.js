function bruteForce(text, pattern) {
    const n = text.length;
    const m = pattern.length;
  
    for (let i = 0; i <= n - m; i++) {
      let j;
      for (j = 0; j < m; j++) {
        if (text[i + j] !== pattern[j]) {
          break;
        }
      }
      if (j === m) {
        return i; // Pattern found at index i
      }
    }
    return -1; // Pattern not found
  }
  

  function sunday(text, pattern) {
    const n = text.length;
    const m = pattern.length;
    const last = {};
  
    for (let i = 0; i < m; i++) {
      last[pattern[i]] = i + 1; // Store the last occurrence of each character in pattern
    }
  
    let i = 0;
    while (i <= n - m) {
      let j = 0;
      while (j < m && text[i + j] === pattern[j]) {
        j++;
      }
  
      if (j === m) {
        return i; // Pattern found at index i
      }
  
      if (i + m >= n) {
        break;
      }
  
      const nextChar = text[i + m];
      const skip = m - last[nextChar] + 1 || m + 1;
      i += skip;
    }
  
    return -1; // Pattern not found
  }
  
  function kmp(text, pattern) {
    const n = text.length;
    const m = pattern.length;
    const lps = computeLPSArray(pattern);
  
    let i = 0;
    let j = 0;
  
    while (i < n) {
      if (text[i] === pattern[j]) {
        i++;
        j++;
      }
  
      if (j === m) {
        return i - j; // Pattern found at index i - j
      }
  
      if (i < n && text[i] !== pattern[j]) {
        if (j !== 0) {
          j = lps[j - 1];
        } else {
          i++;
        }
      }
    }
  
    return -1; // Pattern not found
  
    function computeLPSArray(pattern) {
      const m = pattern.length;
      const lps = new Array(m).fill(0);
      let len = 0;
      let i = 1;
  
      while (i < m) {
        if (pattern[i] === pattern[len]) {
          len++;
          lps[i] = len;
          i++;
        } else {
          if (len !== 0) {
            len = lps[len - 1];
          } else {
            lps[i] = 0;
            i++;
          }
        }
      }
  
      return lps;
    }
  }

  function fsm(text, pattern) {
    const n = text.length;
    const m = pattern.length;
    const TF = computeTransitions(pattern);
  
    let state = 0;
  
    for (let i = 0; i < n; i++) {
      state = TF[state][text.charCodeAt(i)] || 0;
  
      if (state === m) {
        return i - m + 1; // Pattern found at index i - m + 1
      }
    }
  
    return -1; // Pattern not found
  
    function computeTransitions(pattern) {
      const m = pattern.length;
      const TF = new Array(m + 1).fill(null).map(() => new Array(256).fill(0));
      let lps = 0;
  
      TF[0][pattern.charCodeAt(0)] = 1;
  
      for (let i = 1; i <= m; i++) {
        for (let j = 0; j < 256; j++) {
          TF[i][j] = TF[lps][j];
        }
        if (i < m) {
          TF[i][pattern.charCodeAt(i)] = i + 1;
          lps = TF[lps][pattern.charCodeAt(i)];
        }
      }
  
      return TF;
    }
  }
  
  function rabinKarp(text, pattern) {
    const n = text.length;
    const m = pattern.length;
    const d = 256; // Number of characters in the alphabet
    const q = 101; // A prime number
  
    let p = 0; // Hash value for pattern
    let t = 0; // Hash value for text
    let h = 1;
  
    // Calculate the hash value of pattern and the first window of text
    for (let i = 0; i < m - 1; i++) {
      h = (h * d) % q;
    }
    for (let i = 0; i < m; i++) {
      p = (d * p + pattern.charCodeAt(i)) % q;
      t = (d * t + text.charCodeAt(i)) % q;
    }
  
    for (let i = 0; i <= n - m; i++) {
      if (p === t) {
        let j;
        for (j = 0; j < m; j++) {
          if (text[i + j] !== pattern[j]) {
            break;
          }
        }
        if (j === m) {
          return i; // Pattern found at index i
        }
      }
  
      if (i < n - m) {
        t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
        if (t < 0) {
          t = (t + q);
        }
      }
    }
  
    return -1; // Pattern not found
  }
  

  function gusfieldZ(text, pattern) {
    const concat = pattern + "$" + text;
    const n = concat.length;
    const m = pattern.length;
    const z = new Array(n).fill(0);
  
    let l = 0;
    let r = 0;
  
    for (let i = 1; i < n; i++) {
      if (i > r) {
        l = r = i;
        while (r < n && concat[r - l] === concat[r]) {
          r++;
        }
        z[i] = r - l;
        r--;
      } else {
        const k = i - l;
        if (z[k] < r - i + 1) {
          z[i] = z[k];
        } else {
          l = i;
          while (r < n && concat[r - l] === concat[r]) {
            r++;
          }
          z[i] = r - l;
          r--;
        }
      }
  
      if (z[i] === m) {
        return i - m - 1; // Pattern found at index i - m - 1
      }
    }
  
    return -1; // Pattern not found
  }
  
  
  // Generate some sample text and pattern
const text = "Mom bought me a new computer.";
const smallPattern = "new";
const largePattern = "Mom bought me a new computer.";

// Measure running times for small pattern
const smallPatternTimes = {
  bruteForce: [],
  sunday: [],
  kmp: [],
  fsm: [],
  rabinKarp: [],
  gusfieldZ: [],
};

for (let i = 1; i <= text.length; i++) {
  const smallText = text.substring(0, i);

  let start = performance.now();
  bruteForce(smallText, smallPattern);
  let end = performance.now();
  smallPatternTimes.bruteForce.push(end - start);

  start = performance.now();
  sunday(smallText, smallPattern);
  end = performance.now();
  smallPatternTimes.sunday.push(end - start);

  start = performance.now();
  kmp(smallText, smallPattern);
  end = performance.now();
  smallPatternTimes.kmp.push(end - start);

  start = performance.now();
  fsm(smallText, smallPattern);
  end = performance.now();
  smallPatternTimes.fsm.push(end - start);

  start = performance.now();
  rabinKarp(smallText, smallPattern);
  end = performance.now();
  smallPatternTimes.rabinKarp.push(end - start);

  start = performance.now();
  gusfieldZ(smallText, smallPattern);
  end = performance.now();
  smallPatternTimes.gusfieldZ.push(end - start);
}

// Measure running times for large pattern
const largePatternTimes = {
  bruteForce: [],
  sunday: [],
  kmp: [],
  fsm: [],
  rabinKarp: [],
  gusfieldZ: [],
};

for (let i = 1; i <= text.length; i++) {
  const smallText = text.substring(0, i);

  let start = performance.now();
  bruteForce(smallText, largePattern);
  let end = performance.now();
  largePatternTimes.bruteForce.push(end - start);

  start = performance.now();
  sunday(smallText, largePattern);
  end = performance.now();
  largePatternTimes.sunday.push(end - start);

  start = performance.now();
  kmp(smallText, largePattern);
  end = performance.now();
  largePatternTimes.kmp.push(end - start);

  start = performance.now();
  fsm(smallText, largePattern);
  end = performance.now();
  largePatternTimes.fsm.push(end - start);

  start = performance.now();
  rabinKarp(smallText, largePattern);
  end = performance.now();
  largePatternTimes.rabinKarp.push(end - start);

  start = performance.now();
  gusfieldZ(smallText, largePattern);
  end = performance.now();
  largePatternTimes.gusfieldZ.push(end - start);
}

// Create a timing data object
const data = {
  smallPattern: smallPatternTimes,
  largePattern: largePatternTimes,
};

// Convert the data to JSON string
const jsonData = JSON.stringify(data, null, 2);

// Create a Blob object with the JSON data
const blob = new Blob([jsonData], { type: "application/json" });

// Create a URL object for the Blob
const url = URL.createObjectURL(blob);

// Create a link element to download the file
const link = document.createElement("a");
link.href = url;
link.download = "timing_data.txt";

// Programmatically click the link to trigger the download
link.click();

// Clean up the URL object
URL.revokeObjectURL(url);
