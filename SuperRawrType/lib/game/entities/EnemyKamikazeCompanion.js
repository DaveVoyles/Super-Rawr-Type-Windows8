/*********************************************************8
 * EnemyKamikazeCompanion.js
 * Ship that flies direectly at player, and spawns SpinningEnemyShips
 * above and below for support (Yellow)
 * @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *********************************************************/
ig.module(
	'game.entities.EnemyKamikazeCompanion'
)
.requires(
	'impact.entity',
    'game.entities.base-actor',
    'game.entities.PickupBulletTime',
    'game.entities.PickupMiniShip',
    'game.entities.EnemySpinningShip'
)
.defines(function () {

    EntityEnemyKamikazeCompanion = EntityBaseActor.extend({
        /******************************************8
         * Property Definitions
         ******************************************/
        animSheet: new ig.AnimationSheet('media/Enemies/EnemySpinningShip.png#f0ee32', 19, 24),
        name: 'Enemy Kamikaze Companion',
        size: { x: 11, y: 11 },
        _wmIgnore: false,
        offset: { x: +2, y: +4 },
        maxVel: { x: 100, y: 100 },
        flip: false,
        friction: { x: 150, y: 0 },
        health: 5,
        speed: -25,
        velocity: 80,
        autoDistKill: 400,
        bloodColorOffset: 4,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        /********************************************
          Initialize
         *******************************************/
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('fly', 0.1, [0, 1, 2, 3, 4, 5, 6, 7]);
            
            // Spawns Spinning ships to fight along side Kamikaze
            if (!ig.global.wm) { // Not in WM?              
                this.gun = ig.game.spawnEntity(EntityEnemySpinningShip, this.pos.x + 20, this.pos.y + 20);
                this.gun = ig.game.spawnEntity(EntityEnemySpinningShip, this.pos.x + 20, this.pos.y - 20);
            }
         },

        /******************************************8
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
            if (this.distanceTo(player) < 300) {
                var angle = this.angleTo(ig.game.player);
                var x = Math.cos(angle);
                var y = Math.sin(angle);

                // Track player's Y value
                this.vel.x = x * this.speed;
                this.vel.y = y * -this.speed * 4;

                // When close to the player, activate sudden speed burst toward player
                if (this.distanceTo(player) < 200) {
                    this.vel.x = -player.vel.x * 2;
                }               
            }
        },

        /******************************************8
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
        kill: function () {
            ig.game.stats.kills++;
            this.spawnParticles(1);
            this.Explode01_sfx.play();
            this.lootDrop();
            ig.game.currentEntities--;
            this.parent();
        },
    });
});
