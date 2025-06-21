/**
 * Advertisement Service
 * Handles Google AdSense integration and ad management
 */

class AdService {
  constructor() {
    this.adBlockerDetected = false;
    this.adsLoaded = false;
    this.retryCount = 0;
    this.maxRetries = 3;

    this.init();
  }

  init() {
    // Check if ads are blocked
    this.detectAdBlocker();

    // Initialize ads after page load
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => this.initializeAds(), 1000);
      });
    } else {
      setTimeout(() => this.initializeAds(), 1000);
    }
  }

  detectAdBlocker() {
    // Create a test ad element
    const testAd = document.createElement("div");
    testAd.innerHTML = "&nbsp;";
    testAd.className = "adsbox";
    testAd.style.cssText =
      "position:absolute;top:-9999px;left:-9999px;width:1px;height:1px;";

    document.body.appendChild(testAd);

    setTimeout(() => {
      if (testAd.offsetHeight === 0) {
        this.adBlockerDetected = true;
        console.log("Ad blocker detected");
        this.handleAdBlocker();
      }
      if (document.body.contains(testAd)) {
        document.body.removeChild(testAd);
      }
    }, 100);
  }

  handleAdBlocker() {
    // Gracefully handle ad blocker
    const adContainers = document.querySelectorAll(".ad-container");
    adContainers.forEach((container) => {
      container.style.display = "none";
    });
  }

  initializeAds() {
    if (this.adBlockerDetected) {
      console.log("Ad blocker detected, skipping ad initialization");
      return;
    }

    console.log("Initializing ads...");
    this.waitForAdSense();
  }

  waitForAdSense() {
    if (window.adsbygoogle) {
      console.log("AdSense loaded, pushing ads...");
      this.pushAds();
      this.adsLoaded = true;
    } else {
      this.retryCount++;
      if (this.retryCount < this.maxRetries) {
        console.log(
          `AdSense not ready, retrying... (${this.retryCount}/${this.maxRetries})`
        );
        setTimeout(() => this.waitForAdSense(), 2000);
      } else {
        console.error("AdSense failed to load after multiple attempts");
      }
    }
  }

  pushAds() {
    if (!window.adsbygoogle) {
      console.log("AdSense not loaded yet");
      return;
    }

    const ads = document.querySelectorAll(".adsbygoogle:not([data-pushed])");
    console.log(`Found ${ads.length} ads to initialize`);

    ads.forEach((ad, index) => {
      try {
        ad.style.display = "block";
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        ad.setAttribute("data-pushed", "true");
        console.log(`Ad ${index + 1} pushed successfully`);
      } catch (error) {
        console.error(`Error pushing ad ${index + 1}:`, error);
      }
    });
  }

  refreshAds() {
    if (!this.adsLoaded || this.adBlockerDetected) {
      return;
    }

    console.log("Refreshing ads...");
    const ads = document.querySelectorAll(".adsbygoogle[data-pushed]");
    ads.forEach((ad) => {
      ad.removeAttribute("data-pushed");
    });

    setTimeout(() => this.pushAds(), 100);
  }
}

// Initialize ad service
let adService;
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    adService = new AdService();
  });
} else {
  adService = new AdService();
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = AdService;
}
