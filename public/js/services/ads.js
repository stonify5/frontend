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
        this.initializeAds();
      });
    } else {
      this.initializeAds();
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
      document.body.removeChild(testAd);
    }, 100);
  }

  handleAdBlocker() {
    // Gracefully handle ad blocker
    const adContainers = document.querySelectorAll(".ad-container");
    adContainers.forEach((container) => {
      container.style.display = "none";
    });

    // Optional: Show a polite message to users
    // this.showAdBlockerMessage();
  }

  showAdBlockerMessage() {
    const message = document.createElement("div");
    message.className = "adblocker-message";
    message.innerHTML = `
            <div class="glass" style="padding: 1rem; margin: 1rem; text-align: center; border-radius: 12px;">
                <p>광고 차단기가 감지되었습니다. 무료 서비스 제공을 위해 광고를 허용해 주세요.</p>
            </div>
        `;

    const firstAdContainer = document.querySelector(".ad-container");
    if (firstAdContainer) {
      firstAdContainer.parentNode.insertBefore(message, firstAdContainer);
    }
  }

  initializeAds() {
    if (this.adBlockerDetected) {
      return;
    }

    // Initialize AdSense
    this.loadAdSense();

    // Setup responsive ads
    this.setupResponsiveAds();

    // Setup lazy loading for ads
    this.setupLazyLoading();
  }

  loadAdSense() {
    // Check if AdSense is already loaded
    if (window.adsbygoogle) {
      this.adsLoaded = true;
      this.pushAds();
      return;
    }

    // Load AdSense script
    const script = document.querySelector('script[src*="adsbygoogle.js"]');
    if (script) {
      script.addEventListener("load", () => {
        this.adsLoaded = true;
        this.pushAds();
      });

      script.addEventListener("error", () => {
        this.handleAdLoadError();
      });
    }
  }

  pushAds() {
    const ads = document.querySelectorAll(".adsbygoogle");
    ads.forEach((ad) => {
      try {
        if (!ad.getAttribute("data-pushed")) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          ad.setAttribute("data-pushed", "true");
        }
      } catch (error) {
        console.error("Error pushing ad:", error);
      }
    });
  }

  handleAdLoadError() {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      setTimeout(() => {
        this.loadAdSense();
      }, 2000 * this.retryCount);
    } else {
      console.error("Failed to load AdSense after multiple attempts");
      this.handleAdBlocker();
    }
  }

  setupResponsiveAds() {
    // Refresh ads on window resize
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.refreshAds();
      }, 500);
    });
  }

  setupLazyLoading() {
    if ("IntersectionObserver" in window) {
      const adObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const ad = entry.target.querySelector(".adsbygoogle");
              if (ad && !ad.getAttribute("data-pushed")) {
                try {
                  (window.adsbygoogle = window.adsbygoogle || []).push({});
                  ad.setAttribute("data-pushed", "true");
                } catch (error) {
                  console.error("Error with lazy-loaded ad:", error);
                }
              }
              adObserver.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "50px",
        }
      );

      // Observe all ad containers
      document.querySelectorAll(".ad-container").forEach((container) => {
        adObserver.observe(container);
      });
    }
  }

  refreshAds() {
    // Refresh ads for responsive design
    if (window.adsbygoogle && this.adsLoaded) {
      const ads = document.querySelectorAll(".adsbygoogle");
      ads.forEach((ad) => {
        if (ad.getAttribute("data-pushed")) {
          ad.removeAttribute("data-pushed");
        }
      });
      this.pushAds();
    }
  }

  // Analytics for ad performance
  trackAdPerformance() {
    // Track ad visibility
    if ("IntersectionObserver" in window) {
      const performanceObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const adContainer = entry.target;
              const adType = adContainer.className.includes("banner")
                ? "banner"
                : adContainer.className.includes("rectangle")
                ? "rectangle"
                : "sidebar";

              // Track with analytics (if available)
              if (window.gtag) {
                gtag("event", "ad_view", {
                  ad_type: adType,
                  page: document.body.dataset.page || "unknown",
                });
              }
            }
          });
        },
        {
          threshold: 0.5,
        }
      );

      document.querySelectorAll(".ad-container").forEach((container) => {
        performanceObserver.observe(container);
      });
    }
  }
}

// Initialize ad service
const adService = new AdService();

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = AdService;
}
