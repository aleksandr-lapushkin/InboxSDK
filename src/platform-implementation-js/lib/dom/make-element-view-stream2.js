// Built to be able to take a stream from makeElementChildStream2(). This doesn't
// call makeElementChildStream2() here -- you can call that yourself so you can
// filter/map/merge that stream however you want before passing it here. Make
// sure that the input elementStream ends at some point!
function makeElementViewStream2(opts) {
  var elementStream = opts.elementStream;
  var viewFn = opts.viewFn;

  return elementStream.map(function(event) {
    var view = viewFn(event.el);
    if (view) {
      event.removalStream.onValue(function() {
        view.destroy();
      });
    }
    return view;
  }).filter(Boolean);
}

module.exports = makeElementViewStream2;