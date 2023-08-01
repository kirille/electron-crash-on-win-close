
window.addEventListener('beforeunload', () => {
    for( i = 0; i < 1_000_000; i++ ) {
        console.log(i);
    }
})