/*

READ ME:

This script is designed to support HTML5 VPAID ads.

In order for HTML5 ad to operate in VPAID compatible video player,
ad must engage a special object that operates as a bridge between ad,
standard Sizmek JavaScript Client, and VPAID player.

This script accomplishes the following objectives:
1.  Script loads standard Sizmek HTML5 JavaScript Client libraries via
loading of EBLoader.
2.  Script loads a special VPAID bridge JavaScript file from Sizmek platform. The file name is EBVPAID.js.
3.  Once JavaScript Client and EBVPAID.js are loaded – EBVPAID creates a property with the name “VPAID” on the current window.
    Property VPAID exposes public API that can be accessed by the ad (see VPAID API section below).
4.  Script establishes two-way communication between VPAID instance and ad-specific logic via VPAID instance API.
5.  Script accomplishes VPAID configuration routine.
6.  Script illustrates VPAID API access.

--- MANDATORY and OPTIONAL Items ---

Objects and functions throughout this script are flagged as "MANDATORY" and "OPTIONAL".

MANDATORY items implement critical for ad performance logic and should remain unchanged in typical scenarios.
Designer must exercise caution when modifying objects flagged MANDATORY.

Objects marked "OPTIONAL" can be modified or removed without affecting crucial functionality.
Most items marked as optional are designed to illustrate specific ad functionality that may or may not be required for actual specific ad.
If OPTIONAL item are removed from the code, one should check for references throughout the template to avoid errors. Certain HTML elements present in index.html and styles.css are referenced in this script.

--- Display Modes ---

The template can be viewed in two different modes:
1. Design mode - when the ad is displayed independently of the EB JavaScript client;
2. Runtime mode - when the ad is served from the platform in video player.

These modes are detected by VPAID automatically. There is no need for the ad developer to have special logic for each mode.

In Design mode VPAID bridge allows the devloper to have instant visual feedback on the ad's look and feel without serving the ad in the actual VPAID player.
Ad html page can be displayed in browser independently.

To view video in Design mode the designer can provide an arbitrary video preview url.
Once the url is provided the corresponding video will be rendered behind the ad in place of the runtime video.
In Runtime mode the video preview url will be disregarded: thus, it can be left in the published ad.

--- Primary Video ---

Primary video is a video that plays in publisher player <video/> tag.
There is only one primary video in VPAID. VPAID accepts only one call with video id.
Subsequent attempts to provide video url are ignored.
If there is a need for playing additional videos in the ad, the creative is responsible for implementing and managing them.

--- VPAID Configuration ---

VPAID provides a special method that allows the ad to supply bridge with sufficient data to establish the proper ad flow.
The method name is configure() (see VPAID API section).

Ad must provide VPAID with primary video asset id. If video asset id is omitted – VPAID ad will not be displayed.

For convenience, this script first defines some VPAID configuration constants and then executes VPAID.configure() correctly when all the necessary requirements are met.
(see variable  PRIMARY_VIDEO_ID , DESIGN_MODE_VIDEO_URL, CLOSE_BTN_ID, SKIP_BTN_ID POSTER_ID below)

The configuration operation should only be invoked once since all subsequent attempts will be ignored.

--- VPAID API ---

VPAID property exposes the following methods and properties:

•   VPAID.configure(value:Object)
        Function configure() accepts a single argument as an Object.
        Object may contain the following properties:
        1. primaryVideoId  –    id of the primary video asset as integer.
                                This property and valid value are mandatory.
                                Failure providing of this property will result in unusable ad.

        2. designModeVideoUrl - url to video displayed in Design mode.
                                This parameter is optional. If value is not provided, video will not be rendered in Design mode.
                                The presence of value does not affect runtime video display.
                                Value can be provided as a relative url to local video asset or as a fully qualified url.

        3. closeButton –        reference to HTML element that acts as ad close button.
                                If value is not provided – VPAID will draw default close button.

        4. skipButton –         reference to HTML element that acts as ad skip button. This parameter is optional.
                                There is no default skip button in the current VPAID iteration.

•   VPAID.addEventListener(event:String, callback:Function)
        VPAID is an event dispatcher. Objects can subscribe to events VPAID dispatches.
        Function addEventListener() expects two arguments:
            1. event – event type as a string
            2. callback – reference to function that will be called when event is dispatched
            Currently VPAID dispatches video events related to the primary video only.

•   VPAID.removeEventListener(event:String, callback:Function)
        Removes event listeners.
        See VPAID.addEventListener().

•   VPAID.pause();
        Function pause() pauses primary video playback.
        Calling pause() on VPAID object will not affect other than primary video, sounds or animations.

•   VPAID.play();
    Function play() resumes video playback or restarts video if video playback is finished.
    Calling play() on VPAID objet will not affect other than primary videos, sounds or animations.

•   VPAID.muted;
        Property mute accepts Boolean value true/false.
        When muted is set to true – primary video will be muted (volume set to zero).
        When muted set to false – primary video will be unmuted (volume will be set to user-preferred volume).
        Changing of VPAID.mute value affects primary video only and will not propagate to other objects that handle sound including secondary video.

------ JavaScript Client -----

Ad can access JavaScript client exactly the same was as any display ad that uses client via classic EB API.

*/

