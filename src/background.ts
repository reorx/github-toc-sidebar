console.log('background')

chrome.runtime.onStartup.addListener( () => {
    console.log(`onStartup()`);
});
