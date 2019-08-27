# i-18-n-demo

Demonstrates Sails i18n features.
view-homepage-or-redirect.js has 2 i18n related API calls.
1. sails.__ - carries out translation based on defaultLocale value specified in config/i18n.js or locales[0] value if defaultLocale is unspecified
2. this.req.i18n.__ - carries out translation based on the locale received in the request
