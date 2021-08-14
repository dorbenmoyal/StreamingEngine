import log from 'npmlog';
import promptSync from 'prompt-sync';
import { isUserInputValid } from './validation/validator.js';
import {Subject} from 'rxjs';
import {em ,getPipes} from './buildingBlocks.js';
import {eventsTypes} from './config.js';
import _ from 'lodash';

const prompt = promptSync();
var buildingBlocks = [];
const stdinSource = new Subject();
const appSubject = new Subject(); //The Main application subject

/**
 * application entry point
 */
function applicationStart() {
    createPipe();
    getUserInputNumber();
}

/**
 * 1)Gets user input
 * 2)parse to int
 * 3)validate the input
 * 4)print to console the value
 */
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
/**
 * 1) Load the pipes from configuration
 * 2) Create appSubject and appSubjectPipe
 * 3) Subscribe to get the result
 */
function createPipe() {
    let pipes = getPipes();
    let appSubjectPipe = appSubject.pipe();
    pipes.forEach(p=>{ appSubjectPipe = appSubjectPipe.pipe(p)});

    appSubjectPipe.subscribe({
        next : (n) => {
            appSubject.complete();
        },
        error : (e) =>{
            log.error(e)
        }
    });
    
    //appSubjectPipe.subscribe(f=>getUserInputNumber());  //uncomment for running the pipe in cycles
}

em.on(eventsTypes.COMMANDPROMPTINPUT,f=>{
    console.log('Command prompt input  has triggred');
    getUserInputNumber();
})

/**
 * Listening to user inputs
 */
stdinSource.subscribe(s=>{
    appSubject.next(s)
});

appSubject.subscribe({
    complete : (c) => {
        log.info('Pipe completed unsubscribing...');
        appSubject.unsubscribe();
    },
    error : (e) =>{
        log.error(e)
    }
})

applicationStart();