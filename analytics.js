/**
 * Google Analytics 4 (GA4) Configuration
 * Colégio Alfa e Omega
 * ID: G-FEXXN9D5XY
 */

// Initialize dataLayer if it doesn't exist
window.dataLayer = window.dataLayer || [];

// Core gtag function
function gtag() {
  dataLayer.push(arguments);
}

// Set default consent to 'denied' as per GDPR
gtag('consent', 'default', {
  'analytics_storage': 'denied',
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'wait_for_update': 500
});

// Initialize GA4
gtag('js', new Date());
gtag('config', 'G-FEXXN9D5XY', {
  'anonymize_ip': true,
  'cookie_flags': 'SameSite=None;Secure',
  'send_page_view': true,
  'page_title': document.title,
  'page_location': window.location.href
});

/**
 * Custom Conversion Tracking Function
 * Usage: trackConversion('enrollment_button_click')
 * @param {string} label - Conversion label/event name
 * @param {object} params - Additional event parameters (optional)
 */
function trackConversion(label, params = {}) {
  // Validate label
  if (!label || typeof label !== 'string') {
    console.warn('trackConversion: Invalid label provided');
    return false;
  }

  // Default parameters for conversion events
  const conversionParams = {
    'event': 'conversion',
    'conversion_label': label,
    'conversion_timestamp': new Date().toISOString(),
    'page_title': document.title,
    'page_location': window.location.href,
    ...params // Allow additional custom parameters
  };

  // Log conversion event
  console.log('📊 Conversion tracked:', {
    label: label,
    params: conversionParams,
    timestamp: new Date().toLocaleTimeString()
  });

  // Send event to Google Analytics
  gtag('event', 'conversion', conversionParams);

  return true;
}

/**
 * Track Page View with Custom Dimensions
 * Usage: trackPageView('page_name', {'user_role': 'parent'})
 */
function trackPageView(pageName, customDimensions = {}) {
  const pageViewParams = {
    'page_title': pageName || document.title,
    'page_location': window.location.href,
    ...customDimensions
  };

  gtag('event', 'page_view', pageViewParams);
  console.log('📄 Page view tracked:', pageName);
}

/**
 * Track Form Submission
 * Usage: trackFormSubmission('enrollment_form', {'year': '2026'})
 */
function trackFormSubmission(formName, formData = {}) {
  gtag('event', 'form_submit', {
    'form_name': formName,
    'form_data': formData,
    'submission_timestamp': new Date().toISOString()
  });
  console.log('📋 Form submitted:', formName);
}

/**
 * Track CTA Button Click
 * Usage: trackCTAClick('enroll_now_button')
 */
function trackCTAClick(buttonLabel) {
  gtag('event', 'click', {
    'event_category': 'engagement',
    'event_label': buttonLabel,
    'timestamp': new Date().toISOString()
  });
  console.log('🔘 CTA clicked:', buttonLabel);
}

/**
 * Track External Link Click
 * Usage: trackExternalLink('https://www.whatsapp.com', 'whatsapp')
 */
function trackExternalLink(url, label) {
  gtag('event', 'external_link_click', {
    'link_url': url,
    'link_label': label,
    'timestamp': new Date().toISOString()
  });
  console.log('🔗 External link clicked:', label);
}

/**
 * Track Video Engagement
 * Usage: trackVideoEngagement('video_id', 'play')
 */
function trackVideoEngagement(videoId, action) {
  gtag('event', 'video_engagement', {
    'video_id': videoId,
    'video_action': action,
    'timestamp': new Date().toISOString()
  });
  console.log('🎥 Video engagement:', action);
}

/**
 * Set User Properties
 * Usage: setUserProperties({user_type: 'parent', school_year: '2026'})
 */
function setUserProperties(properties = {}) {
  gtag('set', {
    'user_properties': properties
  });
  console.log('👤 User properties set:', properties);
}

/**
 * Track Scroll Depth
 * Auto-track when user scrolls to certain percentages of the page
 */
function initScrollTracking() {
  let previousScrollDepth = 0;
  
  window.addEventListener('scroll', function() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    const scrollPercentage = Math.round((scrollTop + windowHeight) / documentHeight * 100);
    
    // Track at 25%, 50%, 75%, 100%
    const milestones = [25, 50, 75, 100];
    
    milestones.forEach(milestone => {
      if (scrollPercentage >= milestone && previousScrollDepth < milestone) {
        gtag('event', 'scroll_depth', {
          'scroll_percentage': milestone,
          'page_title': document.title
        });
        console.log(`📍 Scroll depth: ${milestone}%`);
      }
    });
    
    previousScrollDepth = scrollPercentage;
  }, { passive: true });
}

/**
 * Automatic Enrollment Click Tracking
 * Intercepts clicks on enrollment buttons
 */
function initEnrollmentTracking() {
  // Track all links/buttons with 'matriculas' or 'enrollment' in href/class
  const enrollmentElements = document.querySelectorAll(
    'a[href*="matriculas"], button[data-action="enroll"], a.enrollment-btn, [data-track-enrollment]'
  );
  
  enrollmentElements.forEach(element => {
    element.addEventListener('click', function(e) {
      const label = this.getAttribute('data-enrollment-label') || 
                    this.textContent.trim() || 
                    'enrollment_button';
      
      trackConversion(`enrollment_click_${label.toLowerCase().replace(/\s+/g, '_')}`, {
        'button_text': this.textContent.trim(),
        'button_class': this.className,
        'page_referrer': document.title
      });
    });
  });
  
  console.log(`✅ Enrollment tracking initialized for ${enrollmentElements.length} elements`);
}

/**
 * Initialize all analytics features
 */
function initializeAnalytics() {
  console.log('🚀 Google Analytics 4 initialized');
  console.log('📊 ID: G-FEXXN9D5XY');
  
  // Auto-track scroll depth
  initScrollTracking();
  
  // Auto-track enrollment clicks
  initEnrollmentTracking();
  
  // Track initial page view
  trackPageView(document.title);
  
  console.log('✅ Analytics tracking features initialized');
}

// Initialize analytics when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAnalytics);
} else {
  initializeAnalytics();
}

/**
 * GDPR Consent Management
 * Call this function when user consents to analytics
 * Usage: updateAnalyticsConsent(true)
 */
function updateAnalyticsConsent(consent) {
  gtag('consent', 'update', {
    'analytics_storage': consent ? 'granted' : 'denied',
    'ad_storage': consent ? 'granted' : 'denied',
    'ad_user_data': consent ? 'granted' : 'denied',
    'ad_personalization': consent ? 'granted' : 'denied'
  });
  console.log('📋 Analytics consent:', consent ? 'GRANTED' : 'DENIED');
}

// Expose functions globally
window.trackConversion = trackConversion;
window.trackPageView = trackPageView;
window.trackFormSubmission = trackFormSubmission;
window.trackCTAClick = trackCTAClick;
window.trackExternalLink = trackExternalLink;
window.trackVideoEngagement = trackVideoEngagement;
window.setUserProperties = setUserProperties;
window.updateAnalyticsConsent = updateAnalyticsConsent;
window.gtag = gtag;
