/**
 *  @base-actor.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 */
ig.module(
    'game.entities.base-actor'
)
    .requires(
    'impact.entity',
    'impact.sound',
    'game.entities.death-explosion'
)
    .defines(function () {

        EntityBaseActor = ig.Entity.extend({
            _wmIgnore: true,
            visible: true,
            weapon: 0,
            activeWeapon: "none",
            startPosition: null,
            invincible: false,
            invincibleDelay: 2,
            captionTimer: null,
            healthMax: 10,
            health: 10,
            fallDistance: 0,
            shotPressed: false,
            fireDelay: null,
            fireRate: 0,
            bloodColorOffset: 0,
            equipment: [],
            bKilledByScreen: false,

            /* Sound Effectss */
            hit01_sfx: new ig.Sound('media/SFX/Hit01.ogg'),
            hit01_sfx: new ig.Sound('media/SFX/Hit01.mp3'),
            hit01_sfx: new ig.Sound('media/SFX/Hit01.*'),

            EndGame_sfx: new ig.Sound('media/SFX/EndGame.ogg'),
            EndGame_sfx: new ig.Sound('media/SFX/EndGame.mp3'),
            EndGame_sfx: new ig.Sound('media/SFX/EndGame.*'),

            Explosion01_sfx: new ig.Sound('media/SFX/Explosion01.ogg'),
            Explosion01_sfx: new ig.Sound('media/SFX/Explosion01.mp3'),
            Explosion01_sfx: new ig.Sound('media/SFX/Explosion01.*'),

            GrenadeExplosion_sfx: new ig.Sound('media/SFX/GrenadeExplosion.ogg'),
            GrenadeExplosion_sfx: new ig.Sound('media/SFX/GrenadeExplosion.mp3'),
            GrenadeExplosion_sfx: new ig.Sound('media/SFX/GrenadeExplosion.*'),

            // TODO: Move this to the menu class 
            //MenuSelect_sfx: new ig.Sound('media/SFX/MenuSelect.ogg'),
            //MenuSelect_sfx: new ig.Sound('media/SFX/MenuSelect.mp3'),
            //MenuSelect_sfx: new ig.Sound('media/SFX/MenuSelect.*'),

            //PowerUp04_sfx: new ig.Sound('media/SFX/PowerUp04.ogg'),
            //PowerUp04_sfx: new ig.Sound('media/SFX/PowerUp04.mp3'),
            //PowerUp04_sfx: new ig.Sound('media/SFX/PowerUp04.*'),

            Explode01_sfx: new ig.Sound('media/SFX/Explode01.ogg'),
            Explode01_sfx: new ig.Sound('media/SFX/Explode01.mp3'),
            Explode01_sfx: new ig.Sound('media/SFX/Explode01.*'),

            Respawn_sfx: new ig.Sound('media/SFX/Respawn.ogg'),
            Respawn_sfx: new ig.Sound('media/SFX/Respawn.mp3'),
            Respawn_sfx: new ig.Sound('media/SFX/Respawn.*'),

            Hit03_sfx: new ig.Sound('media/SFX/Hit03.ogg'),
            Hit03_sfx: new ig.Sound('media/SFX/Hit03.mp3'),
            Hit03_sfx: new ig.Sound('media/SFX/Hit03.*'),

            init: function(x, y, settings) {
                this.parent(x, y, settings);
                this.spawner = settings.spawner;
                //TODO need to figure out if we should call this here?
                this.setupAnimation(settings.spriteOffset ? settings.spriteOffset : 0);
                this.startPosition = { x: x, y: y };
                this.captionTimer = new ig.Timer();
                this.fireDelay = new ig.Timer();
            },
            setupAnimation: function(offset) {
            },
            receiveDamage: function(value, from) {
                if (this.invincible || !this.visible)
                    return;

                this.parent(value, from);

                if (this.health > 0) {
                    this.spawnParticles(1);
                }
            },

            onDeathAnimation: function() {
                ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, { colorOffset: this.bloodColorOffset, callBack: this.onKill });

                //TODO need to think through this better

            },
            outOfBounds: function() {
                this.kill(true);
            },
            collideWith: function(other, axis) {

                // check for crushing damage from a moving platform (or any FIXED entity)
                if (other.collides == ig.Entity.COLLIDES.FIXED && this.touches(other)) {
                    // we're still overlapping, but by how much?
                    var overlap;
                    var size;
                    if (axis == 'y') {
                        size = this.size.y;
                        if (this.pos.y < other.pos.y) overlap = this.pos.y + this.size.y - other.pos.y;
                        else overlap = this.pos.y - (other.pos.y + other.size.y);
                    } else {
                        size = this.size.x;
                        if (this.pos.x < other.pos.x) overlap = this.pos.x + this.size.x - other.pos.x;
                        else overlap = this.pos.x - (other.pos.x + other.size.x);
                    }
                    overlap = Math.abs(overlap);

                    // overlapping by more than 1/2 of our size?
                    if (overlap > 3) {
                        // we're being crushed - this is damage per-frame, so not 100% the same at different frame rates
                        this.kill();
                    }
                }
            },
            spawnParticles: function(total) {
                for (var i = 0; i < total; i++)
                    ig.game.spawnEntity(EntityDeathExplosionParticle, this.pos.x, this.pos.y, { colorOffset: this.bloodColorOffset });
            },
            makeInvincible: function() {
                this.invincible = true;
                this.captionTimer.reset();
                //this.collides = ig.Entity.COLLIDES.NONE;
            },
            equip: function(target) {
                this.equipment.push(target);
            },
            update: function() {
                // On screen? If not, then do not update
                /* Holds ship in place for bullet testing */
                //if (this.pos.x - ig.system.width) {
                //    return;
                //}
                
                // Grabs player
                var player = ig.game.getEntitiesByType(EntityPlayer)[0];

                //TODO maybe we need to add invincible to draw or consolidate the two
                if (this.captionTimer.delta() > this.invincibleDelay) {
                    this.invincible = false;
                    if (this.currentAnim)
                        this.currentAnim.alpha = 1;

                    //Reset active collision setting
                    //this.collides = ig.Entity.COLLIDES.ACTIVE;
                }
                
                // Kills object if past certain bounds of screen
                if (player.pos.x - 200 > this.pos.x || this.pos.y > ig.system.height + 100 || this.pos.x < -100 || this.pos.y < -100) {
                    this.killedByScreen();
                    ig.game.currentEntities--;
                }

                if (this.visible)
                    this.updateAnimation();

                this.parent();
            },
            updateAnimation: function() {
                //Replace with logic to set the correct animation
            },
            draw: function() {

                // Exit draw call if the entity is not visible
                if (!this.visible)
                    return;

                //TODO do we really need this?
                if (this.currentAnim) {
                    if (!this.visible)
                        this.currentAnim.alpha = 0;
                    else
                        this.currentAnim.alpha = 1;
                }

                if (this.invincible)
                    this.currentAnim.alpha = this.captionTimer.delta() / this.invincibleDelay * .6;
                //TODO: Look into changing this time for beter alpha

                this.parent();
            },
            handleMovementTrace: function(res) {

                this.parent(res);

                //TODO need to add some kind of check to make sure we are not calling this too many times
                if ((res.collision.y) && (this.fallDistance > this.maxFallDistance)) {
                    this.onFallToDeath();
                }
            },
            onFallToDeath: function() {
                this.kill();
            },
            repel: function(direction, force) {

            },

            killedByScreen: function(){
                ig.game.removeEntity(this);
            },
            
      
            /******************************************8
            * lootDrop
            * Randomly spawns loot for player
            ******************************************/
            lootDrop: function () {

                // Rolls a random number
                var rndNum = Math.random();

                // Chance that we can drop loot
                if (rndNum > 0.7) {
                    // Roll another random to determine loot
                    var rndDropNum = Math.random();

                    if (rndDropNum < 0.5) {
                        ig.game.spawnEntity(EntityPickupMiniShip, this.pos.x, this.pos.y);
                    }
                    if (rndDropNum > 0.8) {
                        ig.game.spawnEntity(EntityPickupBulletTime, this.pos.x, this.pos.y);
                    }
                }
            },
        });

    });
