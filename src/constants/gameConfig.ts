/**
 * Core game configuration constants
 */
export const GAME_CONFIG = {
  /** Game version for save compatibility */
  VERSION: '1.0.0',

  /** Auto-save interval in milliseconds (30 seconds) */
  AUTO_SAVE_INTERVAL: 30000,

  /** Target frames per second for game loop */
  TARGET_FPS: 60,

  /** Maximum offline time in hours for calculating offline progress */
  MAX_OFFLINE_HOURS: 8,

  /** Multiplier for offline production (50% of normal) */
  OFFLINE_PRODUCTION_MULTIPLIER: 0.5,

  /** LocalStorage key for saving game data */
  SAVE_KEY: 'cosmicClicker_save',

  /** LocalStorage key for settings */
  SETTINGS_KEY: 'cosmicClicker_settings',

  /** Minimum fuel required for first prestige */
  MIN_PRESTIGE_STARDUST: 1000000,

  /** Divisor for Nebula Crystal calculation (sqrt(totalFuel / this)) */
  PRESTIGE_DIVISOR: 1000000,

  /** Production bonus per Nebula Crystal (1% = 0.01) */
  NEBULA_CRYSTAL_BONUS: 0.01,

  /** Production bonus per achievement (1% = 0.01) */
  ACHIEVEMENT_BONUS: 0.01,

  /** Initial click power */
  INITIAL_CLICK_POWER: 1,

  /** Number format thresholds */
  NUMBER_ABBREVIATIONS: [
    { threshold: 1e3, suffix: 'K' },
    { threshold: 1e6, suffix: 'M' },
    { threshold: 1e9, suffix: 'B' },
    { threshold: 1e12, suffix: 'T' },
    { threshold: 1e15, suffix: 'Qa' },
    { threshold: 1e18, suffix: 'Qi' },
    { threshold: 1e21, suffix: 'Sx' },
    { threshold: 1e24, suffix: 'Sp' },
    { threshold: 1e27, suffix: 'Oc' },
    { threshold: 1e30, suffix: 'No' },
    { threshold: 1e33, suffix: 'Dc' },
    { threshold: 1e36, suffix: 'UDc' },
    { threshold: 1e39, suffix: 'DDc' },
    { threshold: 1e42, suffix: 'TDc' },
    { threshold: 1e45, suffix: 'QaDc' },
    { threshold: 1e48, suffix: 'QiDc' },
    { threshold: 1e51, suffix: 'SxDc' },
    { threshold: 1e54, suffix: 'SpDc' },
    { threshold: 1e57, suffix: 'OcDc' },
    { threshold: 1e60, suffix: 'NoDc' },
    { threshold: 1e63, suffix: 'Vg' },
    { threshold: 1e66, suffix: 'UVg' },
    { threshold: 1e69, suffix: 'DVg' },
    { threshold: 1e72, suffix: 'TVg' },
    { threshold: 1e75, suffix: 'QaVg' },
    { threshold: 1e78, suffix: 'QiVg' },
    { threshold: 1e81, suffix: 'SxVg' },
    { threshold: 1e84, suffix: 'SpVg' },
    { threshold: 1e87, suffix: 'OcVg' },
    { threshold: 1e90, suffix: 'NoVg' },
    { threshold: 1e93, suffix: 'Tg' },
    { threshold: 1e96, suffix: 'UTg' },
    { threshold: 1e99, suffix: 'DTg' },
  ],

  /** Particle effect settings */
  PARTICLES: {
    /** Maximum number of click particles on screen */
    MAX_CLICK_PARTICLES: 50,
    /** Duration of click particle animation in ms */
    CLICK_PARTICLE_DURATION: 1000,
    /** Number of background particles */
    BACKGROUND_PARTICLE_COUNT: 50,
  },

  /** Animation durations in ms */
  ANIMATIONS: {
    /** Toast notification display duration */
    TOAST_DURATION: 3000,
    /** Number count-up animation duration */
    NUMBER_COUNT_UP_DURATION: 500,
    /** Button click animation duration */
    BUTTON_PRESS_DURATION: 100,
  },

  /** Accessibility settings */
  ACCESSIBILITY: {
    /** Default reduced motion preference */
    DEFAULT_REDUCED_MOTION: false,
    /** Default high contrast preference */
    DEFAULT_HIGH_CONTRAST: false,
    /** Default screen reader announcements */
    DEFAULT_SCREEN_READER: true,
  },

  /** Phase 1: Fuel consumption rates by speed setting (fuel per second) */
  FUEL_CONSUMPTION_RATES: {
    stop: 0,
    slow: 0.5,
    normal: 1,
    fast: 2,
    boost: 5,
  },

  /** Phase 1: Base object spawn rate (objects per second) */
  OBJECT_SPAWN_RATE: 1.0,

  /** Phase 1: Object fall speed (pixels per second) */
  OBJECT_FALL_SPEED: 100,

  /** Phase 1: Ship movement speed (pixels per second at normal speed) */
  SHIP_BASE_SPEED: 50,
} as const;

/**
 * UI-related constants
 */
export const UI_CONFIG = {
  /** Breakpoints for responsive design (Tailwind defaults) */
  BREAKPOINTS: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },

  /** Z-index layers */
  Z_INDEX: {
    background: 0,
    content: 10,
    header: 20,
    modal: 30,
    toast: 40,
    tooltip: 50,
  },
} as const;
