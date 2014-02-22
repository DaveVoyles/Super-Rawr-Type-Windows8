/*********************************************************8
 * BaseWeapon.js
 * Base weapon class. All weapons should extend from this.
 * @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *********************************************************/
ig.module(
    'game.entities.BaseWeapon'
)
    .requires(
        'impact.entity',
        'game.entities.death-explosion',
        'impact.sound'
)
    .defines(function (){
           EntityBaseWeapon = ig.Entity.extend({
           /******************************************8
            * Property Definitions
            ******************************************/
            name:'baseWeapon',
            _wmIgnore:true,
            size: {x: 12, y: 4},    // Works for enemy bullets
            offset: {x: +4, y: +3}, // Works for enemy bullets
            recoil:1,
            WeapLevel:1,
            maxWeapLevels:3,
            blastRadius:0,
            killTimer: null,
            autoDistKill: 500,
            type:ig.Entity.TYPE.NONE,
            checkAgainst:ig.Entity.TYPE.B,
            collides: ig.Entity.COLLIDES.PASSIVE,
            


            /******************************************8
             * Handle movement
             ******************************************/
            handleMovementTrace:function (res) {
                this.parent(res);
                if (res.collision.x || res.collision.y) {
                    //   this.kill();
                }
            },

            /******************************************8
             * Handle movement
             ******************************************/
            update: function(){
               this.parent();

               // Grabs player
               var player = ig.game.getEntitiesByType(EntityPlayer)[0];
                
               // Kills object if it is past autoDistKill
               if (this.distanceTo(player) > this.autoDistKill){
             //      this.kill();
               }             
            },

            /*******************************************
             * Checks for collision
             ******************************************/
            check:function (other) {
                other.receiveDamage(1, this);
                //this.kill();
            },

            /*******************************************
             * Spawns particles
             ******************************************/
            spawnParticles:function (total){
                for (var i = 0; i < total; i++)
                    ig.game.spawnEntity(EntityDeathExplosionParticle, this.pos.x, this.pos.y, {colorOffset:this.bloodColorOffset});
            },

            /*******************************************
             * kills entity after (X) seconds
             ******************************************/
            killEntity: function(killTimer){
                if (killTimer.delta() > 0) {
                 //   this.kill();
                }
            }
    });
});
