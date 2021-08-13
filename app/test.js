import { defer, fromEvent, interval, Observable, Subject } from 'rxjs';
import { map, mergeAll, bufferCount, filter } from 'rxjs/operators';
import _ from 'lodash';
import events from 'events';
var em = new events.EventEmitter();
em.on('FirstEvent', function (data) {
    console.log(data);
});

em.on('SecondEvent', function (data) {
    console.log(data);
});



const sumMap = (x) => {
    return _.sum(x);
}

const median = (arr) => {
    const mid = Math.floor(arr.length / 2),
        nums = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

const subject0 = new Subject();
const subject1 = new Subject();

// const subject1 = new Subject().pipe(filter(i=>i>0));
// const subject2 = new Subject().pipe(buffe(2));
// const subject3 = new Subject().pipe(map((x) => sumMap(x)));
// const subject4 = new Subject().pipe(map((x) => median(x)));
// const subject5 = new Subject();

// let arr = [subject0,subject1,subject2,subject3,subject4,subject5];

// for (let index = 1; index < arr.length-1; index++) {
//     const currentSub = arr[index];
//     const nextSub = arr[index+1];

//     currentSub.subscribe(f=>{
//         nextSub.next(f);
//     })
// }



const stateful = (windowSize,caller) => {
    return source => defer(() => {
        let counter = 0;
        return source.pipe(
            map(next => {
                if(counter < windowSize-1){
                    counter++;
                    em.emit(caller, caller);
                }else{
                    counter = 0;
                }
                return next;
            }),
        )
    })
}



const customFilter = (filterFunc) => {
    return source => defer(() => {
        return source.pipe(
            filter(next => {
                    if(!filterFunc(next)){
                        em.emit('SecondEvent', 'Filter Has Been Called');
                    }
                    return filterFunc(next);
            }),
        )
    })
}

let s1 = subject0.pipe(stateful(2,'FirstEvent'),bufferCount(2))
s1.subscribe(x => console.log(x));

let s2 = subject1.pipe(stateful(4,'SecondEvent'),bufferCount(4))
s2.subscribe(x => console.log(x));

// let s2 = subject1.pipe(customFilter(2))
//  let s2 = subject1.pipe(customFilter(i=>i>5))

// s2.subscribe(x => console.log(x));

// subject0.next(2);
// subject0.next(1);
// subject0.next(3);
subject0.next(7);
subject0.next(4);
subject0.next(3);
subject0.next(3);

subject1.next(10);
subject1.next(20);
subject1.next(30);
subject1.next(40);












