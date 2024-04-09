// https://github.com/thekelvinliu/country-code-emoji
const { countryCodeEmoji, emojiCountryCode } = require('country-code-emoji');

module.exports = value => {
  const countryEmoji = countryCodeEmoji(value);
  return countryEmoji;
}
