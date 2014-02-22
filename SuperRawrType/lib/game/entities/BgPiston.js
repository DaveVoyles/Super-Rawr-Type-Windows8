/********************************************************8
 * BgPiston.js
 * Animated background object. Does not interact with actors.
 * @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *********************************************************/
    
ig.module(
    'game.entities.BgPiston'
)
    .requires(
        'impact.entity',
        'impact.sound',
        'game.entities.death-explosion'
    )
    .defines(function() {

        EntityBgPiston = ig.Entity.extend({
            animSheet: new ig.AnimationSheet('media/BgObj/Piston.png', 24, 56),
            _wmIgnore: false,
            maxVel: { x: 100, y: 100 },
            flip: false,
            friction: { x: 150, y: 0 },
            health: 5000,
            speed: -200,
            autoDistKill: 400,
            bloodColorOffset: 4,
            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.NONE,
            collides: ig.Entity.COLLIDES.PASSIVE,
            
            /********************************************
              Initialize
             *******************************************/
            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('idle', 0.2, [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1,]);
            },
            
            /******************************************8
             * Update
             ******************************************/
            update: function () {

                this.parent();

                // Grabs player
                var player = ig.game.getEntitiesByType(EntityPlayer)[0];

                // Kills object if past certain bounds of screen
                if (player.pos.x - 600 > this.pos.x || this.pos.y > ig.system.height + 100 || this.pos.x < -100 || this.pos.y < -100) {
                    this.kill();
                }
            },           
            
        });
    });