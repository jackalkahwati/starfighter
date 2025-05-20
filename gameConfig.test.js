import test from 'node:test';
import assert from 'node:assert/strict';
import { levels } from './modules/gameConfig.js';

test('levels are sorted and spawnInterval decreases', () => {
  for (let i = 0; i < levels.length; i++) {
    assert.equal(levels[i].level, i + 1);
    if (i > 0) {
      assert.ok(levels[i].spawnInterval <= levels[i - 1].spawnInterval);
    }
  }
});
