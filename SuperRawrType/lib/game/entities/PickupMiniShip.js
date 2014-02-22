/*********************************************************8
 * PickupMiniShip.js
 * Floating pickup, spawns MiniShip
 * @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *********************************************************/
ig.module(
    'game.entities.PickupMiniShip'
)
    .requires(
        'impact.entity',
        'impact.sound',
        'game.entities.player',
        'game.entities.death-explosion'
    )
    .defines(function() {

        EntityPickupMiniShip = ig.Entity.extend({
            /********************************************
            * Property Definitions
            ******************************************/
            animSheet: new ig.AnimationSheet('media/PickupMiniShip01.png', 18, 17),
            name: ' Pickup MiniShip',
            size: { x: 17, y: 17 },
            _wmIgnore: true,
            maxVel: { x: 100, y: 100 },
            friction: { x: 150, y: 0 },
            health: 100000,
            speed: -75,
            autoDistKill: 300,
            type: ig.Entity.TYPE.C,
            checkAgainst: ig.Entity.TYPE.A,
            collides: ig.Entity.COLLIDES.PASSIVE,
                
            /******************************************8
            * Initialization
            * Sets up anim sequences
            ******************************************/
            init: function (x, y, settings) {
                    
                this.parent(x, y, settings);
                // Add animations
                this.addAnim('idle', .1, [0, 1, 2, 1]);

            },
                
            /******************************************8
            * Update
            ******************************************/
            update: function () {
                this.parent();

                // Grabs player
                this.player = ig.game.getEntitiesByType(EntityPlayer)[0];

                // Kills object if past certain bounds of screen
                if (this.player.pos.x - 600 > this.pos.x || this.pos.y > ig.system.height + 100 || this.pos.x < -100 || this.pos.y < -100) {
                    this.kill();
                }
            },

            /******************************************8
            *Checks for collision with player
            ******************************************/
            check: function (other) {
                other.receiveDamage(0, this);
                if (EntityMiniShip.prototype.currentShips < EntityMiniShip.prototype.maxShips) {
                    ig.game.spawnEntity(EntityMiniShip, this.player.pos.x + 6, this.player.y - 9);
                }
                this.kill();
            },               
             
        });
    });