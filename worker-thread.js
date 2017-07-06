// JavaScript Document
// This file is designed to create a test enviroment for a worker thread.


// create entry in the testing tools menu.
var testNav = document.getElementById("test-nav");
// testNav.innerHTML += '<div class="attribute-group"><h4>Message Testing</h4></div>';
var testControl = document.createElement('div');
testControl.id = 'worker-thread-controls';
testControl.classList.add('attribute-group');

var testControlHeader = document.createElement('h4');
testControlHeader.innerHTML = 'JavaScript Worker Thread';
testControl.appendChild( testControlHeader );

var testControlStartThread = document.createElement('button');
testControlStartThread.innerHTML = 'Start Thread';
testControlStartThread.addEventListener('click', workerMessage);
testControl.appendChild( testControlStartThread );

var testControlStopThread = document.createElement('button');
testControlStopThread.innerHTML = 'Stop Thread';
testControlStopThread.addEventListener('click', workerMessage);
testControl.appendChild( testControlStopThread );

testNav.appendChild(testControl);

// create a worker thread
var worker = new Worker('js/doWork.js');

// this is the catch all when the worker returns the message
worker.addEventListener('message', function(e) {
  createMessage('Worker said: ' + e.data, 1);
}, false);

// click event listener for the test buttons.
function workerMessage () {
    worker.postMessage('Hello World'); // Send data to our worker.
}
