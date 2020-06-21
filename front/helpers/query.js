/**
 * Работа с query - параметрами
 */

import { get } from 'lodash-es';

const qs = require('query-string');

function set(history, name, val) {
  if (!history || !val) return;

  const params = getParams(history);

  params[name] = Array.isArray(val) ? val.join() : val;

  history.push({
    search: `?${qs.stringify(params)}`,
  });
}

function getParams(history) {
  if (!history) return {};

  return qs.parse(getString(history));
}

function getString(history) {
  if (!history) return '';

  return get(history, 'location.search');
}

function remove(history, name) {
  if (!history) return;

  const params = getParams(history);

  params[name] && delete params[name];

  history.push({
    search: `?${qs.stringify(params)}`,
  });
}

export default {
  set, remove, get: getParams, getString,
};