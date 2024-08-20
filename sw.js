// imports
importScripts('js/sw-utils.js')

const STATIC_CHACE = 'statis_v1';
const DYNAMIC_CHACE = 'dynamix_v1';
const INMUTABLE_CHACE = 'inmutable_v1';

const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/wolverine.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/ironman.jpg',
    'js/app.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,30',
    'css/animate.css',
    'js/libs/jquery.js'
]

self.addEventListener('install', e => {
    const cacheStatic = caches.open(STATIC_CHACE).then( cache => {
        cache.addAll(APP_SHELL)
    })

    const cacheInmutable = caches.open(INMUTABLE_CHACE).then( cache => {
        cache.addAll(APP_SHELL_INMUTABLE)
    })

    e.waitUntil(Promise.all([cacheInmutable, cacheStatic]))
})


self.addEventListener('active', (e) => {
    const responActivate = caches.keys().then( keys => {
        keys.forEach(key => {   
            if(key !== STATIC_CHACE && key.includes('static')){
                return caches.delete(key)
            }
        });
    } )

    e.waitUntil( responActivate )
})

self.addEventListener('fecth', (e) => {

    const response = caches.match(e.request).then( res => {

        if(res) { return res}
        else {
            
            return fetch(e.request).then( newResponse => {
                return actualizaCacheDinamico(DYNAMIC_CHACE, e.request, newResponse)
            })

        }



    })

    e.respondWith(response)
}) 