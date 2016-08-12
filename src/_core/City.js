class City {
  constructor() {
    this.id = UUIDjs.create().toString();
    this.buildings = [];
    this.addBuilding();
  }

  addBuilding({ building = new Building(), location = new SquareCoordinate(0,0) } = { }) {
    building.location = location;
    this.buildings.push(building);
  }
}

class Building {
  constructor() {
    this.id = UUIDjs.create().toString();
    this.location = null;
  }
}
