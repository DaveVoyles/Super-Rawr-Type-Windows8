/*********************************************************8
 * bullet.js
 * Bullet to be used by player
 * @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *********************************************************/
ig.module(
    'game.entities.bullet'
)
    .requires(
        'impact.entity'
)
    .defines(function () {
        EntityBullet = ig.Entity.extend({
            /******************************************
             * Property Definitions
             ******************************************/
            name: 'bullet',
            _wmIgnore: true,
            size: { x: 16, y: 2 },
            offset: { x: 2, y: 9 },
            animSheet: new ig.AnimationSheet('media/bullet_neon.png', 16, 16),
            maxVel: { x: 500, y: 0 },
            fireRateWeak: 0.1,
            fireRateMid: 0.1,
            fireRateMiniShip: .3,
            bloodColorOffset: 5,
            inUse: false,
            killTime: .75,
            type: ig.Entity.TYPE.C,
            checkAgainst: ig.Entity.TYPE.B,
            collides: ig.Entity.COLLIDES.PASSIVE,

            init: function (x, y, settings) {
                this.parent(x + 8, y + 8, settings);
                this.vel.x = this.accel.x = this.maxVel.x;
                this.killTimer = new ig.Timer();
                this.addAnim('active', 0.06, [3, 2, 1, 0, 1, 2]);
                this.pos.x = ig.game.player.pos.x + 8;
                this.pos.y = ig.game.player.pos.y + 2;
                this.killTimer.set(this.killTime);
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
             * Handle movement
            ******************************************/
            handleMovementTrace: function (res) {
                this.parent(res);
                if (res.collision.x || res.collision.y) {
                    ig.game.bulletGen.removeEntity(this);
                }
            },

            /******************************************
            * Update (Kills bullet after (x) time)
            ******************************************/
            update: function () {
                if (this.inUse === true) {
                    if (this.killTimer.delta() > 0) {
                        ig.game.bulletGen.removeEntity(this);
                    }
                    this.parent();
                } else {
                    return;
                }
            },

            /******************************************8
            * Checks for collision
            ******************************************/
            check: function (other) {
                other.receiveDamage(1, this);
                this.spawnParticles(1);
                ig.game.bulletGen.removeEntity(this);
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
