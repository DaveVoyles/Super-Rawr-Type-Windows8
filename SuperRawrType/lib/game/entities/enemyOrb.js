/*********************************************************8
 * enemyOrb.js
 * Simple, stationary green orb that fires 3 red bullets at a time
 * @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *********************************************************/
ig.module(
	'game.entities.enemyOrb'
)
.requires(
	'impact.entity',
    'game.entities.base-actor',
    'game.entities.RedBullet',
    'game.entities.EnemyBullet01',
    'game.entities.PickupBulletTime',
    'game.entities.PickupMiniShip'
)
.defines(function(){

    EntityEnemyOrb = EntityBaseActor.extend({
        /******************************************8
         * Property Definitions
         ******************************************/
        animSheet: new ig.AnimationSheet('media/EnemyOrb.png', 15, 15),
        name: 'Enemy Orb',
        size: {x: 11, y:11},
        _wmIgnore: false,
        offset: {x: +2, y: +4},
        maxVel: {x: 100, y: 500},
        flip: false,
        friction: {x: 150, y: 200},
        health: 6,
        speed: 500,
        autoDistKill: 400,
        bloodColorOffset: 1,
        bullets: 3,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,
        bKilledByScreen: false,
        bIsAlive: true,
        bCanShoot: false,

        /********************************************
        * Initialize
         *******************************************/
        init: function( x, y, settings ) {
    	    this.parent( x, y, settings );
    	    this.addAnim('fly', 0.1, [0,1,2,3,4,3,2,1]);
    	    this.shootTimer = new ig.Timer(1.4);
         },

        /*******************************************
         * Update
         ******************************************/
        update: function() {
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
        },

        /*******************************************
         *Check (for damage done to others)
         ******************************************/
        check: function( other ) {
    	    other.receiveDamage( 10, this );
        },

        /*******************************************
         * receiveDamage
         ******************************************/
        receiveDamage: function(value){
            this.parent(value);
            if (this.health > 0) {
                this.spawnParticles(1);
                this.Hit03_sfx.play();
            }
        },
        
        /*******************************************
         * shootBullets
         * make sure inc = a2 for best results
         ******************************************/
        shootBullets: function() {

            // Distance between bullets
            var inc = 160    / (this.bullets + 5 );

            // The angle which the bullet leaves the weapon/enemy
            var a2 = 160;
 
            for (var i = 0; i < this.bullets; i++) {
                // Leave from the front of the shop
                var angle = a2 * Math.PI / 180;
                
                // Spawns bullets 
                ig.game.enemyBullet01Gen.useBullet(EntityEnemyBullet01, this, {angle: angle}, null, null);

                // Increases angle of bullet with each shot fired
                a2 += inc;
            }
            // Resets shoot timer after every shot
            this.shootTimer.reset();
        },
        
        /******************************************
         * Kill
         ******************************************/
        kill: function () {
            ig.game.stats.kills++;
            this.spawnParticles(1);
            this.Explode01_sfx.play();
            this.lootDrop();
            this.bIsAlive = false;
            ig.game.currentEntities--;
            this.parent();
        }       
    });
});
