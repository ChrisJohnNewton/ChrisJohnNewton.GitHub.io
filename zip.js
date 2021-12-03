// the important part: register the ServiceWorker !
navigator.serviceWorker.register('/optimize-images/imports/client-zip/client-zip-worker.js')
    
// this part implements a very simple dynamic form where you can clone and remove the basic input
// const list = document.getElementById("file-list")
// const template = document.getElementById("url-input")