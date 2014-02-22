/**********************************************************************
 * player.js
 * Player (ship) to be used within 2D sidescrolling shooter, Super Rawr-Type
 * @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *********************************************************************/
ig.module(
    'game.entities.player'
)
    .requires(
        'impact.entity',
        'game.entities.bullet',
        'game.entities.particle',
        'game.entities.BaseWeapon',
        'game.entities.grenade',
        'game.entities.base-actor',
        'game.entities.explosiveBomb',
        'plugins.timeslower',
        'bootstrap.entities.particle-emitter',
        'game.entities.EnemySpawner',
        'bootstrap.plugins.touch-joystick',
        'bootstrap.plugins.hit-area'
)
    .defines(function () {
        EntityPlayer = EntityBaseActor.extend(
        {
            /******************************************
            * Property Definitions
            ******************************************/
            animSheet: new ig.AnimationSheet('media/ship_sheet_flame1.png', 64, 32),
            statMatte: new ig.Image('media/stat-matte.png'),
            font: new ig.Font('media/04b03.font.png'),
            size: { x: 5, y: 5 },
            offset: { x: +43, y: +13 },
            maxVel: { x: 350, y: 200 },
            friction: { x: 300, y: 300 },
            speed: 200,
            bloodColorOffset: 1,
            name: 'player',
            health: 1,
            _wmScalable: true,
            _wmIgnore: false,
            bCanDrawExit: false,
           // bActivateTouchControls: false,
            
            /* Touch Controls */
            aButton: { name: "a button", label: "A", x: 0, y: 0, width: 0, height: 0 },
            bButton: { name: "b button", label: "B", x: 0, y: 0, width: 0, height: 0 },
            cButton: { name: "c button", label: "C", x: 0, y: 0, width: 0, height: 0 },
            toggleButton: { name: "toggle button", label: "Toggle", x: 0, y: 0, width: 0, height: 0 },
            joystick: null,
            bCanUpdateJoystick: false,

            /* Weapons */
            totalWeapons: 3,
            activeWeapon: "EntityBullet",
            fireDelay: null,
            bSlowTime: false,
            equiopedWeapn: null,

            /* Collision */
            type: ig.Entity.TYPE.A,
            checkAgainst: ig.Entity.TYPE.B,
            collides: ig.Entity.COLLIDES.PASSIVE,

            /* Respawning */
            invincible: true,
            invincibleTimer: null,
            invincibleDelay: 2,

            // SFX
            SlowMo01_sfx: new ig.Sound('media/SFX/SlowMo01.ogg'),
            SlowMo01_sfx: new ig.Sound('media/SFX/SlowMo01.mp3'),
            SlowMo01_sfx: new ig.Sound('media/SFX/SlowMo01.*'),

            Grenade02_sfx: new ig.Sound('media/SFX/Grenade02.ogg'),
            Grenade02_sfx: new ig.Sound('media/SFX/Grenade02.mp3'),
            Grenade02_sfx: new ig.Sound('media/SFX/Grenade02.*'),



            /******************************************
            * Initialization
            * Sets up anim sequences
            ******************************************/
            init: function(x, y, settings) {
                this.parent(x, y, settings);
                // Add animations
                this.addAnim('idle', 1, [2]);
                this.addAnim('speedBurst', 0.3, [7, 12]);
                this.addAnim('bankLeft', 0.3, [6, 11]);
                this.addAnim('bankRight', 0.3, [9, 14]);
                this.addAnim('moveBack', 0.1, [6]);

                // Used for constant fire
                this.lastShootTimer = new ig.Timer(0);
                this.livesRemainingTimer = new ig.Timer(2);

                // Resets game speed back to normal after player dies
                ig.Timer.timeScale = 1;

                // Respawning
                this.invincibleTimer = new ig.Timer();
                this.makeInvincible();
                this.respawnTimer = new ig.Timer();

                this.currentWeapLevel = 1;
                this.textures = ig.entitiesTextureAtlas;

                // Sets globally accessible player
                ig.game.player = this;

                // Not in WM?
                if (!ig.global.wm) {
                    // Attaches enemy spawner to player
                    this.EnemySpawnerInst = ig.game.spawnEntity(EntityEnemySpawner, this.pos.x + 240, null);
                    this.Respawn_sfx.play();
                }
                
                // Joystiq and touch controls
                this.joystick = new TouchJoystick();
                ig.game.clearHitAreas();
            },
            
            /******************************************
            * Update - handles input, weapons, anims
            ******************************************/
            update: function() {
                var idleSpeed = 120;
                var fastSpeed = 150;
                var backSpeed = 80;

                /*======================================
                Weapons
                ======================================*/
                var isShooting = ig.input.state('shoot');
                if (isShooting && this.lastShootTimer.delta() > 0 || this.bIsShooting == true && this.lastShootTimer.delta() > 0) {
                    switch (this.activeWeapon) {
                    case ("EntityBullet"):  
                        this.equipedWeap = ig.game.getEntityByName('bullet');
                        this.lastShootTimer.set(this.equipedWeap.fireRateWeak);
                        ig.game.bulletGen.useBullet(EntityBullet, this, null, +10, +2);
                        this.hit01_sfx.play();
                        break;
                    case ("EntityGrenade"):
                        equipedWeap = ig.game.spawnEntity(this.activeWeapon, this.pos.x + 5, this.pos.y + 6);
                        this.lastShootTimer.set(equipedWeap.fireRateWeak);
                        this.Grenade02_sfx.play();
                        break;
                    case ("EntityExplosiveBomb"):
                        var equipedWeap = ig.game.spawnEntity(this.activeWeapon, this.pos.x + 5, this.pos.y + 5);
                        this.lastShootTimer.set(equipedWeap.fireRateWeak);
                        break;
                    }
                }

                /*=====================================
                Triggers SlowMo
                =====================================*/
                
                if (ig.input.pressed('slowTime') && this.bulletTimeTimer == null || this.bSlowingTime && this.bulletTimeTimer == null) {
                    ig.game.slowTime();  
                }

                /*======================================
                Character control inputs and speeds
                =======================================*/
                if (ig.input.state('upArrow')){              
                    this.vel.y = -idleSpeed;
                    this.accel.x = this.speed;
                } else if (ig.input.state('downArrow'))  {
                    this.vel.y = idleSpeed;
                    this.accel.x = this.speed;
                }
                if (ig.input.state('leftArrow')) {
                    this.vel.x = backSpeed;
                } else if (ig.input.state('rightArrow')) {
                    this.vel.x = fastSpeed;
                } else {
                    this.vel.x = idleSpeed;
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



                // Timer for respawn 
                if (this.invincibleTimer.delta() > this.invincibleDelay) {
                    this.invincible = false;
                    this.currentAnim.alpha - 1;
                }

                // Draws text to notify player that exit is near 
                this.exit = ig.game.getEntityByName('exit');
                if (this.distanceTo(this.exit) < 400) {
                    this.bCanDrawExit = true;
                }
                

                /*======================================
                Joystick controls
                =====================================*/
                if (this.joystick) {
                    // Activates joystick if mouse click is detected & touch controls are toggled on
                    if (ig.input.pressed('click') && ig.game.bActivateTouchControls) {
                        // I use +47 to align the touch point with the center of the mouse point.
                        this.joystick.activate(ig.input.mouse.x, ig.input.mouse.y);
                    } else if (ig.input.released('click')) {
                        this.joystick.deactivate();
                    }
                    if (ig.input.mouse.x < ig.system.width / 2) {
                        // Updates joystick based on mouse location
                        this.joystick.update(ig.input.mouse.x, ig.input.mouse.y);
                        this.bCanUpdateJoystick = true;
                    }
                    else {
                        this.bCanUpdateJoystick = false;
                    }

                    // Mouse Control Logic
                    if (this.joystick.mouseDown && this.bCanUpdateJoystick) {
                        this.mouseDownPoint = this.joystick.mouseDownPoint;
                        this.currentMousePoint = this.joystick.currentMousePoint;

                        // If mouse is down and moved a certain distance, then begin to detect and perform checks
                        if (this.currentMousePoint.y < this.mouseDownPoint.y -10) {
                            // Moving Up
                            this.vel.y = -idleSpeed;
                            this.accel.x = this.speed;
                        } else if (this.currentMousePoint.y > this.mouseDownPoint.y +10) {
                            // Moving down
                            this.vel.y = idleSpeed;
                            this.accel.x = this.speed;
                        } else {
                            this.vel.x = idleSpeed;
                            this.vel.y = 0;
                        }
                        if (this.currentMousePoint.x > this.mouseDownPoint.x +10) {
                            // Moving Right
                            this.vel.x = fastSpeed;
                        } else if (this.currentMousePoint.x < this.mouseDownPoint.x -10) {
                            // Moving Left
                            this.vel.x = backSpeed;
                        } else {
                            // Idle speed
                            this.vel.x = idleSpeed;
                        }
                        this.currentMousePoint = null;
                    }
                }
                
                // Scan all hit areas and detect a key press
                var hits = ig.game.testHitAreas(ig.input.mouse.x, ig.input.mouse.y);
   
                if (ig.input.pressed('click') && ig.game.bActivateTouchControls  && this.lastShootTimer.delta() > 0) {
                    if (hits.indexOf("a button") != -1) {
                         this.bIsShooting = true;
                    }
                }

                // Switch weapons using touch controls
                if (ig.input.pressed('click') && ig.game.bActivateTouchControls)  {
                        if (hits.indexOf("b button") != -1) {
                            this.bSwitchingWeapons = !this.bSwitchWepaons;
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
                        if (hits.indexOf("c button") != -1) {
                            this.bSlowingTime = true;
                        }
                        //  When the button is released....
                        else if (ig.input.released('click')) {

                            // this.bSwitchingWeapons = false;
                            this.bSlowingTime = false;
                        }
                    }

                // Toggles touch inputs on/off
                if (ig.input.pressed('rightClick') || ig.input.pressed('click')) {
                    // Scan all hit areas and detect a key press
                    var hits = ig.game.testHitAreas(ig.input.mouse.x, ig.input.mouse.y);
                    if (!ig.ua.mobile) {
                        if (hits.indexOf("toggle button") != -1) {
                            ig.game.bActivateTouchControls = !ig.game.bActivateTouchControls;
                        }
                    }
                }

                this.parent();
            },
            
            /*******************************************
            * drawExitText
            * Draws text to notify player that exit is near 
            ******************************************/
            drawExitText: function() {
                if (this.bCanDrawExit) {
                    this.xLoc = ig.system.width / 2;
                    this.yLoc = ig.system.height / 2;
                    this.font.draw(' About to reach exit', this.xLoc, this.yLoc, ig.Font.ALIGN.CENTER);
                }
            },
            
                
            /*******************************************
            * drawUI
            * Draws text for player lives and when player 
            * approaches level exit 
            ******************************************/
            drawUI: function() {
                if (this.livesRemainingTimer) {
                    var d2 = -this.livesRemainingTimer.delta();
                    var a2 = d2 > 1.7 ? d2.map(2, 1.7, 0, 1) : (d2 < 1 ? d2 : 1);
                    var xs2 = ig.system.width / 2;
                    var ys2 = ig.system.height / 3 + (d2 < 1 ? Math.cos(1 - d2).map(1, 0, 0, 250) : 0);
                    this.font.alpha = Math.max(a2, 0);
                    if (ig.game.stats.lives > 1) {
                        this.font.draw(ig.game.stats.lives + ' Ships Remaining', xs2, ys2, ig.Font.ALIGN.CENTER);
                    } else {
                        this.font.draw(ig.game.stats.lives + ' Ship Remaining', xs2, ys2, ig.Font.ALIGN.CENTER);
                    }
                    this.font.alpha = 1;
                    if (d2 < 0) {
                        this.livesRemainingTimer = null;
                    }
                }
            },

            /*******************************************
             * drawBulletTimeText
            ******************************************/
            drawBulletTimeText: function () {
                if (this.bulletTimeTimer) {
                    var d2 = -this.bulletTimeTimer.delta();
                    var a2 = d2 > 1.7 ? d2.map(2, 1.7, 0, 1) : (d2 < 1 ? d2 : 1);
                    var xs2 = ig.system.width / 2;
                    var ys2 = ig.system.height / 3 + (d2 < 1 ? Math.cos(1 - d2).map(1, 0, 0, 250) : 0);
                    this.font.alpha = Math.max(a2, 0);
                    this.font.draw('Bullet Time!', xs2, ys2, ig.Font.ALIGN.CENTER);
                    this.font.alpha = 1;
                    if (d2 < 0) {
                        this.bulletTimeTimer = null;
                    }
                }
            },

            /*******************************************
            * Draw
            ******************************************/
            draw: function () {
                if (this.invincible) {
                    this.currentAnim.alpha = this.invincibleTimer.delta() / this.invincibleDelay * 1;
                }
                this.drawUI();
                this.drawExitText();
                this.drawBulletTimeText();
                if (ig.game.bActivateTouchControls) {
                    this.drawButtons();
                }
                if (this.joystick && ig.game.bActivateTouchControls && this.bCanUpdateJoystick) {
                    if (this.joystick.mouseDown) {
                        if (this.joystick.mouseDownPoint) {
                            // Offsets are necessary b/c I am using a smaller joystick than Jesse's Bootstrap starter kit used
                            this.textures.drawFrame("touch-point-small.png", (this.joystick.mouseDownPoint.x + 56) - this.joystick.radius, (this.joystick.mouseDownPoint.y + 58) - this.joystick.radius);
                            this.textures.drawFrame("touch-point-large.png", (this.joystick.currentMousePoint.x + 47) - this.joystick.radius, (this.joystick.currentMousePoint.y +47) - this.joystick.radius);
                        }
                    }
                }
                this.drawTouchToggle();
                this.parent();
            },
            
            /******************************************
            * drawButtons
            * Draws buttons for Win8 controls
            * Registers hit areas for inputs to detect
            ******************************************/
            drawButtons: function () {         
                this.xOffset = ig.system.width / 2;
                this.yOffset = ig.system.height / 2;
                var buttonWidth = 45,
                    buttonHeight = 41;
                
                // A button
                this.textures.drawFrame("touch-point-small-A.png", this.xOffset + 50, this.yOffset + 80);
                ig.game.registerHitArea(this.aButton.name, this.xOffset + 50, this.yOffset + 80, buttonWidth, buttonHeight);
                
                // B button
                this.textures.drawFrame("touch-point-small-B.png", this.xOffset + 100, this.yOffset + 90);
                ig.game.registerHitArea(this.bButton.name, this.xOffset + 100, this.yOffset + 90, buttonWidth, buttonHeight);
                
                // C button
                this.textures.drawFrame("touch-point-small-C.png", this.xOffset + 150, this.yOffset + 100);
                ig.game.registerHitArea(this.cButton.name, this.xOffset + 150, this.yOffset + 100, buttonWidth, buttonHeight);
            },
            
            /******************************************
            * drawTouchToggle
            * If true, Joystick and buttons are displayed
            ******************************************/
            drawTouchToggle: function() {
                this.xOffset = ig.system.width / 2;
                this.yOffset = ig.system.height / 2;
                var buttonWidth = 44,
                    buttonHeight = 23;
                
                // Button to trigger touch controls on / off
                this.textures.drawFrame("joystick-toggle.png", this.xOffset - 231, this.yOffset - 100);
                ig.game.registerHitArea(this.toggleButton.name, this.xOffset - 231, this.yOffset - 100, buttonWidth, buttonHeight);

            },

            /******************************************
            * Kills player, spawns particles, respawns
            ******************************************/
            kill: function () {
                ig.game.playerPosAtDeath = this.pos; // save the player position
                this.spawnParticles(1);
                this.parent();
                this.onDeath();
            },

            /******************************************
            * onDeath
            * Checks to see if lives has expired, and if 
            * so, calls StaffRollScreen.
            ******************************************/
            onDeath: function () {
                ig.game.stats.deaths++;
                ig.game.stats.lives--;
                if (ig.game.stats.lives < 1) {
                    // TODO: Add screen fade so that transition is not so abrupt
                    ig.game.gameOver();
                } else {
                    // OFfse Y pos by 40 due to a bug. If respawn occurs on same Y plane as death, player hits old ship, dies.
                    ig.game.spawnEntity(EntityPlayer, ig.game.playerPosAtDeath.x - 300, ig.game.playerPosAtDeath.y - 40);
                    this.livesRemainingTimer = new ig.Timer(2);
                }
            },


            /******************************************
            * makeInvincible 
            ******************************************/
            makeInvincible: function () {
                this.invincible = true;
                this.invincibleTimer.reset();
            },

            /******************************************
            * receiveDamage
            ******************************************/
            receiveDamage: function (amount, from) {
                if (this.invincible) {
                    return;
                }
                this.parent(amount, from);
            },
        });
    });