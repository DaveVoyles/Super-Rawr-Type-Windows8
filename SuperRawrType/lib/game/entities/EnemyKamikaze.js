/*********************************************************
 * EnemyKamikaze.js
 * Spinning ship which fires projectiles at player (Red)
 * @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *********************************************************/
ig.module(
	'game.entities.EnemyKamikaze'
)
.requires(
	'impact.entity',
    'game.entities.base-actor',
    'game.entities.PickupBulletTime',
    'game.entities.PickupMiniShip',
    'game.entities.EnemySpinningShip'
)
.defines(function () {

    EntityEnemyKamikaze = EntityBaseActor.extend({
        /*******************************************
         * Property Definitions
         ******************************************/
        animSheet: new ig.AnimationSheet('media/Enemies/EnemySpinningShip.png#f92635', 19, 24),
        name: 'Enemy Kamikaze',
        size: { x: 11, y: 11 },
        _wmIgnore: false,
        offset: { x: +2, y: +4 },
        maxVel: { x: 100, y: 100 },
        flip: false,
        friction: { x: 150, y: 0 },
        health: 4,
        speed: -25,
        velocity: 80,
        autoDistKill: 400,
        bloodColorOffset: 0,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        /********************************************
          Initialize
         *******************************************/
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('fly', 0.1, [0, 1, 2, 3, 4, 5, 6, 7]);
        },

        /*******************************************
         * Update
         ******************************************/
        update: function () {
            this.parent();

            // Grabs player
            var player = ig.game.getEntitiesByType(EntityPlayer)[0];

            // Generic movement
            this.vel.x = this.velocity;

            /*========================================
            * Kamikaze AI
            *========================================*/
            if (this.distanceTo(player) < 200) {
                var angle = this.angleTo(ig.game.player);
                    x = Math.cos(angle);
                    y = Math.sin(angle);

                this.vel.x = x * this.speed;
                this.vel.y = y * this.speed;

                if (this.distanceTo(player) < 550) {
                    this.vel.x = -player.vel.x * 2.2;
                }
            }
        },

        /*******************************************
         *Check (for damage done to others)
         ******************************************/
        check: function (other) {
            other.receiveDamage(10, this);
            this.kill();
        },

        /******************************************8
         * receiveDamage
         ******************************************/
        receiveDamage: function (value) {
            this.parent(value);
            if (this.health > 0) {
                this.spawnParticles(1);
                this.Hit03_sfx.play();
            }
        },

        /******************************************8
        * Kill
        ******************************************/
        kill: function (){
            ig.game.stats.kills++;
            this.spawnParticles(1);
            this.Explode01_sfx.play();
            this.lootDrop();
            ig.game.currentEntities--;
            this.parent();
        },
    });
});
