/*********************************************************8
 * grenade.js
 * Creates a grenade weapon
 * Dave Voyles, via Jesse Freeman 2/2013
 *********************************************************/
ig.module(
    'game.entities.explosiveBomb'
)
    .requires(
    'game.entities.BaseWeapon'
)
    .defines(function()
    {
        EntityExplosiveBomb = EntityBaseWeapon.extend({

            /******************************************8
             *Default Properties
             ******************************************/
            name: 'ExplosiveBomb',
            size: {x: 4, y: 4},
            offset: {x: 2, y: 6},
            animSheet: new ig.AnimationSheet( 'media/grenade.png', 8, 8 ),
            maxVel: {x: 300, y: 100},
            fireRateWeak:.6,
            fireRateMid:.9,
            fireRateMiniShip: 1,
            bloodColorOffset:3,
            blastRadius: 35,
            killTimer: 3.5,
            damage: 16,
            type: ig.Entity.TYPE.C,
            checkAgainst: ig.Entity.TYPE.B,
            collides: ig.Entity.COLLIDES.PASSIVE,
            
            GrenadeExplosion_sfx: new ig.Sound('media/SFX/GrenadeExplosion.ogg'),
            GrenadeExplosion_sfx: new ig.Sound('media/SFX/GrenadeExplosion.mp3'),
            GrenadeExplosion_sfx: new ig.Sound('media/SFX/GrenadeExplosion.*'),


            /******************************************8
             * Handle Movement Trace
             ******************************************/
            init: function( x, y, settings ) {
                this.parent( x + 7, y, settings );
                this.vel.x =  this.maxVel.x;

                // Randomly throws the explosive on the Y plane   
                this.vel.y = -(50 + (Math.random() * -100));
                this.addAnim( 'idle', 0.2, [0,1] );

                // Timer for grenade detonation, w/ small random applied
                this.detonationTimer = new ig.Timer(Math.random(1.2) *3);
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
                other.receiveDamage( this.damage, this );
                this.kill();
            },

            /******************************************8
             * Kill (Checks for blast radius to do dmg)
             ******************************************/
            kill:function ()
            {
                var entity;
                var entities = ig.game.entities;
                for (var i = 0; i < entities.length; i++)
                {
                    entity = entities[i];
                    if (entity.type == ig.Entity.TYPE.B)
                    {
                        var distance = this.distanceTo(entity);
                        if (distance < this.blastRadius)
                            entity.receiveDamage(this.blastRadius - distance, this);
                    }
                }
                for (var i = 0; i < 3; i++)
                this.spawnParticles(1);
                this.parent();
            },

            /******************************************8
             * Update
             ******************************************/
            update: function(killTimer){
                this.detonate();
                this.parent();
            },

            /******************************************8
             * Blows up bomb after (X) seconds
             ******************************************/
            detonate: function(){
                 if (this.detonationTimer.delta() >  0)
                 {
                     this.GrenadeExplosion_sfx.play();
                     this.kill();
                 }
            }
        });
    });
