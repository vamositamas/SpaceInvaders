import {
  Position,
  Size,
  Entity,
  Player,
  Projectile,
  Enemy,
  Shield,
  createPlayer,
  createEnemy,
  createProjectile,
  createShield
} from './game-entities.model';

describe('Game Entity Models', () => {
  describe('Position interface', () => {
    it('should have x and y coordinates', () => {
      const position: Position = { x: 10, y: 20 };
      expect(position.x).toBe(10);
      expect(position.y).toBe(20);
    });
  });

  describe('Size interface', () => {
    it('should have width and height', () => {
      const size: Size = { width: 50, height: 30 };
      expect(size.width).toBe(50);
      expect(size.height).toBe(30);
    });
  });

  describe('Entity interface', () => {
    it('should have position, size, and isActive properties', () => {
      const entity: Entity = {
        position: { x: 0, y: 0 },
        size: { width: 10, height: 10 },
        isActive: true
      };
      expect(entity.position).toBeDefined();
      expect(entity.size).toBeDefined();
      expect(entity.isActive).toBe(true);
    });
  });

  describe('Player interface', () => {
    it('should extend Entity with player-specific properties', () => {
      const player: Player = {
        position: { x: 100, y: 500 },
        size: { width: 40, height: 20 },
        isActive: true,
        lives: 3,
        speed: 5,
        lastFireTime: 0
      };
      expect(player.lives).toBe(3);
      expect(player.speed).toBe(5);
      expect(player.lastFireTime).toBe(0);
    });
  });

  describe('Projectile interface', () => {
    it('should extend Entity with velocity and ownerId', () => {
      const projectile: Projectile = {
        position: { x: 50, y: 50 },
        size: { width: 4, height: 10 },
        isActive: true,
        velocity: { x: 0, y: -5 },
        ownerId: 'player'
      };
      expect(projectile.velocity).toEqual({ x: 0, y: -5 });
      expect(projectile.ownerId).toBe('player');
    });
  });

  describe('Enemy interface', () => {
    it('should extend Entity with enemy-specific properties', () => {
      const enemy: Enemy = {
        position: { x: 100, y: 100 },
        size: { width: 30, height: 20 },
        isActive: true,
        type: 'squid',
        pointValue: 30,
        row: 0,
        col: 5
      };
      expect(enemy.type).toBe('squid');
      expect(enemy.pointValue).toBe(30);
      expect(enemy.row).toBe(0);
      expect(enemy.col).toBe(5);
    });
  });

  describe('Shield interface', () => {
    it('should extend Entity with health properties', () => {
      const shield: Shield = {
        position: { x: 200, y: 450 },
        size: { width: 60, height: 40 },
        isActive: true,
        health: 100,
        maxHealth: 100
      };
      expect(shield.health).toBe(100);
      expect(shield.maxHealth).toBe(100);
    });
  });

  describe('createPlayer factory function', () => {
    it('should create a Player with correct position', () => {
      const player = createPlayer(400, 550);
      expect(player.position.x).toBe(400);
      expect(player.position.y).toBe(550);
    });

    it('should create a Player with default size', () => {
      const player = createPlayer(0, 0);
      expect(player.size.width).toBe(40);
      expect(player.size.height).toBe(20);
    });

    it('should create a Player with isActive true', () => {
      const player = createPlayer(0, 0);
      expect(player.isActive).toBe(true);
    });

    it('should create a Player with default lives of 3', () => {
      const player = createPlayer(0, 0);
      expect(player.lives).toBe(3);
    });

    it('should create a Player with default speed of 5', () => {
      const player = createPlayer(0, 0);
      expect(player.speed).toBe(5);
    });

    it('should create a Player with lastFireTime of 0', () => {
      const player = createPlayer(0, 0);
      expect(player.lastFireTime).toBe(0);
    });

    it('should allow custom speed', () => {
      const player = createPlayer(0, 0, 10);
      expect(player.speed).toBe(10);
    });

    it('should allow custom lives', () => {
      const player = createPlayer(0, 0, 5, 5);
      expect(player.lives).toBe(5);
    });
  });

  describe('createEnemy factory function', () => {
    it('should create an Enemy with correct position', () => {
      const enemy = createEnemy(100, 150, 'squid', 0, 5);
      expect(enemy.position.x).toBe(100);
      expect(enemy.position.y).toBe(150);
    });

    it('should create an Enemy with correct type', () => {
      const enemy = createEnemy(0, 0, 'crab', 1, 3);
      expect(enemy.type).toBe('crab');
    });

    it('should create an Enemy with correct row and col', () => {
      const enemy = createEnemy(0, 0, 'octopus', 2, 7);
      expect(enemy.row).toBe(2);
      expect(enemy.col).toBe(7);
    });

    it('should assign correct point value for squid type', () => {
      const enemy = createEnemy(0, 0, 'squid', 0, 0);
      expect(enemy.pointValue).toBe(30);
    });

    it('should assign correct point value for crab type', () => {
      const enemy = createEnemy(0, 0, 'crab', 0, 0);
      expect(enemy.pointValue).toBe(20);
    });

    it('should assign correct point value for octopus type', () => {
      const enemy = createEnemy(0, 0, 'octopus', 0, 0);
      expect(enemy.pointValue).toBe(10);
    });

    it('should create an Enemy with default size', () => {
      const enemy = createEnemy(0, 0, 'squid', 0, 0);
      expect(enemy.size.width).toBe(30);
      expect(enemy.size.height).toBe(20);
    });

    it('should create an Enemy with isActive true', () => {
      const enemy = createEnemy(0, 0, 'squid', 0, 0);
      expect(enemy.isActive).toBe(true);
    });
  });

  describe('createProjectile factory function', () => {
    it('should create a Projectile with correct position', () => {
      const projectile = createProjectile(200, 300, -5, 'player');
      expect(projectile.position.x).toBe(200);
      expect(projectile.position.y).toBe(300);
    });

    it('should create a Projectile with correct velocity', () => {
      const projectile = createProjectile(0, 0, -8, 'player');
      expect(projectile.velocity.x).toBe(0);
      expect(projectile.velocity.y).toBe(-8);
    });

    it('should create a Projectile with correct ownerId', () => {
      const projectile = createProjectile(0, 0, -5, 'enemy');
      expect(projectile.ownerId).toBe('enemy');
    });

    it('should create a Projectile with default size', () => {
      const projectile = createProjectile(0, 0, -5, 'player');
      expect(projectile.size.width).toBe(4);
      expect(projectile.size.height).toBe(10);
    });

    it('should create a Projectile with isActive true', () => {
      const projectile = createProjectile(0, 0, -5, 'player');
      expect(projectile.isActive).toBe(true);
    });

    it('should handle positive velocity (enemy projectile)', () => {
      const projectile = createProjectile(0, 0, 5, 'enemy');
      expect(projectile.velocity.y).toBe(5);
    });
  });

  describe('createShield factory function', () => {
    it('should create a Shield with correct position', () => {
      const shield = createShield(100, 400);
      expect(shield.position.x).toBe(100);
      expect(shield.position.y).toBe(400);
    });

    it('should create a Shield with default size', () => {
      const shield = createShield(0, 0);
      expect(shield.size.width).toBe(60);
      expect(shield.size.height).toBe(40);
    });

    it('should create a Shield with default health of 100', () => {
      const shield = createShield(0, 0);
      expect(shield.health).toBe(100);
      expect(shield.maxHealth).toBe(100);
    });

    it('should create a Shield with isActive true', () => {
      const shield = createShield(0, 0);
      expect(shield.isActive).toBe(true);
    });

    it('should allow custom health', () => {
      const shield = createShield(0, 0, 50);
      expect(shield.health).toBe(50);
      expect(shield.maxHealth).toBe(50);
    });
  });

  describe('Type checking', () => {
    it('should allow Player to be assigned to Entity', () => {
      const player: Player = createPlayer(0, 0);
      const entity: Entity = player;
      expect(entity).toBeDefined();
    });

    it('should allow Enemy to be assigned to Entity', () => {
      const enemy: Enemy = createEnemy(0, 0, 'squid', 0, 0);
      const entity: Entity = enemy;
      expect(entity).toBeDefined();
    });

    it('should allow Projectile to be assigned to Entity', () => {
      const projectile: Projectile = createProjectile(0, 0, -5, 'player');
      const entity: Entity = projectile;
      expect(entity).toBeDefined();
    });

    it('should allow Shield to be assigned to Entity', () => {
      const shield: Shield = createShield(0, 0);
      const entity: Entity = shield;
      expect(entity).toBeDefined();
    });
  });

  describe('Entity arrays', () => {
    it('should allow array of entities', () => {
      const entities: Entity[] = [
        createPlayer(0, 0),
        createEnemy(0, 0, 'squid', 0, 0),
        createProjectile(0, 0, -5, 'player'),
        createShield(0, 0)
      ];
      expect(entities.length).toBe(4);
    });

    it('should allow array of enemies', () => {
      const enemies: Enemy[] = [
        createEnemy(0, 0, 'squid', 0, 0),
        createEnemy(50, 0, 'crab', 1, 0),
        createEnemy(100, 0, 'octopus', 2, 0)
      ];
      expect(enemies.length).toBe(3);
      expect(enemies[0].pointValue).toBe(30);
      expect(enemies[1].pointValue).toBe(20);
      expect(enemies[2].pointValue).toBe(10);
    });

    it('should allow array of projectiles', () => {
      const projectiles: Projectile[] = [
        createProjectile(0, 0, -5, 'player'),
        createProjectile(50, 0, 5, 'enemy')
      ];
      expect(projectiles.length).toBe(2);
      expect(projectiles[0].velocity.y).toBe(-5);
      expect(projectiles[1].velocity.y).toBe(5);
    });

    it('should allow array of shields', () => {
      const shields: Shield[] = [
        createShield(100, 400),
        createShield(300, 400),
        createShield(500, 400)
      ];
      expect(shields.length).toBe(3);
      expect(shields[0].health).toBe(100);
    });
  });
});
