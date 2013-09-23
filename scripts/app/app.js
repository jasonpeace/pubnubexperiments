define(function (require) {
    var Backbone            = require("backbone"),
        _                   = require("underscore"),
        testTemplate        = require("text!templates/app.html"),
        listItemTemplate    = require("text!templates/messageListItem.html"),
        listItem            = _.template(listItemTemplate),
        PUBNUB              = require('pubnub'),
        content             = _.template(testTemplate),
        moment              = require('moment'),

        MainView = Backbone.View.extend({
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
                backfill   : true,
                noheresync : true,
                callback : function (m){
                        m.received = new Date().getTime();
                        self.addMessage(m, '#messagesReceivedList')
                },
                connect : function(){ console.log('connected')}
            });
            this.pn = pn;
        },
        render: function(){
            this.$el.html(content());
            return this.$el;
        },
        addMessage: function(message, target){
            this.$el.find(target).prepend(listItem({data:message, view:this}));
        },
        formatDate:function(epoch){
            return moment(epoch).format('YYYY-MM-DD HH:mm:ss');
        },
        submitMessage: function(event){
            if (!this.pn){ throw "PubNub not initialized.";}
            var config = {};
            config.channel = 'oink';

            var packet = {};
            packet.sent = new Date().getTime();
            packet.message = this.getMessage();
            config.message = packet;
            console.log("Attempting to broadcast to channel: oink with message: " + packet.message);
            this.addMessage(packet, '#messagesSentList')
            this.pn.publish(config);
        },
        getMessage: function(){
            return this.$el.find("textarea").val();
        }

    });

    return MainView;
});