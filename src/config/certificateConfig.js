/**
 * Certificates Configuration
 * Customize the certificates feature without modifying component code
 */

export const certificateConfig = {
  // HackerRank Profile
  hackerRank: {
    username: "rohanvaradaraju1",
    profileUrl: "https://www.hackerrank.com/profile/rohanvaradaraju1"
  },

  // Grid Settings
  grid: {
    gapSize: "gap-4",
    // Responsive columns: sm, md, lg, xl
    columns: {
      mobile: "grid-cols-1",
      tablet: "sm:grid-cols-2",
      desktop: "lg:grid-cols-3",
      xl: "xl:grid-cols-4"
    }
  },

  // Card Settings
  card: {
    minHeight: "min-h-[220px]",
    imageHeight: "h-24",
    hoverEffect: true,
    showExternalIcon: true
  },

  // Modal Settings
  modal: {
    enabled: true,
    animation: true,
    backdropBlur: true,
    width: "max-w-md"
  },

  // Skeleton Loader
  skeleton: {
    count: 8,
    animationSpeed: 1.5
  },

  // Filtering
  filtering: {
    enabled: true,
    showResultsCount: true,
    skillMapping: {
      problem: "Problem Solving",
      algorithm: "Algorithms",
      data: "Data Structures",
      sql: "SQL",
      python: "Python",
      javascript: "JavaScript",
      java: "Java",
      cpp: "C++",
      react: "React",
      html: "HTML",
      css: "CSS",
      web: "Web Development",
      machine: "Machine Learning",
      ai: "Artificial Intelligence",
      git: "Git",
      linux: "Linux",
      shell: "Shell",
      rest: "REST API",
      api: "API"
    }
  },

  // Performance
  performance: {
    lazyLoadImages: true,
    preloadCount: 3,
    debounceMs: 300
  },

  // Mock Data
  mockData: {
    useFallback: true,
    preloadOnError: true
  },

  // Styling
  styles: {
    theme: "dark", // 'dark' | 'light'
    primaryColor: "#6366f1",
    glassEffect: true,
    borderOpacity: 0.1
  },

  // API Endpoints
  api: {
    hackerRankEndpoint: "/api/hackerrank",
    timeout: 10000, // ms
    retryAttempts: 3
  },

  // Internationalization
  i18n: {
    locale: "en-US",
    dateFormat: "short", // 'short' | 'long'
    messages: {
      loading: "Loading certificates...",
      noData: "No certificates found",
      filterBySkill: "Filter by skill:",
      verified: "✓ Verified",
      viewCertificate: "View Certificate"
    }
  }
};

/**
 * Helper function to get certificate card classes
 */
export const getCertificateCardClasses = () => {
  const { grid, card } = certificateConfig;
  return {
    grid: `grid gap-4 ${grid.columns.mobile} ${grid.columns.tablet} ${grid.columns.desktop} ${grid.columns.xl}`,
    card: `glass-card rounded-xl overflow-hidden p-5 flex flex-col ${card.minHeight}`,
    image: `${card.imageHeight} w-full object-cover rounded-lg`
  };
};

/**
 * Helper function to get filter button classes
 */
export const getFilterButtonClasses = (isActive) => {
  if (isActive) {
    return "bg-primary/20 text-primary border border-primary/50";
  }
  return "bg-slate-800/50 text-slate-300 border border-white/10 hover:border-white/20";
};

/**
 * Helper function to format certificate date
 */
export const formatCertificateDate = (dateString) => {
  const { i18n } = certificateConfig;
  const date = new Date(dateString);
  
  if (i18n.dateFormat === "short") {
    return date.toLocaleDateString(i18n.locale, { 
      year: "numeric", 
      month: "short" 
    });
  }
  
  return date.toLocaleDateString(i18n.locale, { 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });
};

export default certificateConfig;
