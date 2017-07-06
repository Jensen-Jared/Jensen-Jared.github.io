// JavaScript Document
self.addEventListener('message', function(e) {
    // this function is called when a message is sent to the worker thread.
    self.postMessage(e.data);
}, false);