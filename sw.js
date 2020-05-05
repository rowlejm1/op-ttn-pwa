const staticCacheName = 'site-static-v01';
const dynamicCacheName = 'site-dynamic-v01';
const assets = [
    '/',
    '/views/index.hbs',
    '/views/fallback.hbs',
    '/views/add-device.hbs',
    '/javascripts/loader.js',
    '/javascripts/ui.js',
    '/javascripts/auth.js',
    '/javascripts/materialize.min.js',
    '/stylesheets/styles.css',
    '/stylesheets/materialize.min.css',
    '/images/dish.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v50/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2'
];

// cache size limit function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size))
            }
        })
    })
}

// install service worker
self.addEventListener('install', evt => {
    console.log('service worker has been installed');
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('caching shell assets');
            return cache.addAll(assets);
        })
    );
});

// activate event
self.addEventListener('activate', evt => {
    console.log('service worker has been activated');
    evt.waitUntil(
        caches.keys().then(keys => {
            //console.log(keys);
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))    
            )
        })
    );
});

// fetch event
self.addEventListener('fetch', evt => {
    if(evt.request.url.indexOf('firestore.googleapis.com') === -1) {
        evt.respondWith(
            caches.match(evt.request).then(cacheRes => {
                return cacheRes || fetch(evt.request).then(fetchRes => {
                    return caches.open(dynamicCacheName).then(cache => {
                        cache.put(evt.request.url, fetchRes.clone());
                        limitCacheSize(dynamicCacheName, 30);
                        return fetchRes;
                    })
                });
            }).catch(() => {
                if(evt.request.url.indexOf('.ejs') > -1){
                    return caches.match('fallback.ejs');
                }
            })
        );
    }
});