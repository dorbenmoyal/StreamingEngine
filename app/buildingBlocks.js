
import { defer } from 'rxjs';
import { map,filter,bufferCount, tap } from 'rxjs/operators';
import events from 'events';
import _ from 'lodash';
import {median} from './utils/utils.js';
export var em = new events.EventEmitter();
import {config,buildingBlocksTypes,eventsTypes} from './config.js';

/**
 * Custom filter function 
 * This function gets a filter function and rise event when filter function returns false
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
 * This function gets a window size and event and emit event if window is not full
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

/**
 * Read pipes from configuration (order is important)
 * @returns  - piplines list
 */
export function getPipes(){
    let piplines = [];
    config.pipline.forEach(p=>{
        const block = getBuildingBlock(p);
        if(Array.isArray(block))
            block.forEach(b=>piplines.push(b))
        else
            piplines.push(block);
            
    });
    return piplines;
}

/**
 * Gets block type and return the pipe
 * @blockType - blockType with params (if have)
 * @returns  - piplines list
 */
export function getBuildingBlock(blockType){

    switch (blockType[0]) {
        case buildingBlocksTypes.FILER:
            return  customFilter(blockType[1],eventsTypes.COMMANDPROMPTINPUT);
            break;
        case buildingBlocksTypes.EVENTWINDOW:
            return  [fixedEventWindow(blockType[1],eventsTypes.COMMANDPROMPTINPUT),bufferCount(blockType[1])];
            break;
        case buildingBlocksTypes.FOLDSUM:
            return map((x) => _.sum(x));
            break;
        case buildingBlocksTypes.FOLDMEDIAN:
            return map((x) => median(x));
            break;

        case buildingBlocksTypes.STDOUTSINK:
                    return tap(console.log);
            break;
    
        default:
            break;
    }
}