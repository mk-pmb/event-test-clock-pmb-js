
<!--#echo json="package.json" key="name" underline="=" -->
event-test-clock-pmb
====================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
EventEmitter + Timer + Counter. Easily generate time events for testing.
<!--/#echo -->


Usage
-----

<!--#include file="clock.js" start="  //#u" stop="  //#r"
  outdent="  " code="javascript" -->
<!--#verbatim lncnt="12" -->
```javascript
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
```
<!--/include-->



<!--#toc stop="scan" -->



Known issues
------------

* needs more/better tests and docs




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