/*
MANDATORY if reference is unchanged:
PRIMARY_VIDEO_ID is an Id of the video to be displayed in Runtime Mode.
In the current iteration all VPAID ads must contain primary video.
If omitted – ad will render unfunctional.

Value 1 assumes that video additional asset index on the platform is 1.

See function onLoaded() for details of the variable PRIMARY_VIDEO_ID processing.
*/
var PRIMARY_VIDEO_ID = 1;

/*
OPTIONAL:
DESIGN_MODE_VIDEO_URL is designed to contain relative or fully qualified url of the video displayed in Design Mode.
If removed the ad will be displayed without a video and will only render the HTML portion of the template while in design mode.
Value of this variable does not affect ads at runtime and can be left unchanged when ad is deployed to platform.

Value "videos/preview.mp4" assumes that ad’s template forlder videos hosts video file with the name preview.mp4

See function onLoaded() for details of the variable DESIGN_MODE_VIDEO_URL processing.
*/
var DESIGN_MODE_VIDEO_URL = "videos/preview.mp4";

/*
OPTIONAL:
CLOSE_BTN_ID holds a DOM element id of the close button passed to VPAID.
If removed a default close button will be drawn into the creative.
If incorrect id is provided – default close button will be used.

Value "closeBtn" assumes that the current ad has an HTML element with id "closeBtn".

See function onLoaded() for details of the CLOSE_BTN_ID processing.
*/
var CLOSE_BTN_ID = "closeBtn";

/*
OPTIONAL:
SKIP_BTN_ID holds a DOM element id of the skip button passed to VPAID.

If omitted - skip button will not be displayed even if skip offset is specified.

See function onLoaded() for details of the SKIP_BTN_ID processing.
*/
var SKIP_BTN_ID = "skipBtn";

/*
MANDATORY:
Self-executing anonymous function responsible for,
a.  loading script dependencies,
b.  configuring VPAID, and
c.  assuring that all requirements are met before initializing the creative.
Some of the most important processes under control if this function are window load and EB initialization.
*/
(function()
{
    /*
    EBModulesToLoad instructs EB to load the video module.
    Presence of Client Video module is crucial for correct VPAID ad functionality.
    */
    EBModulesToLoad = ["Video"];

    // base path to scripts in secure and non-secure environments
    var base  = location.protocol === "https:" ? "https://secure-" : "http://";
    /*
    path to the scripts on the server.
    Make sure to change the value if this template is served in an environment other than production such as INT or DEV4
    */
    var path  = base + "ds.serving-sys.com/BurstingScript/"

    // reference to the documents head element
    var head  = document.getElementsByTagName("head")[0];

    // list of the files to load
    var files = ["EBLoader", "EBVPAID"];

    // count of the files successfully loaded
    var count = 0;

    // create the scripts
    for (var i=0; i<files.length; i++)
    {
        var script    = document.createElement("script");
        script.src    = path + files[i] + ".js";
        script.onload = onLoaded;
        head.appendChild(script);
    }

    /**
    handle scripts loaded and check that all requirements are met
    before initalizing the creative
    */
    function onLoaded()
    {
        // wait for all scripts to load before proceeding
        if(++count < files.length)
        {
            return;
        }

        // if DOM isn't fully loaded wait for window load event before proceeding
        if(document.readyState !== "complete")
        {
            window.addEventListener("load", onLoaded);
            return;
        }

        // if EB is not initialized wait for EB init event before proceeding
        if(!EB.isInitialized())
        {
            EB.addEventListener(EBG.EventName.EB_INITIALIZED, onLoaded);
            return;
        }

        /*
        create config object to be passed to VPAID module
        see VPAID API configure() in READ ME section
        */
        var config =
        {
            primaryVideoId     : window.PRIMARY_VIDEO_ID,
            designModeVideoUrl : window.DESIGN_MODE_VIDEO_URL,
            closeButton        : document.getElementById(window.CLOSE_BTN_ID),
            skipButton         : document.getElementById(window.SKIP_BTN_ID)
        };

        // pass config object to VPAID module
        VPAID.configure(config);

        /*
        OPTIONAL if creative initialization is not required:
        Ad-specific initialization may be stopped by either removing this line or deleting function initCreative() without affecting all-in-all ad performance.
        If function initCreative() is renamed - corresponding referential changes must follow here.
        IMPORTANT! If ad requires any other initialization processes that have dependencies of VPAID and EB readiness –
        end of this anonymous function is the portion of the code where initialization functionality must be invoked.
        see initCreative() comments
        */
        if(initCreative) initCreative();
    }
})();

/*
OPTIONAL:
Function initCreative() initializes creative-specific functionality that depends on EB and VPAID objects readiness.
This function or its body can be safely removed if there is no demand for additional VPAID specific initialization.
See initButtons() and addVideoEvents() for additional information
*/

function initCreative()
{
    initButtons();
    addVideoEvents();
}

