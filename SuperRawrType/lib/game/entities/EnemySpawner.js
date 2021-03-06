﻿/*********************************************************8
 * EnemySpawner.js
 * Spawns random enemy in front of the player at somewhat random intervals
 * @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *********************************************************/
ig.module(
    'game.entities.EnemySpawner'
)
    .requires(
        'impact.entity'
    )
    .defines(function () {

        EntityEnemySpawner = ig.Entity.extend({
            /******************************************8
             * Property Definitions
            ******************************************/
            _wmIgnore: false,
            visible: false,
            startPosition: null,
            invincible: true,
            _wmDrawBox: true,
            enemyArray: [20],
            spawnTimer: null,
            spawnTimerGrpA: null,
            spawnTimerGrpB: null,
            spawnTimerGrpC: null,
            _wmBoxColor: 'rgba(196, 255, 0, 0.7)',
            animSheet: new ig.AnimationSheet('media/ship_sheet_flame1.png', 64, 32),
            size: { x: 16, y: 16 },
            offset: { x: +40, y: +8 },

            /******************************************
            * init
            * Handles initialization
            ******************************************/

            init: function (x, y, settings) {

                this.parent(x, y, settings);
                // Add animations
                this.addAnim('idle', 1, [2]);

                // Spawning timers for enemy ships
                this.spawnTimerGrpA = new ig.Timer(this.randomFromTo(3, 9));
                this.spawnTimerGrpB = new ig.Timer(this.randomFromTo(3, 7));
                this.spawnTimerGrpC = new ig.Timer(this.randomFromTo(4, 9));
            },

            /******************************************
            * update
            * Handles initialization
            ******************************************/
            update: function () {
                // Get player
                this.parental = ig.game.player;
                // Set position based on parent (player) position and in middle of screen
                this.pos.x = this.parental.pos.x + 500;
                this.pos.y = ig.system.height / 2;

                // If we haven't reached our max entities cap...
                if (ig.game.currentEntities < ig.game.maxEntites) {
                    // Spawn enemies of Group A
                    if (this.spawnTimerGrpA.delta() > 0) {
                        this.spawnEnemyGrpA();
                    }

                    // Spawn enemies of Group B
                    if (this.spawnTimerGrpB.delta() > 0) {
                        this.spawnEnemyGrpB();
                    }

                    // Spawn enemies of Group C
                    if (this.spawnTimerGrpC.delta() > 0) {
                        this.spawnEnemyGrpC();
                    }
                }
            },


            /******************************************
            * randomFromTo
            * Random number generator
            * Courtesy of Liza Shulyayeva's flea project
            ******************************************/
            randomFromTo: function (from, to) {
                return Math.floor(Math.random() * (to - from + 1) + from);
            },


            /******************************************
            * spawnEnemyGrpA
            * Spawns 1 of 2 types of enemies at random intervals
            ******************************************/
            spawnEnemyGrpA: function () {
                // Resets random number
                var rndNum = null;
                // Rolls a random number
                rndNum = this.randomFromTo(1, 10);
                // Adds 1 to the total entities count
                ig.game.currentEntities++;
                
                // Spawns enemies within the Y bounds of the screen
                this.randomSpawnLocY = this.randomFromTo(ig.system.height - 20, ig.system.height / 20);

                // determines which enemy type will spawn
                if (rndNum > 5) {
                    ig.game.spawnEntity(EntityEnemyShip01, this.pos.x, this.randomSpawnLocY);
                }
                if (rndNum < 5) {
                    ig.game.spawnEntity(EntityEnemyOrb, this.pos.x, this.randomSpawnLocY);
                }
                // Resets timer
                this.spawnTimerGrpA.reset();
            },

            /******************************************
            * spawnEnemyGrpB
            * Spawns 1 of 2 types of enemies at random intervals
            ******************************************/
            spawnEnemyGrpB: function () {
                // Resets random number
                var rndNum = null;
                // Rolls a random number
                rndNum = this.randomFromTo(1, 10);
                // Adds 1 to the total entities count
                ig.game.currentEntities++;

                // Spawns enemies within the Y bounds of the screen
                this.randomSpawnLocY = this.randomFromTo(ig.system.height - 20, ig.system.height / 20);

                // determines which enemy type will spawn
                if (rndNum > 5) {
                    ig.game.spawnEntity(EntityEnemyKamikaze, this.pos.x, this.randomSpawnLocY);
                }
                if (rndNum < 5) {
                    ig.game.spawnEntity(EntityEnemyKamikazeCompanion, this.pos.x, this.randomSpawnLocY);
                }
                // Resets timer
                this.spawnTimerGrpB.reset();
            },

            /******************************************
            * spawnEnemyGrpC
            * Spawns 1 of 2 types of enemies at random intervals
            ******************************************/
            spawnEnemyGrpC: function () {
                // Resets random number
                var rndNum = null;
                // Rolls a random number
                rndNum = this.randomFromTo(1, 10);
                // Adds 1 to the total entities count
                ig.game.currentEntities++;

                // Spawns enemies within the Y bounds of the screen
                this.randomSpawnLocY = this.randomFromTo(ig.system.height - 20, ig.system.height / 20);

                // determines which enemy type will spawn
                if (rndNum < 3) {
                    ig.game.spawnEntity(EntityEnemyShip01, this.pos.x, this.randomSpawnLocY);
                }
                if (rndNum > 4) {
                    ig.game.spawnEntity(EntityEnemySpinningShip, this.pos.x, this.randomSpawnLocY);
                }
                // Resets timer
                this.spawnTimerGrpC.reset();
            }
        });
    });