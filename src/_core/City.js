class City {
  constructor() {
    this.id = UUIDjs.create().toString();
    this.buildings = [];
    this.addBuilding();
  }

  addBuilding({ building = new Building(), location = new SquareCoordinate(0,0) } = {}) {
    building.location = location;
    this.buildings.push(building);
  }
}

class Building {
  constructor({ name = "Just a building", costs = [] } = {}) {
    this.id = UUIDjs.create().toString();
    this.name = name;
    this.costs = costs; 

    this.location = null;    
  }
}

