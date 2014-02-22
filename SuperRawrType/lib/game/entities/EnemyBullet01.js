/*********************************************************8
 * EnemyBullet01.js & EnemyGun01.js
 * Creates bullet patterns for enemies, along with a bullet manager 
 * Basis of this was found at: http://phoboslab.org/xtype/xtype.js
 * @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *********************************************************/

ig.module(
    'game.entities.EnemyBullet01'
)
    .requires(
        'impact.entity'

)
    .defines(function () {
        /******************************************
        * Enemy Bullet 
        ******************************************/
        EntityEnemyBullet01 = ig.Entity.extend({
            size: { x: 16, y: 2 },
            offset: { x: 1, y: 8 },
            animSheet: new ig.AnimationSheet('media/bullet_neon.png', 16, 16),
            maxVel: { x: 100, y: 70 }, // Adjust this to affect how far apart bullets are on Y
            _wmIgnore: true,
            health: 100,
            speed: 10,
            angle: 60,
            maxSpeed: 80,
            name: 'enemy bullet',
            bloodColorOffset: 1,
            inUse: false,
            killTime: .5,
            type: ig.Entity.TYPE.C,
            checkAgainst: ig.Entity.TYPE.A,
            collides: ig.Entity.COLLIDES.PASSIVE,

        /******************************************8
        * Initialization
        ******************************************/
            init: function(x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('active', 0.06, [3, 2, 1, 0, 1, 2]);
                this.angle = this.angle;
                this.killTimer = new ig.Timer(null);
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
        * update
        ******************************************/
        update: function () {
            if (this.inUse === true) {

                this.speed = Math.min(this.maxSpeed, this.speed + ig.system.tick * 100);
                this.vel.x = Math.cos(this.angle) * this.speed;
                this.vel.y = Math.sin(this.angle) * this.speed;
                
                if (this.killTimer.delta > 0) {
                    ig.game.enemyBullet01Gen.removeEntity(this);
                }            

                // Grabs player
                var player = ig.game.player;
                // Kills object if past certain bounds of screen
                if (player.pos.x - 120 > this.pos.x || this.pos.y > ig.system.height + 100 || this.pos.y < -320) {
                    ig.game.enemyBullet01Gen.removeEntity(this);
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
                    ig.game.enemyBullet01Gen.removeEntity(this);
                }
            }
        },
            
        /******************************************
        * Checks for collision
        ******************************************/
        check: function(other) {
                other.receiveDamage(1, this);
                this.spawnParticles(1);
                ig.game.enemyBullet01Gen.removeEntity(this);
        },
        
            /*******************************************
             * Spawns particles
             ******************************************/
            spawnParticles:function (total){
                for (var i = 0; i < total; i++)
                    ig.game.spawnEntity(EntityDeathExplosionParticle, this.pos.x, this.pos.y, {colorOffset:this.bloodColorOffset});
            },
     });
});

