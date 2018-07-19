'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _eventEmitter = require('./event-emitter');

Object.defineProperty(exports, 'DefaultChangelogAdapter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_eventEmitter).default;
  }
});

var _changelogAdapterFactory = require('./changelog-adapter-factory');

Object.defineProperty(exports, 'createChangelogAdapter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_changelogAdapterFactory).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }