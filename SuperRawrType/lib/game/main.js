/*********************************************************************8
 * main.js
 * Main game class for 2D sice scrolling shooter
 * @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *********************************************************************/
ig.module(
    'game.main'
)
    .requires(
    'impact.game',
   // 'impact.debug.debug', // Activates debug **High overhead in Win8**
    'game.levels.Space1', 
    'game.levels.Space2',
    'game.levels.Space3',
    'game.levels.Space4',
    'game.levels.test',
    'plugins.pause-focus',
    'plugins.camera',
    'impact.font',
    'game.entities.MiniShip',
    'game.entities.player',
    'game.screens.start-screen',
    'game.screens.select-screen',
    'impact.sound',
    'bootstrap.platforms.win8',
    'game.packed-textures',
    'plugins.tween-lite',
    'game.entities.BulletGenerator',
    'game.entities.EnemyBullet02Generator',
    'game.entities.EnemyBullet01Generator',
    'game.entities.SpinningShipBulletGenerator',
    'bootstrap.plugins.touch-joystick'


    )
    .defines(function () {

        MyGame = ig.Game.extend({

            /********************************************
             * Property Definitions
             *******************************************/
            instructText: new ig.Font('media/04b03.font.png'),
            lifeSprite: new ig.Image('media/ship_lifebar.png'),
            statMatte: new ig.Image('media/stat-matte.png'),
            statText: new ig.Font('media/04b03.font.png'),
            transTextBG: new ig.Image('media/transTextBG.png'),
            scanLines: new ig.Image('media/scan-lines.png'),
            stage50Music: new ig.Sound('media/Music/Stage 50.mp3', true),
            stage50Music: new ig.Sound('media/Music/Stage 50.ogg', true),
            stage50Music: new ig.Sound('media/Music/Stage 50.*', true),

            bulletTimeSprite: new ig.Image('media/BulletTimeDisplayBar1.png'),
            showStats: true,
            debugToggle: false,
            camera: null,
            joystick: null,
            bulletGen: new EntityBulletGenerator(),
            enemyBullet02Gen: new EntityEnemyBullet02Generator(),
            enemyBullet01Gen: new EntityEnemyBullet01Generator(),
            spinningShipBulletGen: new EntitySpinningShipBulletGenerator(),

            /*******************************************
             * Initialization
             ******************************************/
            init: function () {

                // Loads music, then begins to play track
                ig.music.add(this.stage50Music, 'stage50Music');
                // ig.music.next();
                ig.music.play('stage50Music');
                ig.music.loop = true;

                // Input
                ig.input.bind(ig.KEY.LEFT_ARROW, 'leftArrow');
                ig.input.bind(ig.KEY.RIGHT_ARROW, 'rightArrow');
                ig.input.bind(ig.KEY.UP_ARROW, 'upArrow');
                ig.input.bind(ig.KEY.DOWN_ARROW, 'downArrow');
                ig.input.bind(ig.KEY.C, 'shoot');
                ig.input.bind(ig.KEY.TAB, 'switch');
                ig.input.bind(ig.KEY.X, 'slowTime');
                ig.input.bind(ig.KEY.MOUSE1, "click");
                ig.input.bind(ig.KEY.MOUSE2, "rightClick");

                // Camera
                this.camera = new Camera(ig.system.width / 4, ig.system.height, 1);
                this.camera.trap.size.x = ig.system.width / 10;
                this.camera.trap.size.y = ig.system.height / 10;
                this.camera.lookAhead.x = ig.ua.mobile ? ig.system.width / 6 : ig.system.width / 4;
                
                // screen bounds Y
                this.screenBoundsY = ig.system.height / 20;

                // Loading
                this.loadLevel(LevelSpace2);
                
                // Joystick
                this.joystick = new TouchJoystick();
                },

            /*******************************************
             * Load Level
             ******************************************/
            loadLevel: function (data) {
                this.parent(data);

                // Gets player
                this.player = this.getEntitiesByType(EntityPlayer)[0];

                // Set camera max and reposition trap to stay within bounds of collision
                this.camera.max.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
                this.camera.max.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;
                this.camera.set(this.player );

                // Creates bullets for player pool   
                for (var i = 0; i < ig.game.bulletGen.maxInstances; i++) {
                    ig.game.bulletGen.instances.push(this.spawnEntity(EntityBullet, 0, 0, { inUse: false }));
                }

                // Creates bullets for enemyBulletGen01 
                for (var i = 0; i < ig.game.enemyBullet01Gen.maxInstances; i++) {
                    ig.game.enemyBullet01Gen.instances.push(this.spawnEntity(EntityEnemyBullet01, 0, 0, { inUse: false }));
                }

                // Creates bullets for enemyBulletGen02
                for (var i = 0; i < ig.game.enemyBullet02Gen.maxInstances; i++) {
                    ig.game.enemyBullet02Gen.instances.push(this.spawnEntity(EntityEnemyBullet02, 0, 0, { inUse: false }));
                }

                // Creates bullets for spinning ship 
                for (var i = 0; i < ig.game.spinningShipBulletGen.maxInstances; i++) {
                    ig.game.spinningShipBulletGen.instances.push(this.spawnEntity(EntitySpinningShipBullet, 0, 0, { inUse: false }));
                }
            },

            /******************************************8
             * Update
             ******************************************/
            update: function () {
                // Update all entities and BackgroundMaps
                this.parent();

                // Keeps player without bounds of screen 
                if (this.player.pos.y < 0) {
                    this.player.pos.y = 0;
                } else if (this.player.pos.y > ig.system.height - 16) {
                    this.player.pos.y = ig.system.height - 16;
                }

                // Camera tracks player
                this.camera.follow(this.player);
                
                // Holds the camera in place when the end of the level is reached
                this.exit = ig.game.getEntityByName('exit');
                if (this.player.distanceTo(this.exit) < 350) {
                    this.camera.trap.size.x = ig.system.width / 1.3;
                }
            },
            
            /******************************************
            * gameOver 
            * Called by player when lived = 0
            ******************************************/
            gameOver: function () {
                ig.finalStats = ig.game.stats;
                ig.system.setGame(StaffRollScreen);
                // Clears object pools for all bullet classes
                this.bulletGen.clear();
                this.enemyBullet01Gen.clear();
                this.enemyBullet02Gen.clear();
                this.spinningShipBulletGen.clear();
                ig.game.currentEntities = 0;
                // Resets bullet time value to 2
                EntityPickupBulletTime.prototype.currentBulletTime = 2;
            },

            /*******************************************
             * Draw
             ******************************************/
            draw: function () {
                // Draw all entities and backgroundMaps
                this.parent();

                // Draws transparent background behind text
                this.transTextBG.draw(0, 0);

                // Draws lifebar
                this.statText.draw("Lives", 5, 5);
                for (var i = 0; i < this.stats.lives; i++)
                    this.lifeSprite.draw(((this.lifeSprite.width + 2) * i) + 5, 15);

                // Draws bullet time bar
                this.statText.draw("Bullet Time", 5, 32);
                for (var i = 0; i < EntityPickupBulletTime.prototype.currentBulletTime; i++)
                    this.bulletTimeSprite.draw(((this.bulletTimeSprite.width + 2) * i) + 5, 40);

                // Draws scanlines for retro effect
                this.scanLines.draw(0, 0);

                // Draws debug camera
                this.camera.draw();
            },
        });


        /*******************************************
        * Instructions Screen
        *******************************************/
        InstructionsScreen = ig.Game.extend({
            backgroundInstructions: new ig.Image('media/Screens/bgInstructionsScreen.png'),
            instructText: new ig.Font('media/04b03.font.png'),

            
            init: function () {
                ig.input.bind(ig.KEY.SPACE, 'start');
                ig.input.bind(ig.KEY.ENTER, 'start');
            },

            /*******************************************
            * Update
            *******************************************/
            update: function () {
                if (ig.input.pressed('start') || ig.input.pressed('click')) {
                    ig.system.setGame(MyGame);
                }
                this.parent();
            },

            /*******************************************
            * Draw
            *******************************************/
            draw: function () {
                this.parent();
                ig.music.play('StaffRoll');
                this.backgroundInstructions.draw(0, 0);
                var x = ig.system.width / 2;
                    y = ig.system.height / 2;
                this.instructText.draw('Press SpaceBar, Enter, or touch to continue', x, y - 100, ig.Font.ALIGN.CENTER);
            }
        });
            
        /******************************************8
        * CREDITS SCREEN
        *******************************************/
        StaffRollScreen = ig.Game.extend({
            instructText: new ig.Font('media/04b03.font.png'),
            background: new ig.Image('media/Screens/StaffRoll.png'),
            staffRollMusic: new ig.Sound('media/Music/Staff Roll 1.mp3'),
            staffRollMusic: new ig.Sound('media/Music/Staff Roll 1.ogg'),
            staffRollMusic: new ig.Sound('media/Music/Staff Roll 1.*'),

            init: function () {
                // Loads music, then begins to play track
                ig.music.add(this.staffRollMusic, 'staffRollMusic');
                ig.music.play('staffRollMusic');
                
                ig.input.bind(ig.KEY.SPACE, 'start');
                ig.input.bind(ig.KEY.ENTER, 'start');
            },

            /******************************************8
            * Update
            *******************************************/
            update: function () {
                if (ig.input.pressed('start') || ig.input.pressed('click')) {
                    ig.system.setGame(StartScreen);
                }
                this.parent();
            },

            /******************************************8
            * Draw
            *******************************************/
            draw: function () {
                this.parent();
                ig.music.play('StaffRoll');
                this.background.draw(0, 0);
                var x = ig.system.width / 2,
                    y = ig.system.height / 2;
                this.instructText.draw('Thanks for playing!', x, y, ig.Font.ALIGN.CENTER);
                this.instructText.draw('Press SpaceBar or Enter to continue', x, y + 40, ig.Font.ALIGN.CENTER);
                this.instructText.draw('All music property of YouTube user Kevvviiinnn', x, y - 80, ig.Font.ALIGN.CENTER);
                this.instructText.draw('Developer: Dave Voyles - @DaveVoyles | www.DavidVoyles.Wordpress.com', x, y - 70, ig.Font.ALIGN.CENTER);
            }
        });


        /*******************************************
        * Default Setting
        *******************************************/

        ig.startNewGame = function (width, height) {
              if (ig.ua.mobile) {
            //Disable sound for all mobile devices
            ig.Sound.enabled = false;
              }

            ig.main('#canvas', StartScreen, 60, 480, 320, 1);

            if (window.resizeGame)
                window.resizeGame();
        };

        if (typeof (WinJS) == 'undefined') {
            ig.startNewGame(480, 320);
        }

        ig.System.inject({
            setGameNow: function (gameClass, startLevel) {
                ig.game = new (gameClass)(startLevel);
                ig.system.setDelegate(ig.game);
            },
        });
    });