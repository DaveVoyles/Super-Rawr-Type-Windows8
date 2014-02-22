/*********************************************************************
 * BulletGenerator.js
 * Creates an array (pool) of bullets to be used by the player
 * with the intention of improved performance.
 *
 * The base of this code can be attributed to Liza Shulyayeva's object 
 * pooling tutorial: http://liza.io/a-first-try-at-object-pooling/
 * @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *********************************************************************/

ig.module(
    'game.entities.EnemyBullet02Generator'
)
    .requires(
    'impact.entity'
)
    .defines(function () {

        EntityEnemyBullet02Generator = ig.Entity.extend({
            _wmIgnore: true,
            _wmDrawBox: true,
            _wmBoxColor: 'rgba(128, 28, 230, 0.7)',
            _wmScalable: true,
            size: { x: 8, y: 8 },
            instances: [],
            activeInstances: [],
            name: 'bulletGenerator',
            maxInstances: 8,

            /********************************************************
            * useObject
            * Makes use of the object stored in the pool
            ********************************************************/
            useBullet: function (object, parent, attributes, opt_xOffset, opt_yOffSet) {

                var entity = null;
                var parentObject = null;

                if (this.instances.length > 0) {
                    // check to see if there is a spare one
                    entity = this.instances.pop();
                }

                    // Spawn new entity
                else {
                    entity = ig.game.spawnEntity(object, 0, 0);
                }

                this.activeInstances.push();
                
                // Get the parent object (the enemy the bullets will spawn from)
                var parentObject = parent;

                // Sets optional X and Y position offset from parent
                // Workaround for firing multiple projectiles for SpinningShip
                var xPos = opt_xOffset;
                var yPos = opt_yOffSet;

                // Set bullet position, based on position of parent
                entity.pos.x = parentObject.pos.x + xPos;
                entity.pos.y = parentObject.pos.y + yPos;


                // Initialize entity
            //    entity.init();
                entity.inUse = true;

                //  Set any additional attributes
                for (var propt in attributes) {
                    entity[propt] = attributes[propt];
                }
            },

            /********************************************************
            * removeEntity
            * Deactivates entity by setting inUse bool to false
            ********************************************************/
            removeEntity: function (entity) {
                entity.inUse = false;

                // find the active bullet and remove it
                // NOTE: Not using indexOf since it wont work in IE8 and below
                for (var i = 0, l = this.activeInstances.length; i < l; i++)
                    if (this.activeInstances[i] == entity)
                        array.slice(i, l);

                // return the bullet back into the pool
                this.instances.push(entity);
            },


            /********************************************************
            * clear
            * Removes all entities, used to restart a level
            ********************************************************/
            clear: function () {
                // For all bullets in the array
                for (var i = 0; i < this.instances.length; i++) {
                    // Kill them
                    this.instances[i].kill();
                }
                // Set the total number of items in array to 0
                this.instances.length = 0;
            },
        });
    });