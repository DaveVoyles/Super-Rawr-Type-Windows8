/*********************************************************8
 * enemyOrb.js
 * Simple, stationary ship, fires single shot blue projectiles
 * @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *********************************************************/
ig.module(
	'game.entities.enemyShip01'
)
.requires(
	'impact.entity',
    'game.entities.base-actor',
    'game.entities.EnemyBullet02',
    'game.entities.PickupBulletTime',
    'game.entities.PickupMiniShip'
)
.defines(function () {

    EntityEnemyShip01 = EntityBaseActor.extend({
        /*******************************************
         * Property Definitions
         ******************************************/
        animSheet: new ig.AnimationSheet('media/enemyOrb.png#ff9c00', 15, 15),
        size: { x: 11, y: 11 },
        _wmIgnore: false,
        name: 'enemy ship01',
        offset: { x: +2, y: +4 },
        maxVel: { x: 100, y: 100 },
        friction: { x: 150, y: 0 },
        health: 4,
        speed: -50,
        velocity: 80,
        autoDistKill: 300,
        bloodColorOffset: 4,
        bullets: 4,
        bCanShoot: false,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        /********************************************
          Initialize
         *******************************************/
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('fly', 0.1, [0, 1, 2, 3, 4, 3, 2, 1]);
            this.shootTimer = new ig.Timer(1.3);
        },

        /*******************************************
         * Update
         ******************************************/
        update: function () {
                this.parent();

                // Grabs player
                var player = ig.game.player;

                // Can fire if within X distance of player
                if (player.pos.x + 350 > this.pos.x) {
                    bCanShoot = true;
                    // When the timer expires....
                    if (this.shootTimer.delta() > 0) {
                        this.shootBullets();
                    }
                }
                // Generic movement
                this.vel.x = this.velocity;
        },

        /*******************************************
         *Check (for damage done to others)
         ******************************************/
        check: function (other) {
            other.receiveDamage(10, this);
        },

        /*******************************************
         * receiveDamage
         ******************************************/
        receiveDamage: function(value) {
            this.parent(value);
            if (this.health > 0)
                this.spawnParticles(1);
        },
        
        /*******************************************
         * Kill
         ******************************************/
        kill: function () {
            ig.game.stats.kills++;
            this.spawnParticles(1);
            this.lootDrop();
            ig.game.currentEntities--;
            this.parent();
        },
        
        /*******************************************
         * shootBullets
         * make sure inc = a2 for best results
         ******************************************/
        shootBullets: function () {

            // Distance between bullets
            var inc = 120 / (this.bullets -1);

            // The angle which the bullet leaves the weapon/enemy   
            var a2 = 120;

            for (var i = 0; i < this.bullets; i++) {
                // Leave from the front of the shop
                var angle = a2 * Math.PI / 180;

                // Spawns bullets 
                ig.game.enemyBullet02Gen.useBullet(EntityEnemyBullet02, this, { angle: angle }, null, null);

                // Increases angle of bullet with each shot fired
                a2 += inc;
            }
            // Resets shoot timer after every shot
            this.shootTimer.reset();
        },      
    });
});
