/*********************************************************8
 * EnemySpinningShip.js
 * Spinning ship which fires projectiles at player
 * @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *********************************************************/
ig.module(
	'game.entities.EnemySpinningShip'
)
.requires(
	'impact.entity',
    'game.entities.base-actor',
    'game.entities.SpinningShipBullet',    
    'game.entities.RedBullet',
    'game.entities.PickupBulletTime',
    'game.entities.PickupMiniShip'
)
.defines(function () {

    EntityEnemySpinningShip = EntityBaseActor.extend({
        /*******************************************
         * Property Definitions
         ******************************************/
        animSheet: new ig.AnimationSheet('media/Enemies/EnemySpinningShip.png', 19, 24),
        name: 'Enemy Spinning Ship',
        size: { x: 11, y: 11 },
        _wmIgnore: false,
        offset: { x: +2, y: +4 },
        maxVel: { x: 100, y: 100 },
        flip: false,
        friction: { x: 150, y: 0 },
        health: 12,
        speed: -50,
        velocity: 80,
        autoDistKill: 400,
        bloodColorOffset: 2,
        bullets: 2,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,
        shootTimer: null,
        bCanShoot: false,

        /********************************************
          Initialize
         *******************************************/
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('fly', 0.1, [0,1,2,3,4,5,6,7 ]);
            this.shootTimer = new ig.Timer(1.2);
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
            * Kamikaze02 - Stop short of player
            * Moves in SAME y direction (tracks player)
            *========================================*/
            if (this.distanceTo(player) < 300) {
                var angle = this.angleTo(ig.game.player);
                    x = Math.cos(angle);
                    y = Math.sin(angle);

                this.vel.x = x * this.speed;
                this.vel.y = y * this.speed;

                // Maintain distance from player, then begin to shoot
                if (this.distanceTo(player) < 250) {    
                    this.vel.x = player.vel.x;
                    this.vel.y = y * -this.speed * 7;
                }
            }
            
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
        * shootBullets
        ******************************************/
        shootBullets: function () {
  
            // Set X and Y values for each bullet leaving the ship    
            this.bulletx = this.pos.x + 24;
            this.bullety = this.pos.y + 44; 

            // Spawns bullets 
            ig.game.spinningShipBulletGen.useBullet(EntitySpinningShipBullet, this,
                { x: this.bulletx, y: this.bullety}, null, null);
                
            // Spawns bullets 
            ig.game.spinningShipBulletGen.useBullet(EntitySpinningShipBullet, this,
                null, null, 11);

            // Resets shoot timer after every shot
            this.shootTimer.reset();
        },

        /******************************************8
         *Check (for damage done to others)
         ******************************************/
        check: function (other) {
            other.receiveDamage(10, this);
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
