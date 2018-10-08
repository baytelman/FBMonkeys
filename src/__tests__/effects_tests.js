import { assert } from 'chai';

import { PeriodicEffect } from '../controller/Effect.js';
import CityEvent, {
  kPeriodicEffectProgressEvent
} from '../controller/CityEvent.js';

describe('Frequency Effects', () => {
  it('require to send events', () => {
    const kTime = 2;
    const event = new PeriodicEffect({ period: kTime });
    const parents = [];
    event.updateTime(kTime / 2, parents);

    // Requires inheritance to implement `.trigger()`
    assert.throw(() => event.updateTime(kTime, parents), Error);
  });

  it('Send events when updated', () => {
    const kEventType = 'kEventType';

    class MyFrequencyEffect extends PeriodicEffect {
      trigger(parents) {
        parents.time++;
        return [
          new CityEvent({
            type: kEventType,
            object: {
              salutation: parents.salutation
            }
          })
        ];
      }
    }

    const kTime = 2;
    const event = new MyFrequencyEffect({ period: kTime });

    const salute = 'hello';
    const parents = {
      salutation: salute,
      time: 0
    };

    let eventsBeforeTrigger = event
      .updateTime(kTime / 2, parents)
      .filter(e => e.type !== kPeriodicEffectProgressEvent);
    assert.strictEqual(eventsBeforeTrigger.length, 0);
    assert.strictEqual(parents.time, 0);

    let eventsAfterTrigger = event
      .updateTime(kTime, parents)
      .filter(e => e.type !== kPeriodicEffectProgressEvent);
    assert.strictEqual(1, eventsAfterTrigger.length);
    assert.include(eventsAfterTrigger[0].toString(), kEventType);
    assert.strictEqual(salute, eventsAfterTrigger[0].object.salutation);

    assert.strictEqual(1, parents.time);

    let eventsAfterMoreTriggers = event
      .updateTime(kTime * 2, parents)
      .filter(e => e.type !== kPeriodicEffectProgressEvent);
    assert.strictEqual(2, eventsAfterMoreTriggers.length);
    assert.strictEqual(3, parents.time);
  });
});
