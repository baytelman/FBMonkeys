import {assert} from 'chai'

import {FrequencyEffect} from '../lib/city/Effect.js';
import CityEvent from '../lib/city/CityEvent.js';

describe('Frequency Effects', () => {
    it('require to send events', () => {
        const kTime = 2;
        const event = new FrequencyEffect({period: kTime});
        const parents = [];
        event.updateTime(kTime/2, parents);
        
        // Requires inheritance to implement `.trigger()`
        assert.throw(()=>event.updateTime(kTime, parents), Error);
    });

    it('Send events when updated', () => {
        const kEventType = "kEventType";

        class MyFrequencyEffect extends FrequencyEffect {
            trigger(parents) {
                parents.time++;
                return [new CityEvent({type: kEventType, object: { salutation: parents.salutation} })];
            }
        }

        const kTime = 2;
        const event = new MyFrequencyEffect({period: kTime});

        const salute = "hello";
        const parents = { salutation: salute, time: 0 };

        let eventsBeforeTrigger = event.updateTime(kTime/2, parents);
        assert.strictEqual(0, eventsBeforeTrigger.length);
        assert.strictEqual(0, parents.time);

        let eventsAfterTrigger = event.updateTime(kTime, parents);
        assert.strictEqual(1, eventsAfterTrigger.length);
        assert.include(eventsAfterTrigger[0].toString(), kEventType);
        assert.strictEqual(salute, eventsAfterTrigger[0].object.salutation);

        assert.strictEqual(1, parents.time);
        
        let eventsAfterMoreTriggers = event.updateTime(kTime*2, parents);
        assert.strictEqual(2, eventsAfterMoreTriggers.length);
        assert.strictEqual(3, parents.time);
    });
});
