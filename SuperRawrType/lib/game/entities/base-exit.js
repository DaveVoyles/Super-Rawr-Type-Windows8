/**
 *  @base-exit.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 *  This entity is useful for exiting a level
 */

ig.module(
    'game.entities.base-exit'
)
    .requires(
    'impact.entity',
    'impact.game'
)
    .defines(function () {

        EntityBaseExit = ig.Entity.extend({
            size: { x: 16, y: 16 },
            _wmScalable: true,
            _wmDrawBox: true,
            _wmBoxColor: 'rgba(196, 0, 255, 0.7)',
            name: 'exit',
            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.A,
            collides: ig.Entity.COLLIDES.NEVER,
            check: function (other) {
                if (other instanceof EntityPlayer) {           
                    ig.game.exitLevel();
                }
            },
        });

        ig.Game.inject({
            exitLevel: function () {
            //    this.loadLevel(StartScreen);
                ig.system.setGame(StaffRollScreen);
            }
        });
    });