/*********************************************************************8
 * MiniShip.js
 * Small ships that rotate around the player for support
 * @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *********************************************************************/
ig.module(
    'game.entities.MiniShip'
)
    .requires(
        'impact.entity',
        'game.entities.bullet',
        'game.entities.particle',
        'game.entities.BaseWeapon',
        'game.entities.grenade',
        'game.entities.player'
)
    .defines(function() {
        EntityMiniShip = EntityBaseActor.extend({
            name: 'MiniShip',
            parental: null,
            font: new ig.Font('media/04b03.font.png'),
            animSheet: new ig.AnimationSheet('media/ship_sheet_flame1.png', 64, 32),
            size: { x: 16, y: 16 },
            offset: { x: +40, y: +8 },
            maxVel: { x: 30, y: 30 },
            friction: { x: 300, y: 300 },
            speed: 3,
            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.NONE, 
            collides: ig.Entity.COLLIDES.PASSIVE,
            angle: 0,
            increase: 0,
            totalWeapons: 4,
            activeWeapon: "EntityBullet",
            maxShips: 2,
            currentShips: 0,
   
            MiniShipSpawn_sfx: new ig.Sound('media/SFX/MiniShipSpawn.ogg'),
            MiniShipSpawn_sfx: new ig.Sound('media/SFX/MiniShipSpawn.mp3'),
            MiniShipSpawn_sfx: new ig.Sound('media/SFX/MiniShipSpawn.*'),

            MiniShipKill_sfx: new ig.Sound('media/SFX/MiniShipKill.ogg'),
            MiniShipKill_sfx: new ig.Sound('media/SFX/MiniShipKill.mp3'),
            MiniShipKill_sfx: new ig.Sound('media/SFX/MiniShipKill.*'),

            /******************************************8
             * Initialization
             ******************************************/
            init: function(x, y, settings) {
                this.parent(x, y, settings);
                // Add animations
                this.addAnim('idle', 1, [2]);
                this.addAnim('speedBurst', 0.3, [7, 12]);
                this.addAnim('bankLeft', 0.3, [6, 11]);
                this.addAnim('bankRight', 0.3, [9, 14]);
                this.addAnim('moveBack', 0.1, [6]);

//                this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
                this.parental = settings.player;
                this.increase = Math.PI * 2;

                // Used for constant fire
                this.lastShootTimer = new ig.Timer(0);
                EntityMiniShip.prototype.currentShips++;
                if (!ig.global.wm) { // Not in WM?
                    this.MiniShipSpawn_sfx.play();
                    this.miniShipTimer = new ig.Timer(2);
                }
            },

            /******************************************8
             * Update
             ******************************************/
            update: function(x, y, settings) {

                // Get player
                this.parental = ig.game.player;

                // Set position based on parent (player) position
                x = (this.parental.pos.x + this.parental.size.x / 2) + Math.cos(this.angle) * 50;
                y = (this.parental.pos.y + this.parental.size.y / 2) + Math.sin(this.angle) * 50;

                var idleSpeed = 120;

                this.pos.x = x;
                this.pos.y = y;
                this.angle += 0.06;

                // Shooting
                var isShooting = ig.input.state('shoot');
                if (isShooting && this.lastShootTimer.delta() > 0) {

                    switch (this.activeWeapon) {
                    case ("EntityBullet"):
                        var equipedWeap = ig.game.getEntityByName('bullet');
                        this.lastShootTimer.set(equipedWeap.fireRateMiniShip);
                        ig.game.bulletGen.useBullet(EntityBullet, this, null, +15, +10);
                        break;
                    case ("EntityGrenade"):
                        var equipedWeap = ig.game.spawnEntity(this.activeWeapon, this.pos.x + 5, this.pos.y + 6);
                        this.lastShootTimer.set(equipedWeap.fireRateMiniShip);
                        break;
                    case ("EntityExplosiveBomb"):
                        var equipedWeap = ig.game.spawnEntity(this.activeWeapon, this.pos.x + 5, this.pos.y + 5);
                        this.lastShootTimer.set(equipedWeap.fireRateMiniShip);
                        break;
                   }
            }

                /*======================================
                  set the current animation, based on the player's speed
                  =====================================*/
                //upArrow
                if (this.vel.y < 0) {
                    this.currentAnim = this.anims.bankLeft;
                    //downArrow
                } else if (this.vel.y > 20) {
                    this.currentAnim = this.anims.bankRight;
                } else if (this.vel.y = 0) {
                    this.currentAnim = this.anims.idle;
                } else if (this.vel.x > idleSpeed) {
                    //rightArrow
                    this.currentAnim = this.anims.speedBurst;
                } else if (this.vel.x > idleSpeed) {
                    //leftArrow
                    this.currentAnim = this.anims.moveBack;
                } else {
                    this.currentAnim = this.anims.idle;
                }

                /*======================================
                 Allows player to hold shoot button for constant fire
                 =====================================*/
                if (isShooting && !this.wasShooting) {
                    this.wasShooting = true;

                } else if (this.wasShooting && !isShooting) {
                    this.wasShooting = false;
                }

                /*======================================
                 Weapon inventory
                 =====================================*/
                if (ig.input.pressed('switch')) {
                    this.weapon++;
                    if (this.weapon >= this.totalWeapons)
                        this.weapon = 0;
                    switch (this.weapon) {
                    case (0):
                        this.activeWeapon = "EntityBullet";
                        break;
                    case (1):
                        this.activeWeapon = "EntityGrenade";
                        break;
                    case (2):
                        this.activeWeapon = "EntityExplosiveBomb";
                        break;
                    }
                }
            },
            
            draw: function() {
                this.drawMiniShipText();
                this.parent();
            },
            
            /******************************************
            * drawMiniShipText
            ******************************************/
            drawMiniShipText: function () {
                if (this.miniShipTimer) {
                    var d2 = -this.miniShipTimer.delta();
                    var a2 = d2 > 1.7 ? d2.map(2, 1.7, 0, 1) : (d2 < 1 ? d2 : 1);
                    var xs2 = ig.system.width / 2;
                    var ys2 = ig.system.height / 3 + (d2 < 1 ? Math.cos(1 - d2).map(1, 0, 0, 250) : 0);
                    this.font.alpha = Math.max(a2, 0);
                    this.font.draw('Mini Ship!', xs2, ys2, ig.Font.ALIGN.CENTER);
                    this.font.alpha = 1;
                    if (d2 < 0) {
                        this.miniShipTimer = null;
                    }
                }
            },


            /*******************************************
            * Checks for collision 
            ********************************************/
            check: function(other) {
                other.receiveDamage(0, this);
                this.kill();
            },
            
            /*******************************************
            * Kill
            ********************************************/
            kill: function () {
                this.MiniShipKill_sfx.play();
                EntityMiniShip.prototype.currentShips--;
                this.parent();
        }
    });
 });
