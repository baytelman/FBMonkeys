import {assert} from 'chai'
import {CityPlayer, CapacityGrantingEffect} from '../lib/city/CityPlayer';
import {CityResource, ResourceEffect} from '../lib/city/CityResource';
import CityResearchProject, {ScheduleResearchProjectAction} from '../lib/city/CityResearchProject';
import CityBuilding from '../lib/city/CityBuilding';

const kTestResourceType = "ResourceType";
const createResource = (amount) => new CityResource(kTestResourceType, amount);

let amount = 100;
let resources = [createResource(amount)];

let researchTime = 200;
let playerCapacity = {
  initialCapacity: {
    [kTestResourceType]: amount
  }
};

let projectConfig = {
  namespace: 'kResearchNamespace',
  name: 'Test Research',
  time: researchTime,
  cost: [createResource(amount)]
};

describe('Research Projects', () => {
  it('Have availability and cost', () => {
    let player = new CityPlayer(playerCapacity);
    let project = new CityResearchProject(projectConfig);
    let action = new ScheduleResearchProjectAction({project: project});

    // InsuficientResourcesError);
    assert.isFalse(action.isAffordable(player));
    assert.throw(() => action.executeForPlayer(player));

    player.earnResources(resources);
    assert.isTrue(action.isAffordable(player));
    action.executeForPlayer(player);

    assert.strictEqual(player.researchProjects.length, 1);
    assert.strictEqual(player.researchProjects[0].namespace, project.namespace);
    assert.strictEqual(player.getResourceAmountForType(kTestResourceType), 0);
  });

  it('Are researched in order', () => {
    let player = new CityPlayer(playerCapacity);
    let config1 = Object.assign({}, projectConfig);
    let config2 = Object.assign({}, projectConfig);
    config1.namespace = 'p1'
    config2.namespace = 'p2'
    config1.cost = config2.cost = [];

    let project1 = new CityResearchProject(config1);
    let action1 = new ScheduleResearchProjectAction({project: project1});
    let project2 = new CityResearchProject(config2);
    let action2 = new ScheduleResearchProjectAction({project: project2});

    action1.executeForPlayer(player);
    action2.executeForPlayer(player);

    assert.strictEqual(player.researchProjects.length, 2);
    assert.strictEqual(player.researchProjects[0].namespace, project1.namespace);
    assert.strictEqual(player.researchProjects[1].namespace, project2.namespace);

    assert.strictEqual(player.researchProjects[0].progress(), 0);
    assert.strictEqual(player.researchProjects[1].progress(), 0);

    player.earnResearch(researchTime / 4.0);
    assert.strictEqual(player.researchProjects.length, 2);
    assert.strictEqual(player.researchProjects[0].namespace, project1.namespace);
    assert.strictEqual(player.researchProjects[1].namespace, project2.namespace);
    assert.strictEqual(player.researchProjects[0].progress(), (researchTime - researchTime * 3.0 / 4.0) / researchTime);
    assert.strictEqual(player.researchProjects[1].progress(), 0);

    player.earnResearch(researchTime);
    assert.strictEqual(player.researchProjects.length, 1);
    assert.strictEqual(player.researchProjects[0].namespace, project2.namespace);
    assert.strictEqual(player.researchProjects[0].progress(), (researchTime - researchTime * 3.0 / 4.0) / researchTime);
  });

  it('Can be completed', () => {
    let player = new CityPlayer(playerCapacity);
    let config = Object.assign({}, projectConfig);
    config.cost = [];
    let project = new CityResearchProject(config);
    let action = new ScheduleResearchProjectAction({project: project});

    action.executeForPlayer(player);

    assert.strictEqual(player.researchedProjects.length, 0);

    player.earnResearch(researchTime);
    assert.strictEqual(player.researchedProjects.length, 1);
    assert.strictEqual(player.researchedProjects[0].namespace, project.namespace);
  });

  it('Have permanent effects', () => {
    let player = new CityPlayer(playerCapacity);
    let effect = new CapacityGrantingEffect({
      additions: {
        [kTestResourceType]: amount
      }
    });
    let config = Object.assign({}, projectConfig);
    config.cost = [];
    config.permanentEffects = [effect];
    let project = new CityResearchProject(config);
    let action = new ScheduleResearchProjectAction({project: project});

    action.executeForPlayer(player);
    assert.strictEqual(player.getCapacity()[kTestResourceType], amount);

    player.earnResearch(researchTime);
    assert.strictEqual(player.getCapacity()[kTestResourceType], 2 * amount);
  });

  it('Have dependencies', () => {
    let player = new CityPlayer(playerCapacity);
    let effect = new CapacityGrantingEffect({
      additions: {
        [kTestResourceType]: amount
      }
    });
    let building = new CityBuilding();

    let config1 = Object.assign({}, projectConfig);
    config1.namespace += '1';
    config1.cost = [];
    config1.requirements = [building.namespace];

    let config2 = Object.assign({}, projectConfig);
    config2.namespace += '2';
    config2.cost = [];
    config2.requirements = [config1.namespace];

    let project1 = new CityResearchProject(config1);
    let project2 = new CityResearchProject(config2);
    
    let action1 = new ScheduleResearchProjectAction({project: project1});
    let action2 = new ScheduleResearchProjectAction({project: project2});
    
    assert.isFalse(action1.isAvailable(player));
    assert.isFalse(action2.isAvailable(player));
    
    assert.throw(() => action1.executeForPlayer(player));
    assert.throw(() => action2.executeForPlayer(player));
    
		player.city.planBuilding({
			building: building
    });
    player.updateTime(1);

    assert.isTrue(action1.isAvailable(player));
    assert.isFalse(action2.isAvailable(player));
    
    action1.executeForPlayer(player);
    assert.throw(() => action2.executeForPlayer(player));

    player.earnResearch(researchTime);
    player.updateTime(1);
    
    assert.isTrue(action2.isAvailable(player));
  });
});
