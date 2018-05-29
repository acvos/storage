'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _changeLog = require('./adapters/change-log');

var createChangelogAdapter = function createChangelogAdapter(type, namespace) {
  if (type === 'default') {
    return new _changeLog.DefaultChangelogAdapter({});
  } else if (type instanceof Object) {
    return new _changeLog.DefaultChangelogAdapter({ log: type });
  }

  return type;
};
exports.default = createChangelogAdapter;