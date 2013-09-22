define(function (require) {
    var Backbone        = require("backbone"),
        _               = require("underscore"),
        testTemplate    = require("text!templates/test.html"),
        PUBNUB          = require('pubnub'),
        content         = _.template(testTemplate);

    var MainView = Backbone.View.extend({
        tagName: "div",
        events: {
            "click #submitMessage" : "submitMessage",
        },
        initialize: function(){
            console.log("test initialize has run");
            this.messages = new Backbone.Collection;
            var pn = PUBNUB.init({
                publish_key   : 'pub-c-8858ff58-ac48-4e3c-b132-76e2d0f95e6c'
                , subscribe_key : 'sub-c-4c613c54-222e-11e3-be11-02ee2ddab7fe'
                //, origin        : 'pubsub.pubnub.com'
                //, uuid          : 'blahoink00011111'
            });
            pn.ready();
            var self = this;
            pn.subscribe({
                channel : "oink",
                //backfill   : true,
                //noheresync : true,
                callback : function(m){self.addMessage(m, '#messagesReceivedList')},
                connect : function(){ console.log('connected')}
            });
            this.pn = pn;
        },
        render: function(){
            this.$el.html(content());
            return this.$el;
        },
        addMessage: function(message, target){
            this.$el.find(target).append("<li>" + message + "</li>");
        },
        submitMessage: function(event){
            if (!this.pn){ throw "PubNub not initialized.";}
            var message = this.getMessage();
            var config = {};
            config.channel = 'oink';
            config.message = message;
            console.log("Attempting to broadcast to channel: oink with message: " + message);
            this.addMessage(message, '#messagesSentList')
            this.pn.publish(config);
        },
        getMessage: function(){
            return this.$el.find("textarea").val();
        }

    });

    return MainView;
});