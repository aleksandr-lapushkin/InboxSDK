/* @flow */
//jshint ignore:start

var _ = require('lodash');
var Kefir = require('kefir');
import type InboxComposeView from './inbox-compose-view';
import insertElementInOrder from '../../../lib/dom/insert-element-in-order';
import DropdownView from '../../../widgets/buttons/dropdown-view';
import InboxDropdownView from './inbox-dropdown-view';
import type {TooltipDescriptor} from '../../../views/compose-button-view';
import type {ComposeButtonDescriptor} from '../../../driver-interfaces/compose-view-driver';
import InboxTooltipView from './inbox-tooltip-view';

var insertionOrderHint: number = 0;

export default class InboxComposeButtonView {
  _composeView: InboxComposeView;
  _buttonEl: HTMLElement;
  _iconEl: HTMLImageElement;
  _tooltip: ?InboxTooltipView;

  constructor(composeView: InboxComposeView, buttonDescriptor: Kefir.Stream<?ComposeButtonDescriptor>, groupOrderHint: string, extraOnClickOptions: Object) {
    this._tooltip = null;
    this._composeView = composeView;
    var div = this._buttonEl = document.createElement('div');
    div.setAttribute('role', 'button');
    div.setAttribute('data-insertion-order-hint', String(insertionOrderHint++));
    div.tabIndex = 0;
    div.className = 'inboxsdk__button_icon';
    var img = this._iconEl = document.createElement('img');
    img.className = 'inboxsdk__button_iconImg';
    var onClick = _.noop;
    var hasDropdown = false;
    var dropdown = null;
    Kefir.merge([
      Kefir.fromEvents(div, 'click'),
      Kefir.fromEvents(div, 'keypress').filter(e => _.includes([32/*space*/, 13/*enter*/], e.which))
    ]).onValue(event => {
      event.preventDefault();
      event.stopPropagation();
      if (hasDropdown) {
        if (dropdown) {
          dropdown.close();
          return;
        } else {
          this._buttonEl.classList.add('inboxsdk__active');
          dropdown = new DropdownView(new InboxDropdownView(), div, {isBottomAligned: true});
          dropdown.on('destroy', () => {
            this._buttonEl.classList.remove('inboxsdk__active');
            dropdown = null;
          });
        }
      }
      onClick(Object.assign(({dropdown}:any), extraOnClickOptions));
    });
    var lastOrderHint = null;

    buttonDescriptor.takeUntilBy(composeView.getStopper()).onValue(buttonDescriptor => {
      if (!buttonDescriptor) {
        (div:any).remove();
        lastOrderHint = null;
        return;
      }
      hasDropdown = buttonDescriptor.hasDropdown;
      div.title = buttonDescriptor.title;
      div.className = 'inboxsdk__button_icon '+(buttonDescriptor.iconClass||'');
      onClick = buttonDescriptor.onClick;
      if (buttonDescriptor.iconUrl) {
        img.src = buttonDescriptor.iconUrl;
        div.appendChild(img);
      } else {
        (img:Object).remove();
      }
      var orderHint = buttonDescriptor.orderHint||0;
      if (lastOrderHint !== orderHint) {
        lastOrderHint = orderHint;
        div.setAttribute('data-order-hint', String(orderHint));
        insertElementInOrder(composeView.getModifierButtonContainer(), div);
      }
    });

    composeView.getStopper().onValue(() => {
      this.closeTooltip();
    })
  }

  showTooltip(tooltipDescriptor: TooltipDescriptor) {
    if (this._tooltip) {
      this.closeTooltip();
    }
    var tooltip = this._tooltip = new InboxTooltipView(this._buttonEl, tooltipDescriptor);
    tooltip.getStopper().onValue(() => {
      if (this._tooltip === tooltip) {
        this._tooltip = null;
      }
    });
  }

  closeTooltip() {
    if (this._tooltip) {
      this._tooltip.destroy();
    }
  }
}