/*
OPTIONAL:
Function initButtons() creates references to creative buttons and activate buttons interactivity.
The main objective of additional buttons presence in this template is to illustrate how VPAID API can be accessed should ad require such functionality.
Buttons handled in this function are not required for general ad performance. Buttons and their corresponding even handlers can be safely removed from the ad.
*/

function initButtons()
{
    togglePlaybackBtn = document.getElementById("togglePlaybackBtn")
    togglePlaybackBtn.addEventListener("click", togglePlayback);

    toggleAudioBtn = document.getElementById("toggleAudioBtn")
    toggleAudioBtn.addEventListener("click", toggleAudio);

    customInteractionBtn = document.getElementById("customInteractionBtn")
    customInteractionBtn.addEventListener("click", onCustomInteraction);

    videoClickOverlay = document.getElementById("videoClickOverlay")
    videoClickOverlay.addEventListener("click", onClickThrough);

    clickThroughBtn = document.getElementById("clickThroughBtn")
    clickThroughBtn.addEventListener("click", onClickThrough);
}

/*
OPTIONAL:
Function addVideoEvents() subscribes to video events dispatched from VPAID.
If the ad is not processing video events – this function can be safely removed.
For a complete list of video events see: http://www.w3schools.com/tags/ref_av_dom.asp

See onVideoEvent()
*/
function addVideoEvents()
{
    /*
    Array events is a list of video event types.
    Can be safely shortened to accommodate ad specific needs.
    */
    var events =
    [
        "ended",     "pause",   "play",           "volumechange",
        "abort",     "canplay", "canplaythrough", "durationchange",
        "emptied",   "error",   "loadeddata",     "loadedmetadata",
        "loadstart", "playing", "progress",       "ratechange",
        "seeked",    "stalled", "suspend",        "timeupdate",
        "waiting"
    ];

    for (var i=0; i<events.length; i++)
    {
        var event = events[i];
        VPAID.addEventListener(event, onVideoEvent);
    }
}

/*
OPTIONAL:
Function onVideoEvent () is a centralized video event callback.
Conditional cases can be added and removed from the switch statements as needed.
If video event handling is not required by individual ad – this function can be safely removed.
When function is removed or its name changed – make sure corresponding referential changes are made in the function addVideoEvents().
*/

function onVideoEvent(event)
{
    switch(event.type)
    {
        case "ended" : case "pause" : case "play" :
            onPlaybackChanged(event);
            break;
        case "volumechange":
            onAudioChanged(event);
            break;
    }
}

/*
OPTIONAL:
Function onPlaybackChanged () toggles togglePlaybackBtn label text.
Notice that the html is not changed on the button when the user actually clicks the element. The html is only changed once the proper video event is received.
See onVideoEvent() function.
See initButtons() where “click” event listener is added.
See togglePlayback() –function that handles video playback progress manipulations.
onPlaybackChanged() can be safely discarded if ad does not implement play/pause controls.
*/
function onPlaybackChanged(event)
{
    var html = event.type === "play" ? "pause" : "play";
    togglePlaybackBtn.innerHTML = html;
}

/*
OPTIONAL:
Function onAudioChanged () toggles toggleAudioBtn label text.
Notice that the html is not changed on the button when the user actually clicks the element. The html is only changed once the proper audio event is received from video.
See onVideoEvent() function.
See initButtons() where “click” event listener is added.
See toggleAudio() – function that handles video sound manipulations.
onAudioChanged() can be safely discarded if ad does not implement audio controls.
*/
function onAudioChanged(event)
{
    var html = VPAID.muted ? "unmute" : "mute";
    toggleAudioBtn.innerHTML = html;
}

/*
OPTIONAL:
Function toggleAudio () manages video sound state.
To mute audio  - set VPAID.mute to true
To unmute audio - set VPAID.mute to false
See  onAudioChanged() and initButtons() for examples of how audio controls logic is implemented.
*/
function toggleAudio()
{
    VPAID.muted = !VPAID.muted;
}

/*
OPTIONAL:
Function togglePlayback () manages video playback progress by pausing or resuming the video.
To pause video   - call pause() function on VPAID
To unpause video - call play()  function on VPAID
See  onPlaybackChanged () and initButtons() for examples of how video playback management logic is implemented.
*/
function togglePlayback()
{
    if(togglePlaybackBtn.innerHTML === "pause")
    {
        VPAID.pause();
        return;
    }
    VPAID.play();
}

/*
OPTIONAL:
Function onClickThrough() is a “click” event listener for the button that is designed to invoke Clickthrough interaction.
In this example function also pauses primary video.
This function can be entirely removed.
See  initButtons() where onClickThrough() is provided as a callback for videoClickOverlay “click” event listener.
*/
function onClickThrough(event)
{
    EB.clickthrough();
    VPAID.pause();
}

/*
OPTIONAL:
onCustomInteraction() is a "click" event handler for customInteractionBtn button object
Designed as an example of custom interaction handling.
Can be safely remove from the code if customInteractionBtn HTML element is not present or does not handle user click.

See initButtons() where onCustomInteraction() is provided as a “click” event listener callback for customInteractionBtn button.
*/
function onCustomInteraction()
{
    EB.userActionCounter("CustomInteractionName");
}
