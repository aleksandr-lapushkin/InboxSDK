/* @flow */

import {defn} from 'ud';
import Kefir from 'kefir';
import kefirStopper from 'kefir-stopper';

class InboxBackdrop {
  _stopper: Kefir.Stream&{destroy():void} = kefirStopper();

  constructor() {
    const el = document.createElement('div');
    el.className = 'inboxsdk__inbox_backdrop';
    el.addEventListener('click', () => {
      this.destroy();
    });
    document.body.appendChild(el);

    this._stopper.onValue(() => {
      el.classList.remove('inboxsdk__active');
      Kefir.fromEvents(el, 'transitionend')
        .take(1)
        .onValue(() => {
          el.remove();
        });
    });

    el.offsetHeight; // force layout so that adding this class does a transition.
    el.classList.add('inboxsdk__active');
  }

  getStopper(): Kefir.Stream {
    return this._stopper;
  }

  destroy() {
    this._stopper.destroy();
  }
}

export default defn(module, InboxBackdrop);
