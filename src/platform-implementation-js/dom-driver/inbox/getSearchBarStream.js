/* @flow */
//jshint ignore:start

import _ from 'lodash';
import Kefir from 'kefir';
import udKefir from 'ud-kefir';
import type InboxDriver from './inbox-driver';

import finder from './detection/searchBar/finder';
import parser from './detection/searchBar/parser';

import detectionRunner from '../../lib/dom/detectionRunner';

const impStream = udKefir(module, imp);

function imp(driver: InboxDriver) {
  return detectionRunner({
    name: 'searchBar',
    finder, watcher: null, parser,
    interval: (count, timeRunning) =>
      (count === 0 && timeRunning < 60*1000) ? 300 : 2*60*1000,
    logError(err: Error, details?: any) {
      driver.getLogger().errorSite(err, details);
    }
  });
}

export default function getSearchBarStream(driver: InboxDriver) {
  return impStream.flatMapLatest(_imp => _imp(driver));
}