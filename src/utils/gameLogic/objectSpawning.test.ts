/**
 * Tests for object spawning utilities
 */

import { describe, it, expect } from 'vitest';
import {
  generateObjectId,
  calculateObjectVelocity,
  generateResourceDrops,
  generateSpawnPosition,
  createObjectFromTemplate,
  selectSpawnTemplate,
} from './objectSpawning';
import type { ObjectTemplate, LootEntry } from '@/constants/objects';

describe('objectSpawning', () => {
  describe('generateObjectId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateObjectId();
      const id2 = generateObjectId();
      const id3 = generateObjectId();

      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });

    it('should generate IDs with correct format', () => {
      const id = generateObjectId();
      expect(id).toMatch(/^obj_\d+_\d+$/);
    });
  });

  describe('calculateObjectVelocity', () => {
    it('should return positive Y velocity (downward)', () => {
      const velocity = calculateObjectVelocity(1, 100);
      expect(velocity.y).toBeGreaterThan(0);
    });

    it('should increase velocity with zone level', () => {
      const vel1 = calculateObjectVelocity(1, 100);
      const vel5 = calculateObjectVelocity(5, 100);

      expect(vel5.y).toBeGreaterThan(vel1.y);
    });

    it('should have small horizontal drift', () => {
      const velocity = calculateObjectVelocity(1, 100);
      expect(Math.abs(velocity.x)).toBeLessThanOrEqual(20);
    });
  });

  describe('generateResourceDrops', () => {
    it('should generate drops based on probability', () => {
      const lootTable: LootEntry[] = [
        { resourceId: 'stone', minAmount: 5, maxAmount: 10, probability: 1.0 },
      ];

      const drops = generateResourceDrops(lootTable);
      expect(drops).toHaveLength(1);
      expect(drops[0].type).toBe('stone');
      expect(drops[0].amount).toBeGreaterThanOrEqual(5);
      expect(drops[0].amount).toBeLessThanOrEqual(10);
    });

    it('should respect probability and skip some drops', () => {
      const lootTable: LootEntry[] = [
        { resourceId: 'stone', minAmount: 5, maxAmount: 10, probability: 0.0 },
      ];

      const drops = generateResourceDrops(lootTable);
      expect(drops).toHaveLength(0);
    });

    it('should handle multiple loot entries', () => {
      const lootTable: LootEntry[] = [
        { resourceId: 'stone', minAmount: 5, maxAmount: 10, probability: 1.0 },
        { resourceId: 'iron', minAmount: 2, maxAmount: 5, probability: 1.0 },
      ];

      const drops = generateResourceDrops(lootTable);
      expect(drops.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('generateSpawnPosition', () => {
    it('should spawn above screen (negative Y)', () => {
      const position = generateSpawnPosition(800);
      expect(position.y).toBeLessThan(0);
    });

    it('should spawn within game width with padding', () => {
      const gameWidth = 800;
      const position = generateSpawnPosition(gameWidth);
      expect(position.x).toBeGreaterThan(0);
      expect(position.x).toBeLessThan(gameWidth);
    });
  });

  describe('selectSpawnTemplate', () => {
    it('should select a template based on weights', () => {
      const spawnEntries = [
        { templateId: 'template1', weight: 100 },
        { templateId: 'template2', weight: 0 },
      ];

      const selected = selectSpawnTemplate(spawnEntries);
      expect(selected).toBe('template1');
    });

    it('should return undefined for empty spawn table', () => {
      const selected = selectSpawnTemplate([]);
      expect(selected).toBeUndefined();
    });

    it('should handle single entry', () => {
      const spawnEntries = [{ templateId: 'template1', weight: 50 }];

      const selected = selectSpawnTemplate(spawnEntries);
      expect(selected).toBe('template1');
    });
  });

  describe('createObjectFromTemplate', () => {
    const mockTemplate: ObjectTemplate = {
      id: 'test_asteroid',
      name: 'Test Asteroid',
      type: 'asteroid',
      size: 'small',
      hp: 10,
      lootTable: [{ resourceId: 'stone', minAmount: 5, maxAmount: 10, probability: 1.0 }],
      visual: { icon: '🪨', width: 40, height: 40 },
      rarity: 'common',
      description: 'A test asteroid',
    };

    it('should create a valid GameObject from template', () => {
      const position = { x: 100, y: 100 };
      const object = createObjectFromTemplate(mockTemplate, position, 1, 100);

      expect(object.id).toBeDefined();
      expect(object.type).toBe('asteroid');
      expect(object.position).toEqual(position);
      expect(object.health).toBeGreaterThan(0);
      expect(object.maxHealth).toBe(object.health);
      expect(object.size).toBe('small');
      expect(object.destroyed).toBe(false);
    });

    it('should scale HP with zone difficulty', () => {
      const position = { x: 100, y: 100 };
      const obj1 = createObjectFromTemplate(mockTemplate, position, 1, 100);
      const obj5 = createObjectFromTemplate(mockTemplate, position, 5, 100);

      expect(obj5.maxHealth).toBeGreaterThan(obj1.maxHealth);
    });

    it('should have velocity', () => {
      const position = { x: 100, y: 100 };
      const object = createObjectFromTemplate(mockTemplate, position, 1, 100);

      expect(object.velocity).toBeDefined();
      expect(object.velocity.y).toBeGreaterThan(0);
    });

    it('should generate resource drops', () => {
      const position = { x: 100, y: 100 };
      const object = createObjectFromTemplate(mockTemplate, position, 1, 100);

      expect(object.resourceDrops).toBeDefined();
      expect(object.resourceDrops.length).toBeGreaterThan(0);
    });

    it('should have rotation properties', () => {
      const position = { x: 100, y: 100 };
      const object = createObjectFromTemplate(mockTemplate, position, 1, 100);

      expect(object.rotation).toBeDefined();
      expect(object.rotationSpeed).toBeDefined();
    });
  });
});
