/*********************************************************8
* grenade.js
* Creates a grenade weapon
* Dave Voyles, via Jesse Freeman 2/2013
*********************************************************/
ig.module(
    'game.entities.grenade'
)
    .requires(
    'game.entities.BaseWeapon'
)
    .defines(function()
    {
         EntityGrenade = EntityBaseWeapon.extend({

        /******************************************8
        *Default Properties
        ******************************************/
        name:'grenade',
        size: {x: 4, y: 4},
        offset: {x: 2, y: 6},
        animSheet: new ig.AnimationSheet( 'media/grenade.png', 8, 8 ),
        maxVel: {x: 300, y: 100},
        fireRateWeak:.4,
        fireRateMid:.3,
        fireRateMiniShip: .7,
        type: ig.Entity.TYPE.C,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,

        /******************************************8
         * Handle Movement Trace
         ******************************************/
        init: function( x, y, settings ) {
            this.parent( x +  7, y, settings );
            this.vel.x =  this.maxVel.x;
            this.vel.y = -(50 + (Math.random()*-100));
            this.addAnim( 'idle', 0.2, [0,1] );

            // Kills entity once it has been active for (x) seconds
            this.killTimer = new ig.Timer(1.8);
        },

        /******************************************8
         * Handle Movement Trace
         ******************************************/
        handleMovementTrace: function( res ) {
            this.parent( res );
            if( res.collision.x || res.collision.y ) {
            }
        },

        /******************************************8
         * Check (deals damage)
         ******************************************/
        check: function( other ) {
            other.receiveDamage( 5, this );
            this.kill();
        },

         /******************************************8
          * Update
          ******************************************/
         update: function(killTimer){
             this.killEntity(this.killTimer);
             this.parent();
         }
    });
 });
