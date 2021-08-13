
import { defer } from 'rxjs';
import { map,filter } from 'rxjs/operators';
import events from 'events';
export var em = new events.EventEmitter();

/**
 * Custom filter function 
 * This function gets a filter function and rise event an event when filter function returns false
 * @filterFunc - filter function
 * @event  - event
 */
export const customFilter = (filterFunc,event) => {
    return source => defer(() => {
        return source.pipe(
            filter(next => {
                if (!filterFunc(next)) 
                    em.emit(event, event);
                return filterFunc(next);
            }),
        )
    })
}


/**
 * Custom fixed-event-window function 
 * This function gets a window size and caller and emit event if window is not full
 * @filterFunc - filter function
 * @event  - event
 */
 export const fixedEventWindow = (windowSize,event) => {
    return source => defer(() => {
        let counter = 0;
        return source.pipe(
            map(next => {
                if(counter < windowSize-1){
                    counter++;
                    em.emit(event, event);
                }else{
                    counter = 0;
                }
                return next;
            }),
        )
    })
}