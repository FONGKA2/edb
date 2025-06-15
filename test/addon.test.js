const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('addon.json', () => {
  const addonPath = path.join(__dirname, '..', 'addon.json');
  const addon = JSON.parse(fs.readFileSync(addonPath, 'utf8'));

  it('uses SDK v2', () => {
    assert.strictEqual(addon['sdk-version'], 2, 'sdk-version should be 2');
  });

  it('does not include runtime-scripts field', () => {
    assert.ok(!Object.prototype.hasOwnProperty.call(addon, 'runtime-scripts'),
      'runtime-scripts should be removed for SDK v2');
  });

  const requiredFiles = [
    'plugin.js',
    'type.js',
    'instance.js',
    'aces.json',
    'icon.svg',
  ];

  requiredFiles.forEach(file => {
    it(`has required file: ${file}`, () => {
      const filePath = path.join(__dirname, '..', file);
      assert.ok(fs.existsSync(filePath), `${file} should exist`);
    });
  });
});
