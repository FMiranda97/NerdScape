class ShopSkill extends MenuComponent {
    constructor(x, y, w, h, img, clickable, isBought, cost) {
        super(x, y, w, h, img, clickable);
        this.isBought = isBought;
        this.cost = cost;
    }

    draw(ctx) {
        // save alpha level and restore after this draw
        let alpha = ctx.globalAlpha;
        if (!this.isBought) ctx.globalAlpha = 0.2;
        super.draw(ctx);
        ctx.globalAlpha = alpha;
    }
}