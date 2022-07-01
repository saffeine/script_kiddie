var loadtext =
`/* Youtube Looper • Developed by Saffeine */
Listen, my favourite one broke, I got desperate.`;

sf_youloop = {
    initialise: function() {
        this.loopEnabled = false;
        this.loopStart = 0;
        this.loopEnd = 0;
        this.oldhref = window.location.href;
        this.rnURL = document.getElementById("sfexturl").getAttribute("content");
        document.getElementById("sfexturl").parentNode.removeChild(document.getElementById("sfexturl"));

        this.generateLoopButton();

        console.log(loadtext);
        return this;
    },

    setLoop: function(loopEnabled, loopStart, loopEnd){
        if(loopEnabled == -1){ loopEnabled = !this.loopEnabled; }
        if(loopStart == -1){ loopStart = this.getVideoElement().currentTime; }
        if(loopEnd == -1){ loopEnd = this.getVideoElement().currentTime; }

        this.loopEnabled = loopEnabled ?? this.loopEnabled;
        this.loopStart = loopStart ?? this.loopStart;
        this.loopEnd = loopEnd ?? this.loopEnd;

        document.querySelector("#sf_youloop_container .loop_button").style.backgroundColor = (this.loopEnabled ? "#D00" : "#666");
        document.querySelector("#sf_youloop_container .loop_button").style.boxShadow = (this.loopEnabled ? "" : "");
        document.querySelector("#sf_youloop_container .loop_controls #start_time").value = this.toTimestamp(this.loopStart);
        document.querySelector("#sf_youloop_container .loop_controls #end_time").value = this.toTimestamp(this.loopEnd);

        return;
    },

    /* helper functions. */
    getVideoElement: function() {
        var videoElement = document.getElementsByTagName("video")[0];
        return videoElement;
    },

    generateLoopButton: function(){
        var container = document.createElement("div");
        container.id = "sf_youloop_container";
        container.innerHTML = `
            <div class="loop_button" onclick="sf_youloop.setLoop(-1, undefined, undefined);"><img src="` + this.rnURL + `assets/loop.png"></img></div>
            <div class="loop_controls">
                <p>LOOPING FROM</p>
                <input id="start_time" onchange="sf_youloop.setLoop(true, sf_youloop.fromTimestamp(this.value), undefined);"><button onclick="sf_youloop.setLoop(true, -1, undefined);">•</button>
                <p>TO</p>
                <input id="end_time" onchange="sf_youloop.setLoop(true, undefined, sf_youloop.fromTimestamp(this.value));"><button onclick="sf_youloop.setLoop(true, undefined, -1);">•</button>
            </div>
        `;

        var attempts = 0;
        var interval = setInterval(function(e){
            try {
                var injElement = document.querySelector("#columns #primary #primary-inner #player");
                if(injElement == null){ console.log("Attempt " + String(attempts++) ); return; }

                injElement.after(container);

                var func_ = function(e){
                    if(window.location.href != sf_youloop.oldhref || isNaN(sf_youloop.loopEnd)){
                        sf_youloop.setLoop( false, 0, sf_youloop.getVideoElement().duration );
                        sf_youloop.oldhref = window.location.href;
                        return false;
                    }
        
                    if(!sf_youloop.loopEnabled){ return false; }
                    
                    if(e.type == "ended"){ this.currentTime = sf_youloop.loopStart; this.play(); }
                    if(this.currentTime > sf_youloop.loopEnd){ this.currentTime = sf_youloop.loopStart; this.play(); }
                    if(this.currentTime < sf_youloop.loopStart){ this.currentTime = sf_youloop.loopStart; this.play(); }
        
                    return true;
                };
        
                sf_youloop.getVideoElement().addEventListener("ended", func_);
                sf_youloop.getVideoElement().addEventListener("timeupdate", func_);
                sf_youloop.setLoop( false, 0, sf_youloop.getVideoElement().duration );

                clearInterval(interval);
            }catch(e){
                console.log(e);
                return;
            }
    }, 100);

        return;
    },
    
    toTimestamp: function(value){
        var hours = 0;
        var minutes = 0;
        var seconds = 0;
        var h_ = (60 * 60);
        var m_ = (60);
        var s_ = (1);
        value = Math.floor(value);

        while(value >= h_){ value -= h_; hours++; }
        while(value >= m_){ value -= m_; minutes++; }
        while(value >= s_){ value -= s_; seconds++; }

        var hrString = String(hours);
        var minString = String(minutes);
        var secString = String(seconds);
        // while(hrString.length < 2){ hrString = "0" + hrString; }
        while(minString.length < 2){ minString = "0" + minString; }
        while(secString.length < 2){ secString = "0" + secString; }

        return hrString + ":" + minString + ":" + secString;
    },

    fromTimestamp: function(value){
        var hours = 0;
        var minutes = 0;
        var seconds = 0;
        var vals = value.split(":");

        if(vals.length == 3){
            hours = parseInt(vals[0]) * (60 * 60);
            minutes = parseInt(vals[1]) * (60);
            seconds = parseInt(vals[2]);
        }

        if(vals.length == 2){
            minutes = parseInt(vals[0]) * (60);
            seconds = parseInt(vals[1]);
        }

        if(vals.length == 1){
            seconds = parseInt(vals[0]);
        }

        return hours + minutes + seconds;
    },

    /* helper functions 2, electric boogaloo. */
    getSearchParams: function() {
        var searchparams = (new URLSearchParams(window.location.search));
        return ({
            loop: searchparams.get("loop"),
            loop_start: searchparams.get("loopstart"),
            loop_end: searchparams.get("loopend")
        });
    }
};

sf_youloop.initialise();