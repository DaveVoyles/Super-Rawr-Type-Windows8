ig.module(
    'game.entities.InsertCoin'
)
    .requires(
        'impact.entity'
    )
    .defines(function() {

        EntityInsertCoin = ig.Entity.extend({
            name: 'InsertCoin',
            _wmIgnore: true,
            animSheet: new ig.AnimationSheet('media/InsertCoin.png', 60, 10),
            
            init: function (x, y, settings) {
                this.parent(x, y, settings);
                // Insert Coin Anim
                this.addAnim('FlashingInsertCoin', 1, [0]);
            }            
        });
    });