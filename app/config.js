export const config = {};
export const buildingBlocksTypes = {
    FILER : 'filter',
    EVENTWINDOW : 'eventWindow',
    FOLDSUM : 'foldSum',
    FOLDMEDIAN : 'foldMedian',
    STDOUTSINK : 'stdOutSink'
}

config.pipline = [
[buildingBlocksTypes.FILER,0],
[buildingBlocksTypes.EVENTWINDOW,2],
[buildingBlocksTypes.FOLDSUM,null],
[buildingBlocksTypes.EVENTWINDOW,3],
[buildingBlocksTypes.FOLDMEDIAN,null],
[buildingBlocksTypes.STDOUTSINK,null]
]
