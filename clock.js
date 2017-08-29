/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var EX, PT, flav = {}, inherits = require('util').inherits,
  EventEmitter = require('events').EventEmitter;

function isNum(x, no) { return ((x === +x) || no); }
function fail(why) { throw new Error(why); }
function setProp(o, k, v) { o[k] = v; }

PT = (function () {
  var CF = function EventTestClock() {
    /*jslint nomen:true */
    if (CF.super_) { CF.super_.apply(this, arguments); }
    /*jslint nomen:false */
  };
  inherits(CF, EventEmitter);
  return new CF();
}());

function makeClock(cfg) {
  var clk = Object.create(PT);
  clk.schedule = function (a) { return EX.schedule(clk, a); };
  Object.assign(clk, EX.defaultConfig, cfg);
  setImmediate(EX.makeClockwork(clk));
  return clk;
}
EX = makeClock;


EX.defaultConfig = {
  name: null,
  ticks: 0,
  muteBefore: 1,
  intvName: 'tick',
  intvSec: 1,
  stopAt: null,
};
EX.flavors = flav;


EX.makeClockwork = function (clk) {
  return function clockwork() {
    var intvMs = (+clk.intvSec || 0) * 1e3, t = clk.ticks, f;
    if (intvMs < 1) { return; }
    if ((!isNum(clk.stopAt)) || (t < clk.stopAt)) {
      setTimeout(function () {
        clk.ticks = t + 1;
        return clockwork();
      }, intvMs);
    }
    if (isNum(clk.muteBefore) && (t < clk.muteBefore)) { return; }
    f = clk.schedule[t];
    clk.emit(clk.intvName, t);
    if (f) { f.call(clk, t); }
  };
};


EX.schedule = function (clk, a) {
  var s = { t: 0,
    rel_abs: function (x) { return x; },
    rel_sum: function (n) { return s.t + n; },
    rel_now: function (n) { return clk.ticks + n; },
    };
  s.rel = s.rel_abs;
  a.forEach(function (e) {
    if (isNum(e)) { return setProp(s, 't', s.rel(e)); }
    if (!e) { return; }
    if (e.substr) {
      if (s['rel_' + e]) { return setProp(s, 'rel', s['rel_' + e]); }
    }
    if (e.apply) { return setProp(clk.schedule, s.t, e); }
    fail('Unsupported task: ' + String(e));
  });
};


PT.toString = function () {
  return '['.concat(this.constructor.name, ' ', this.name, ']');
};


PT.stop = function () { this.intvSec = 0; };

PT.emitNthTicks = function (e, n) {
  n = this.ticks / n;
  if ((n % 1) === 0) {
    if (this.verbose > 4) { console.log(String(this), 'emitNthTicks', e, n); }
    this.emit(e, n);
  }
};


flav.quarterSeconds = function (cfg) {
  //#u
  // var makeClock = require('event-test-clock-pmb');
  cfg = Object.assign({ intvName: 'qtrSec', intvSec: 0.25 }, cfg);
  var clk = makeClock(cfg);
  clk.on('qtrSec', function (t) {
    if (clk.verbose) { console.log(String(clk), 'tick', t, clk.intvName); }
    clk.emitNthTicks('halfSec', 2);
    clk.emitNthTicks('fullSec', 4);
    clk.emitNthTicks('dblSec',  8);
  });
  // for more demo, see package "event-historian-pmb"
  //#r
  return clk;
};















module.exports = EX;
