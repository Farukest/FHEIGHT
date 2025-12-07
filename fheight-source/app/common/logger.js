/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const _ = require('underscore');
const moment = require('moment');

// if process.env.RECORD_CLIENT_LOGS
//   ['log', 'debug', 'warn', 'error', 'info'].forEach((f)=>
//     oldFunction = console[f]
//     console[f] = ()->
//       record_args = Array.prototype.slice.call(arguments)
//       # record_args?.unshift(_name)
//       Logger.record(record_args)
//       oldFunction.apply(console,arguments)
//   )

class Logger {
  static initClass() {
  
    // STATIC
  
    this._hue =0;
    this._padLength =10;
    this._modules ={};
  
    this.enabled =true;
    this.isRecording =process.env.RECORD_CLIENT_LOGS;
    this.recordedBuffer =[];
  }

  static startRecording(){
    this.isRecording = true;
    return this.recordedBuffer = [];
  }
  static recordingFilter() {
    return true;
  }
  static record(){
    const args = _.map(arguments[0],arg => arg != null ? arg.toString() : undefined);
    if (this.recordingFilter(args)) {
      if (!(args[1] instanceof Object)) { this.recordedBuffer.push(args); }
      if (this.recordedBuffer.length > 500) {
        return this.recordedBuffer.shift();
      }
    }
  }

  static endRecording(){
    this.isRecording = false;
    this.recordedBuffer = [];
    return this.recordingFilter = () => true;
  }

  static log() {
    return this.module("GLOBAL").log.apply(this,arguments);
  }
  static debug() {
    return this.module("GLOBAL").debug.apply(this,arguments);
  }
  static warn() {
    return this.module("GLOBAL").warn.apply(this,arguments);
  }
  static error() {
    return this.module("GLOBAL").error.apply(this,arguments);
  }
  static group() {
    return this.module("GLOBAL").group.apply(this,arguments);
  }
  static groupEnd() {
    return this.module("GLOBAL").groupEnd.apply(this,arguments);
  }

  static module(name){

    if (!this.enabled) {
      return {
        log(){},
        debug(){},
        error(){},
        warn(){},
        group(){},
        groupEnd(){},
        time(){},
        timeEnd(){}
      };
    }

    if (this._modules[name]) {
      return this._modules[name];
    }

    const _name = name;
    const _color = Logger.yieldColor();

    let logfn = null;
    let modulePrefix = null;
    let modulePrefixColorString = `color: hsl(${_color},99%,40%);`;

    if (_name !== "GLOBAL") {
      modulePrefix = _name.slice(0, Logger._padLength);
      modulePrefix += Array((Logger._padLength + 3) - modulePrefix.length).join(' ') + '|';
      if (typeof window !== 'undefined') {
        modulePrefix = "%c"+modulePrefix;
      } else {
        modulePrefix = Logger.terminalStylize(modulePrefix,Object.keys(this._modules).length);
        modulePrefixColorString = null;
      }
    }

    if (modulePrefix && modulePrefixColorString) {
      logfn = console.log.bind(console, modulePrefix, modulePrefixColorString);
      ['log', 'debug', 'warn', 'error', 'info'].forEach(function(f){
        const logFunction = console[f] || console['log'];
        return logfn[f] = logFunction.bind(console, modulePrefix, modulePrefixColorString);
      });
    } else {
      logfn = console.log.bind(console, modulePrefix);
      ['log', 'debug', 'warn', 'error', 'info'].forEach(function(f){
        const logFunction = console[f] || console['log'];
        return logfn[f] = logFunction.bind(console, modulePrefix, moment().unix());
      });
    }

    ['group', 'groupEnd'].forEach(function(f){
      if (console[f]) {
        return logfn[f] = console[f].bind(console);
      } else {
        return logfn[f] = () => ({});
      }});

    ['time', 'timeEnd'].forEach(function(f){
      if (console[f]) {
        return logfn[f] = msg => console[f](`${modulePrefix} ${msg}`);
      } else {
        return logfn[f] = () => ({});
      }});

    this._modules[name] = logfn;

    // on the client side in production, wrap any of the log functions with a function that potentially routes logs to be recorded
    if ((typeof window !== 'undefined') && process.env.RECORD_CLIENT_LOGS) {
      this._modules[name] = {};
      ['log', 'debug', 'warn', 'error', 'info'].forEach(f=> {
        return this._modules[name][f] = function(){
          if (Logger.isRecording) {
            const record_args = Array.prototype.slice.call(arguments);
            if (record_args != null) {
              record_args.unshift(_name);
            }
            Logger.record(record_args);
          }
          return logfn.apply(null, arguments);
        };
      });
      ['group', 'groupEnd'].forEach(f=> {
        return this._modules[name][f] = logfn[f];
      });
    }

    // return the new logger module
    return this._modules[name];
  }

  static yieldColor(){
    const goldenRatio = 0.618033988749895;
    this._hue += goldenRatio;
    this._hue = this._hue % 1;
    return this._hue * 360;
  }

  static terminalStylize(str, styleIndex){

    const styles = {
      'blue'      : ['\x1B[34m', '\x1B[39m'],
      'cyan'      : ['\x1B[36m', '\x1B[39m'],
      'green'     : ['\x1B[32m', '\x1B[39m'],
      'magenta'   : ['\x1B[35m', '\x1B[39m'],
      'red'       : ['\x1B[31m', '\x1B[39m'],
      'yellow'    : ['\x1B[33m', '\x1B[39m']
    };

    let key = Object.keys(styles)[0];
    if (styleIndex < Object.keys(styles).length) {
      key = Object.keys(styles)[styleIndex];
    }

    return styles[key][0] + str + styles[key][1];
  }
}
Logger.initClass();


module.exports = Logger;
