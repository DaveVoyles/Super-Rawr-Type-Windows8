/*********************************************************8
 * RedBullet.js / BlueBullet.js
 * Bullets to be used by enemies, detects player ship for collision
 * @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *********************************************************/
ig.module(
    'game.entities.RedBullet'
)
    .requires(
    'game.entities.BaseWeapon'
)
    .defines(function()
    {
        EntityRedBullet = EntityBaseWeapon.extend({
            /******************************************8
             * Property Definitions
             ******************************************/
            name: 'RedBullet',
            _wmIgnore: true,           
            animSheet: new ig.AnimationSheet( 'media/RedBulletSheetSM.png', 16.6 ,9 ),
            maxVel: {x: -80, y: 0},
            fireRate:1,
            type:ig.Entity.TYPE.C,
            checkAgainst:ig.Entity.TYPE.A,
            collides:ig.Entity.COLLIDES.PASSIVE,

            /******************************************8
             * Init
             ******************************************/
            init: function( x, y, settings ){
               this.parent( x, y, settings );
                this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
                this.addAnim( 'active',.5, [0,1,2,1] );
                this.killTimer = new ig.Timer(2.5);
            },


            /******************************************8
             * Handle movement
             ******************************************/
            handleMovementTrace: function( res ){
                this.parent( res );
                if( res.collision.x || res.collision.y ){
                    this.kill();
                }
            },

            /******************************************8
             * Update (Kills bullet after (x) time)
             ******************************************/
            update: function(killTimer){
                this.killEntity(this.killTimer);
                this.parent();
            },

            /******************************************8
             * Checks for collision
             ******************************************/
            check: function( other ){
                other.receiveDamage( 3, this );
                this.kill();
            }
    });


                EntityBlueBullet = EntityBaseWeapon.extend({
                    /******************************************8
                     * Property Definitions
                     ******************************************/
                    name: 'BlueBullet',
                    _wmIgnore: true,
                    animSheet: new ig.AnimationSheet( 'media/BlueBulletSheetSM.png', 18 ,9 ),
                    maxVel: {x: -80, y: 0},
                    fireRate:1,
                    type:ig.Entity.TYPE.NONE,
                    checkAgainst:ig.Entity.TYPE.A,
                    collides:ig.Entity.COLLIDES.PASSIVE,

                    /******************************************8
                     * Init
                     ******************************************/
                    init: function( x, y, settings ){
                        this.parent( x, y, settings );
                        this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
                        this.addAnim( 'active',.5, [0,1,2,1] );
                        this.killTimer = new ig.Timer(2.5);
                    },


                    /******************************************8
                     * Handle movement
                     ******************************************/
                    handleMovementTrace: function( res ){
                        this.parent( res );
                        if( res.collision.x || res.collision.y ){
                            this.kill();
                        }
                    },

                    /******************************************8
                     * Update (Kills bullet after (x) time)
                     ******************************************/
                    update: function(killTimer){
                        this.killEntity(this.killTimer);
                        this.parent();
                    },

                    /******************************************8
                     * Checks for collision
                     ******************************************/
                    check: function( other ){
                        other.receiveDamage( 3, this );
                        this.kill();
                    }
                });
            });