
/**
 * App configuration file
 * @config - main config object
 * @buildingBlocksTypes - the names of the blocks 
 * @eventsTypes - the events types of the app
 * @filtersTypes - filters can be added here and pointed from pipline
 * @pipline - the pipline
 */

export const config = {};
export const buildingBlocksTypes = {
    FILER : 'filter',
    EVENTWINDOW : 'eventWindow',
    FOLDSUM : 'foldSum',
    FOLDMEDIAN : 'foldMedian',
    STDOUTSINK : 'stdOutSink'
}

export const eventsTypes = {
    COMMANDPROMPTINPUT : 'commandPromptInputEvent'
};

export const filtersTypes = {
    FILTER1 : x=>x>0,
    FILTER2 : x=>x>10
};


config.pipline =
[
    [buildingBlocksTypes.FILER,filtersTypes.FILTER1],
    [buildingBlocksTypes.EVENTWINDOW,2],
    [buildingBlocksTypes.FOLDSUM,null],
    [buildingBlocksTypes.EVENTWINDOW,3],
    [buildingBlocksTypes.FOLDMEDIAN,null],
    [buildingBlocksTypes.STDOUTSINK,null]

];

// config.pipline =
// [
//     [buildingBlocksTypes.FILER,filtersTypes.FILTER2],
//     [buildingBlocksTypes.EVENTWINDOW,2],
//     [buildingBlocksTypes.FOLDSUM,null],
//     [buildingBlocksTypes.STDOUTSINK,null]
    
// ];