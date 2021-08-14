import log from 'npmlog';
import promptSync from 'prompt-sync';
import { isUserInputValid } from './validation/validator.js';
import {median} from './utils/utils.js';
import { Observable, Subject} from 'rxjs';
import { bufferCount, map } from 'rxjs/operators';
import { customFilter, em, fixedEventWindow ,ff} from './buildingBlocks.js';
import _ from 'lodash';

const prompt = promptSync();
var buildingBlocks = [];
const stdinSource = new Subject();


function applicationStart() {
    ff();
    initiatePipeLine();
    getUserInputNumber();
}

function getUserInputNumber() {
    console.log("Please enter a number :");
    let userInput = prompt();
    if (userInput == 'a') {
        process.exit();
    }
    userInput = parseInt(userInput);
    if (!isUserInputValid(userInput)) {
        log.error("Invalid input, please enter integer number")
        getUserInputNumber();
    }
    console.log(`>${userInput}`);
    stdinSource.next(userInput);
}

function initiatePipeLine() {
    let filter1 = new Subject();
    let filter1Pipe = filter1.pipe(customFilter(i=>i>0,'CommandPromptEvent'));
    let fixedEventWindow1 = new Subject();
    let fixedEventWindowPipe1 = fixedEventWindow1.pipe(fixedEventWindow(2,'CommandPromptEvent'),bufferCount(2));
    let sum1 = new Subject().pipe(map((x) => _.sum(x)));
    let fixedEventWindow2 = new Subject();
    let fixedEventWindowPipe2 = fixedEventWindow2.pipe(fixedEventWindow(10,'CommandPromptEvent'),bufferCount(10));
    let medianSubject = new Subject().pipe(map((x) => median(x)));
    let print = new Subject();
    print.subscribe(f=>console.log(f));

    filter1Pipe.subscribe(s=>{
        fixedEventWindow1.next(s)
    });

    fixedEventWindowPipe1.subscribe(s=>{
        sum1.next(s)
    });

    sum1.subscribe(s=>{
        fixedEventWindow2.next(s)
    });

    fixedEventWindowPipe2.subscribe(s=>{
        medianSubject.next(s)
    });

    medianSubject.subscribe(s=>{
        print.next(s)
    });

    stdinSource.subscribe(s=>{
        filter1.next(s)
    });
}

em.on('CommandPromptEvent',f=>{
    console.log('command Prompt Has Triggred');
    getUserInputNumber();
    // stdinSource.next(100);
})

applicationStart();