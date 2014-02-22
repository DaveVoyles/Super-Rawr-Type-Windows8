/*********************************************************8
 * SpinningShipGun.js & SpinningShipGun.js
 * Creates bullet patterns for enemies, along with a bullet manager 
 * Basis of this was found at: http://phoboslab.org/xtype/xtype.js
 * @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *********************************************************/

ig.module(
    'game.entities.SpinningShipBullet'
)
    .requires(
        'impact.entity'

)
    .defines(function () {
        /******************************************
        * Enemy Bullet 
        ******************************************/
        EntitySpinningShipBullet = ig.Entity.extend({
            size: { x: 16, y: 2 },
            offset: { x: 1, y: 8 },
            animSheet: new ig.AnimationSheet('media/bullet_neon.png#52f32d', 16, 16),
            maxVel: { x: 150, y: 0 },
            _wmIgnore: true,
            health: 100,
            speed: 100,
            angle: 10,
            maxSpeed: 100,
            inUse: false,
            bullets: 2,         // From gun manager
            type: ig.Entity.TYPE.C,
            checkAgainst: ig.Entity.TYPE.A,
            collides: ig.Entity.COLLIDES.PASSIVE,

            /******************************************8
            * Initialization
            ******************************************/
            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('idle', 1, [0]);
                this.shootTimer = new ig.Timer(.8);
                this.angle = this.angle;
                this.inUse = false;
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
            
            /******************************************8
             * Update
             ******************************************/
            update: function () {
                if (this.inUse === true) {

                    this.speed = Math.min(this.maxSpeed, this.speed + ig.system.tick * 100);
                    this.vel.x = Math.cos(this.angle) * this.speed;
                    this.vel.y = Math.sin(this.angle) * this.speed;

                    // Grabs player
                    var player = ig.game.getEntitiesByType(EntityPlayer)[0];

                    // Kills object if past certain bounds of screen
                    if (player.pos.x - 180 > this.pos.x || this.pos.y > ig.system.height + 100 || this.pos.x < -100 || this.pos.y < -100) {
                        ig.game.spinningShipBulletGen.removeEntity(this);
                    }
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
                        ig.game.spinningShipBulletGen.removeEntity(this);
                    }
                }
            },
            
            /******************************************8
            * Checks for collision
            ******************************************/
            check: function (other) {
                other.receiveDamage(1, this);
                this.spawnParticles(1);
                ig.game.spinningShipBulletGen.removeEntity(this);
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

