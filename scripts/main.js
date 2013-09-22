requirejs.config({
    baseUtl: 'scripts',
    paths: {
        jquery: 'vendor/jquery-1.10.2',
        underscore: 'vendor/underscore-1.5.2',
        backbone: 'vendor/backbone-1.0.0',
        pubnub: 'vendor/pubnub-3.5.4',
        backbonePubnub:'vendor/backbone-pubnub-0.1.6',
        text: 'vendor/text-2.0.10'
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        "pubnub": {
            exports: "PUBNUB"
        },
        "backbonePubnub": {
            deps: ['backbone', 'pubnub']
        }
    }
});

// Start the main app logic.
requirejs(['jquery', 'app/test', 'text'],
function   ($, MainView, text) {
    var view = new MainView();
    var content = view.render();
    $('#content').html(content);
});