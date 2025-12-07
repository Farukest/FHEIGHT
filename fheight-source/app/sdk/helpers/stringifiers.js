/*
 * decaffeinate suggestions:
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//Centralized place for stringifier functions

const i18next = require('i18next');

// returns a signed stat buff e.g. "+2"
const stringifyStatBuff = function(statBuff) {
  if (statBuff == null) { statBuff = 0; }
  if (statBuff < 0) {
    return i18next.t("modifiers.minus_stat",{amount:Math.abs(statBuff)});
  } else {
    return i18next.t("modifiers.plus_stat",{amount:statBuff});
  }
};

exports.stringifyStatBuff = stringifyStatBuff;

// returns signed stat buffs e.g. "+2/-2" "+2 Attack" or "+2 Health"
const stringifyAttackHealthBuff = function(attackBuff,healthBuff) {
  if (attackBuff == null) { attackBuff = 0; }
  if (healthBuff == null) { healthBuff = 0; }
  if ((attackBuff !== 0) && (healthBuff === 0)) {
    return (stringifyAttackBuff(attackBuff));
  } else if ((attackBuff === 0) && (healthBuff !== 0)) {
    return (stringifyHealthBuff(healthBuff));
  } else {
    return stringifyStatBuff(attackBuff)+i18next.t("modifiers.stat_divider")+stringifyStatBuff(healthBuff);
  }
};

exports.stringifyAttackHealthBuff = stringifyAttackHealthBuff;

// returns a signed attack buff e.g. "+2 Attack"
var stringifyAttackBuff = function(attackBuff) {
  if (attackBuff == null) { attackBuff = 0; }
  if (attackBuff < 0) {
    return i18next.t("modifiers.minus_attack_key",{amount:Math.abs(attackBuff)});
  } else {
    return i18next.t("modifiers.plus_attack_key",{amount:attackBuff});
  }
};

exports.stringifyAttackBuff = stringifyAttackBuff;

// returns a signed health buff e.g. "+2 Health"
var stringifyHealthBuff = function(healthBuff) {
  if (healthBuff == null) { healthBuff = 0; }
  if (healthBuff < 0) {
    return i18next.t("modifiers.minus_health_key",{amount:Math.abs(healthBuff)});
  } else {
    return i18next.t("modifiers.plus_health_key",{amount:healthBuff});
  }
};


exports.stringifyHealthBuff = stringifyHealthBuff;

// Creates a string out of a tuple of name and description
// Responds to options.boldStart: "<b>", options.boldEnd: "</b>" -> wraps name
const stringifyNameAndOrDescription = function(name, description, options) {
  let ret;
  if (name == null) { name = undefined; }
  if (description == null) { description = undefined; }
  if (options == null) { options = {}; }
  if (name && (options.boldStart != null)) {
    name = options.boldStart + name + options.boldEnd;
  }
  if (name && description) {
    ret = name + ": " + description + ".";
  } else if(name) {
    ret = name;
  } else if(description) {
    ret = description + ".";
  }
  return ret;
};

exports.stringifyNameAndOrDescription = stringifyNameAndOrDescription;
