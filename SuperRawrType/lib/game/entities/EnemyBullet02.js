/*********************************************************8
 * EnemyBullet02.js & EnemyGun01.js
 * Creates bullet patterns for enemies, along with a bullet manager 
 * Fires three red bullets at once
 * Basis of this was found at: http://phoboslab.org/xtype/xtype.js
 * @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *********************************************************/

ig.module(
    'game.entities.EnemyBullet02'
)
    .requires(
        'impact.entity'

)
    .defines(function () {
        /******************************************
        * Enemy Bullet 
        ******************************************/
        EntityEnemyBullet02 = ig.Entity.extend({
            size: { x: 16, y: 2 },
            offset: { x: 1, y: 8 },
            _wmIgnore: true,
            animSheet: new ig.AnimationSheet('media/bullet_neon.png#FF0000', 16, 16),
            maxVel: { x: 150, y: 20 },  // Adjust this to affect how far apart bullets are on Y
            health: 100,
            speed: 80,
            maxSpeed: 100,
            bloodColorOffset: 0,
            type: ig.Entity.TYPE.C,
            checkAgainst: ig.Entity.TYPE.A,
            collides: ig.Entity.COLLIDES.PASSIVE,

            /******************************************
            * Initialization
            ******************************************/
            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('idle', 1, [0]);
                this.angle = this.angle;
                this.inUse = false;
            },
            
            /******************************************
            * update
            ******************************************/
            update: function () {
                if (this.inUse === true) {

                    // Sets speed and movement        
                    this.speed = Math.min(this.maxSpeed, this.speed + ig.system.tick * 100);
                    this.vel.x = Math.cos(this.angle) * this.speed;
                    this.vel.y = Math.sin(this.angle) * this.speed;

                    // Grabs player
                    var player = ig.game.getEntitiesByType(EntityPlayer)[0];
                    // Kills object if past certain bounds of screen
                    if (player.pos.x - 150 > this.pos.x || this.pos.y > ig.system.height + 100 || this.pos.x < -100 || this.pos.y < -100) {
                        ig.game.enemyBullet02Gen.removeEntity(this);
                    }                
                    this.parent();
                } else {
                    return;
                }
            },
            
            /******************************************
            * draw
            ******************************************/
            draw: function () {
                if (this.inUse) {
                    this.parent();
                } else {
                    return;
                }
            },
            
            /******************************************
            * handleMovement
            ******************************************/
            handleMovementTrace: function (res) {
                if (this.inUse) {
                    this.parent(res);
                    if (res.collision.y || res.collision.x) {
                        ig.game.enemyBullet02Gen.removeEntity(this);
                    }
                }
            },

            /******************************************8
            * Checks for collision
            ******************************************/
            check: function (other) {
                if (this.inUse) {
                    other.receiveDamage(1, this);
                    this.spawnParticles(1);
                    ig.game.enemyBullet02Gen.removeEntity(this);
                }
            },

            /*******************************************
             * Spawns particles
             ******************************************/
            spawnParticles: function (total) {
                for (var i = 0; i < total; i++)
                    ig.game.spawnEntity(EntityDeathExplosionParticle, this.pos.x, this.pos.y, { colorOffset: this.bloodColorOffset });
            },
        });
    });
