/**
 * @deprecated
 *
 * Use ~/config/env instead
 *
 */
module.exports = {
  autopilot: {
    key : 'dfec2c98885c47789c8d5c52a2a8fad5',
    clientlist: 'contactlist_59EA0BF8-46D0-4733-B6C5-4F2EB7C890AA'
  },
  konnective: {
    loginId: 'flashlightsforever',
    key: 'gCx3N8DGqDhTTh'
  },
  redis: {
    url: process.env.url || 'redis://localhost:6379',
  },
  leadoutpost: {
    key : 'CITg0XHH3kGJQ4kkjZizRxzUEINR2nZaLRRstUyHs',
    campaignId: 5
  },
  email: 'support@tacticalmastery.com',
  serverPort: 3000
};