class Player {
    constructor({name="PlayerName", resources=[]} = {}) {
        this.id = UUIDjs.create().toString();
        this.time = 0;
        this.name = name;

        this.resources = resources;
    }
    updateTime(deltaSeconds) {
        this.time += deltaSeconds;
        return [];
    }
    /* Resources */
    earnResources(resources) {
        let player = this;
        resources.forEach(function(r) {
            player.earnResource(r);
        });
    }
    earnResource(resource) {
        if (!this.resources[resource.type]) {
            this.resources[resource.type] = 0;
        }
        this.resources[resource.type] += resource.amount;
    }
    spendResource(resource) {
        if (resource.amount > 0) {
            if (!this.resources[resource.type] || this.resources[resource.type] < resource.amount) {
                throw new InsuficientResourcesError();
            }
            this.resources[resource.type] -= resource.amount;
        }
    }
    getResourceAmountForType(type) {
        if (!this.resources[type]) {
            return this.resources[type] = 0;
        }
        return this.resources[type];
    }
}
