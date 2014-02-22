/*
Base entity class for particle entities. Subclass your own particles from
this class. See the EntityDebrisParticle in debris.js for an example.

Particle entities will kill themselfs after #lifetime# seconds. #fadetime#
seconds before the #lifetime# ends, they will start to fade out.

The velocity of a particle is randomly determined by its initial .vel 
properties. Its Animation will start at a random frame.
*/

ig.module(
	'game.entities.particle'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityParticle = ig.Entity.extend({
	size: {x: 5, y: 5},
	offset: {x: 0, y: 0},
	maxVel: {x: 160, y: 160},
	minBounceVelocity: 0,
	autoDistKill: 400,
	_wmIgmore: true,

	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.LITE,
	
	lifetime: 6,
	fadetime: 1,
	bounciness: 0.6,
	friction: {x:20, y: 0},
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
		this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
		
		this.currentAnim.flip.x = (Math.random() > 0.5);
		this.currentAnim.flip.y = (Math.random() > 0.5);
		this.currentAnim.gotoRandomFrame();
		this.idleTimer = new ig.Timer();
	},
	
	
	update: function() {
		if( this.idleTimer.delta() > this.lifetime ) {
			this.kill();
			return;
		}
		this.currentAnim.alpha = this.idleTimer.delta().map(
			this.lifetime - this.fadetime, this.lifetime,
			1, 0
		);
		this.parent();

        // Grabs player
        var player = ig.game.getEntitiesByType( EntityPlayer )[0];
        // Kills object if it is past autoDistKill
        if (this.distanceTo(player) > this.autoDistKill){
            this.kill();
        }
	}
});


});