PennController.ResetPrefix(null);
PennController.DebugOff();
var counterOverride = 0;
PennController.SetCounter("setcounter");

// ! CONSTANTS FOR EXPERIMENT ===============================================================================
const astTime = 450;
const blank_time = 1000;
const recall_time = 8000;
const instructions_timeout = 15000;


const wFontSize = "100";
const proceedFontSize = "100";
const bodyFontSize = "22";
var headerFontSize = "36";

var fname = "stim_exp.csv";

// ! CSS CONSTANTS =========================================================================================
var header = { "font-size": headerFontSize, "text-align": "center" };

// ! FUNCTIONS =============================================================================================
// Define a function to generate subject IDs which is a squence of 4 letters
// The ID is used to name the recording files
function getRandomStr() {
  const LENGTH = 8;
  const SOURCE = "abcdefghijklmnopqrstuvwxyz";
  let result = "";

  for (let i = 0; i < LENGTH; i++) {
    result += SOURCE[Math.floor(Math.random() * SOURCE.length)];
  }
  return result;
}
// Generate a subject ID
const subject_id = getRandomStr();

//for inserting breaks
function SepWithN(sep, main, n) {
  this.args = [sep, main];

  this.run = function (arrays) {
    assert(
      arrays.length == 2,
      "Wrong number of arguments (or bad argument) to SepWithN"
    );
    assert(parseInt(n) > 0, "N must be a positive number");
    let sep = arrays[0];
    let main = arrays[1];

    if (main.length <= 1) return main;
    else {
      let newArray = [];
      while (main.length) {
        for (let i = 0; i < n && main.length > 0; i++)
          newArray.push(main.pop());
        for (let j = 0; j < sep.length && main.length > 0; ++j)
          newArray.push(sep[j]);
      }
      return newArray;
    }
  };
}
function sepWithN(sep, main, n) {
  return new SepWithN(sep, main, n);
}

// ! EXPERIMENT SEQUENCE ====================================================================================
Sequence(
  "setcounter",
  "consent_form",
  "initiate_recorder",
  "recording_test",
  "preloadTrial",
  startsWith("inst-"),
  startsWith("Intro"),
  startsWith("prac-"),
  sepWith(
    "async",
    sepWithN(
      "break",
      rshuffle(
        "filler", "experimental"
      ),
      24
    )
  ),
  "async",
  "send_results",
  "bye1",
  "bye2"
);

// ! SET METADA =============================================================================================
Header(
  newVar("head_number").global(), //Header(newVar("Preamble").global());
  newVar("verb_number").global(), //Header(newVar("Condition").global());
  newVar("attractor_number").global(), //Header(newVar("FillerType").global());
  newVar("itemnum").global(), 
)
  .log("PROLIFIC_ID", GetURLParameter("id"))
  .log("head_number", getVar("head_number"))
  .log("verb_number", getVar("verb_number"))
  .log("attractor_number", getVar("attractor_number"))
  .log("itemnum", getVar("itemnum"));

// ! CONSENT ================================================================================================
newTrial(
  "consent_form",
  newHtml("consent", "consent.html")
    .settings.checkboxWarning("Required")
    .settings.radioWarning("Required")
    .settings.inputWarning("Required")
    .print()
    .log(),
  newButton("I agree to participate in this study")
    .center()
    .print()
    .wait(getHtml("consent").test.complete().failure(getHtml("consent").warn()))
);

CheckPreloaded().label("preloadTrial"); //

// ! RECORDING ==============================================================================================
InitiateRecorder(
  "aws link for trigger" /// !!! TODO
).label("initiate_recorder");

newTrial(
  "recording_test",
  newText(
    "This experiment involves audio recording. " +
      "Before you start the experiment, please test your recording."
  )
    .bold()
    .print(),
  newText(".   ") // Adding space for formatting
    .print()
    .color("white"),
  newText(
    "Please record yourself saying the sentence 'This is a test' (this recording will be saved). " +
      "To start the recording, press the Record button below. " +
      "To stop the recording, press it again. " +
      "To test whether your voice was recorded, click the play button."
  ).print(),
  newText(".   ") // Adding space for formatting
    .print()
    .color("white"),
  newVoiceRecorder("test-recorder").print(),
  newText(".   ") // Adding space for formatting
    .print()
    .color("white"),
  newText(
    "Make sure you can hear your voice clearly in the playback before you continue. " +
      "<b>Please do not hesitate to test recording yourself multiple times to adjust your volume, " +
      "and make sure you can hear your voice clearly in the playback before you continue.</b>"
  ).print(),
  newText(".   ") // Adding space for formatting
    .print()
    .color("white"),
  newText(".   ") // Adding space for formatting
    .print()
    .color("white"),
  newText(
    "During the experiment, recordings will start and stop automatically. " +
      "There is a notification at the top of the page that will indicate when audio is being recorded."
  ).print(),
  newText(".   ") // Adding space for formatting
    .print()
    .color("white"),
  newText(".   ") // Adding space for formatting
    .print()
    .color("white"),
  newText(
    "Note: The experiment introduction will involve audio, " +
      "so please leave your computer audio on during the experiment " +
      "(listening through headphones is okay)."
  )
    .italic()
    .print(),
  newText(".   ") // Adding space for formatting
    .print()
    .color("white"),
  newText(".   ") // Adding space for formatting
    .print()
    .color("white"),
  newButton("continue", "Click here to continue")
    .print()
    .wait(
      getVoiceRecorder("test-recorder")
        .test.recorded()
        .failure(
          newText("Please test your audio recording before continuing")
            .color("red")
            .print()
        )
    )
);

// ! INSTRUCTIONS ==========================================================================================
newTrial(
  "inst-1",
  newText(
    "<center><b>Instructions</b></center>" +
      "<p>Please read these instruction sections carefully! " +
      "If you fail to understand the task, your data will NOT be usable." +
      "<p>In this experiment, you will read some sentences by pressing 'space' and later recall them." +
      "Your voice will be recorded while you recall these sentences." +
      "<p>This experiment requires your FULL ATTENTION. " +
      "The experiment is reasonably brief. Most people find that the study takes around XXXX minutes. " + //!!! TODO
      "During this time, you must give your complete attention." +
      "<p>Before proceeding please make sure:<ol>" +
      "<li>You are using your <b>computer</b>, and not your phone or tablet,</li>" +
      "<li>You are using <b>Google Chrome</b>, and not Safari or Firefox,</li>" +
      "<li>You have a <b>working mouse/trackpad and keyboard</b>,</li>" +
      "<li>You are a native speaker of <b>American English</b>,</li>" +
      "<li>You are <b>between the ages of 18 - 30 </b>,</li>" +
      "<li>This is your <b>first time doing this experiment</b>,</li>" +
      "<li>You were able to record yourself and listen to your recording.</li></ol>"
  )
    .css({ "font-size": bodyFontSize, "line-height": "125%" })
    .print(),
  newButton("Next").center().settings.css("margin", "40px").print().wait()
);

newTrial(
  "inst-3",
  newText(
    "<center><b>Instructions</b></center>" +
      "<p>Please move to a quiet environment so that there are no background sounds " +
      "(e.g. music, television, voices) that will be picked up in the audio recordings. " +
      "Please also silence computer notifications or use headphones " +
      "(note that there will be audio during the experiment, so please do not mute your computer)." +
      "<p>When you are ready, please turn off any distractions " +
      "such as music, television, or your cell phone for the duration of the experiment, " +
      "and click below to begin the introduction section. Thank you!"
  )
    .css({ "font-size": bodyFontSize, "line-height": "125%" })
    .print(),
  newButton("Proceed to Introduction Section")
    .center()
    .settings.css("margin", "40px")
    .print()
    .wait()
);

// ! INTRO 1 ================================================================================================
newTrial(
  "Intro1",
  newText("Intro1" + "-title", "Introduction<br><br>")
    .css(header)
    .center()
    .bold()
    .print(),
  newText(
    "Intro1" + "-body",
    "In this experiment, you will see sentences presented word-by-word " +
      "and will read the sentences as you see each word." +
      "To see the next word, you need to press 'SPACE' button on your keyboard. " + 
      "<p>Let's practice some examples together." +
      "<p>Proceed by pressing any key on your keyboard"
  )
    .css({ "font-size": bodyFontSize }) // audio1
    .center()
    .print(),
// PUT BUTTON HERE
  newKey("Intro1" + "passkey", " ").wait(),
);

newTrial(
  "Intro2a",
  newText("Intro2a" + "ast-preRSVP", "****") // Present Asterisk
    .css({ "font-size": "70", "text-align": "center" })
    .print("center at 50vw", "middle at 50vh"),
  newTimer("Intro2a" + "ast-preRSVP", astTime)
    .start()
    .wait(), // Asterisk Timer
  getText("Intro2a" + "ast-preRSVP").remove(), // Remove Asterisk
  newController("DashedSentence", {s: "The dancer below the computer is running."})
    .log()
    .css({ "font-size": "100" })
    .print("center at 50vw", "middle at 50vh")
    .wait()
    .remove(),
  newTimer(800).start().wait(),
).setOption("hideProgressBar", true);

newTrial(
  "Intro2",
  newText(
    "Intro2" + "-body",
    "After you read a sentence, you will have a second of white screen, followed by a simple math question, and another second of white screen."
  )
    .css({ "font-size": bodyFontSize }) // audio1
    .center()
    .print(),
// PUT BUTTON HERE
  newKey("Intro1" + "passkey", " ").wait(),
);


newTrial(
  "Intro2a",
  newText("Intro2a" + "ast-preRSVP", "****") // Present Asterisk
    .css({ "font-size": "70", "text-align": "center" })
    .print("center at 50vw", "middle at 50vh"),
  newTimer("Intro2a" + "ast-preRSVP", astTime)
    .start()
    .wait(), // Asterisk Timer
  getText("Intro2a" + "ast-preRSVP").remove(), // Remove Asterisk
  newController("DashedSentence", {s: "Get ready to do some basic arithmetic calculations."})
    .log()
    .css({ "font-size": "100" })
    .print("center at 50vw", "middle at 50vh")
    .wait()
    .remove(),
  newTimer(1000).start().wait(),
  newText("math", "1+3").center().print(),
  newScale("grade", "1", "2", "3", "4", "5", "6", "7", "8", "9")
    .labelsPosition("bottom")
    .css("margin", "10pt")
    .center()
    .keys()
    .print()
    .callback(getTimer("hurry").stop()) // !!! TODO: there should be some timer 
    .log()
).setOption("hideProgressBar", true);


newTrial(
  "Intro2",
  newText(
    "Intro2" + "-body",
    "Now, you will read the sentence, do math, and then recall the sentence word by word out loud."
  )
    .css({ "font-size": bodyFontSize }) // audio1
    .center()
    .print(),
// PUT BUTTON HERE
  newKey("Intro1" + "passkey", " ").wait(),
);


newTrial(
  "Intro2a",
  newText("Intro2a" + "ast-preRSVP", "****") // Present Asterisk
    .css({ "font-size": "70", "text-align": "center" })
    .print("center at 50vw", "middle at 50vh"),
  newTimer("Intro2a" + "ast-preRSVP", astTime)
    .start()
    .wait(), // Asterisk Timer
  getText("Intro2a" + "ast-preRSVP").remove(), // Remove Asterisk
  newController("DashedSentence", {s: "Get ready to do some basic arithmetic calculations."})
    .log()
    .css({ "font-size": "100" })
    .print("center at 50vw", "middle at 50vh")
    .wait()
    .remove(),
  newTimer(1000).start().wait(),
  newText("math", "1+3").center().print(),
  newScale("grade", "1", "2", "3", "4", "5", "6", "7", "8", "9")
    .labelsPosition("bottom")
    .css("margin", "10pt")
    .center()
    .keys()
    .print()
    .callback(getTimer("hurry").stop()) // !!! TODO: there should be some timer 
    .log(),

    delete the text and the scale 

    add a recording
).setOption("hideProgressBar", true);




newTrial(
  "Intro3",
  newText(
    "Intro3" + "-body",
    "Now you are ready for the experiment, first we will do some practices"
  )
    .css({ "font-size": bodyFontSize }) // audio1
    .center()
    .print(),
// PUT BUTTON HERE
  newKey("Intro1" + "passkey", " ").wait(),
);


// ! PRACTICE ===============================================================================================

// !! PRACTICE 1 ============================================================================================
AddTable(
  "prac-table",
  "id,target,nw,w1,w2,w3,w4,trigger\n" +
    "1,The cat near the yarn is purring.,3,buy,hug,lick,NOPE,throw\n" +
    "2,The frog on the lilypad is relaxing.,2,frighten,send,NOPE,NOPE,admit\n" +
    "3,The singer by the microphone is performing.,4,catch,lose,admire,type,see\n" +
    "4,The wolf in the woods is hunting.,2,find,meet,NOPE,NOPE,contradict"
);

READY("prac-2");

Template("prac-2", (row) =>
  newTrial(
    "prac-2" + "-trials",
    newText("prac-2" + "-ast-preRSVP", "****") // Present Asterisk
      .css({ "font-size": "70", "text-align": "center" })
      .print("center at 50vw", "middle at 50vh"),
    newTimer("prac-2" + "-ast-preRSVP", astTime)
      .start()
      .wait(), // Asterisk Timer
    getText("prac-2" + "-ast-preRSVP").remove(), // Remove Asterisk
    ////

    newMediaRecorder(
      row.id + "_" + "prac-2" + "_" + subject_id,
      "audio"
    ).record(), // TIMER
    newTimer("prac-2" + "-whitescreen-preRSVP", 100)
      .start()
      .wait(), // 100 ms white screen

    // RSVP TARGET
    newController("DashedSentence", {
      s: row.target,
      mode: "speeded acceptability",
      display: "in place",
      wordTime: RSVPTime,
      wordPauseTime: 100,
    })
      .log()
      .css({ "font-size": "100" })
      .print("center at 50vw", "middle at 50vh")
      .wait()
      .remove(),
    ////

    newTimer("prac-2" + "-whitescreen-postRSVP", 100)
      .start()
      .wait(), // 100 ms white screen

    // Asterisk
    newText("prac-2" + "-ast-postRSVP", "****") // Present Asterisk
      .css({ "font-size": "70" })
      .print("center at 50vw", "middle at 50vh"),
    newTimer("prac-2" + "-ast-postRSVP", astTime)
      .start()
      .wait(), // Asterisk Timer
    getText("prac-2" + "-ast-postRSVP").remove(), // Remove Asterisk

    newText("prac-2" + "-trigger-first", row.trigger)
      .css({ "font-size": "100" })
      .print("center at 50vw", "middle at 50vh"),
    newTimer("prac-2" + "-trig-first", interveningWTime)
      .start()
      .wait(),
    getText("prac-2" + "-trigger-first").remove(),

    newText("prac-2" + "w1", row.w1) // first word presentation
      .css({ "font-size": wFontSize })
      .print("center at 50vw", "middle at 50vh"),
    newTimer("prac-2" + "w1-time", interveningWTime)
      .start()
      .wait(), // wait for 1500 miliseconds
    getText("prac-2" + "w1").remove(),
    newTimer("prac-2" + "whitescreen-w1", 100)
      .start()
      .wait(),
    newText("prac-2" + "w2", row.w2) // second word presentation (at least 2 words will be presented)
      .css({ "font-size": wFontSize })
      .print("center at 50vw", "middle at 50vh"),
    newTimer("prac-2" + "w2-time", interveningWTime)
      .start()
      .wait(),
    getText("prac-2" + "w2").remove(),
    newTimer("prac-2" + "whitescreen-w2", 100)
      .start()
      .wait(),
    newVar("prac-2" + "longerthan2", row.nw > 2) // if rand is greater than 2, present the third word
      .test.is(true)
      .success(
        newText("prac-2" + "w3", row.w3)
          .css({ "font-size": wFontSize })
          .print("center at 50vw", "middle at 50vh"),
        newTimer("prac-2" + "w3-time", interveningWTime)
          .start()
          .wait(),
        getText("prac-2" + "w3").remove(),
        newTimer("whitescreen-w3", 100).start().wait()
      ),
    newVar("prac-2" + "longerthan3", row.nw > 3) // if rand is greater than 3, present the fourth word
      .test.is(true)
      .success(
        newText("prac-2" + "w4", row.w4)
          .css({ "font-size": wFontSize })
          .print("center at 50vw", "middle at 50vh"),
        newTimer("prac-2" + "w4-time", interveningWTime)
          .start()
          .wait(),
        getText("prac-2" + "w4").remove(),
        newTimer("prac-2" + "whitescreen-w4", 100)
          .start()
          .wait()
      ),
    // MAIN DISTRACTOR // maybe find better words for this
    newText("prac-2" + "-trigger", row.trigger)
      .css({ "font-size": "100" })
      .color("red")
      .print("center at 50vw", "middle at 50vh"),
    newTimer("prac-2" + "-trig-red", redTrigTime)
      .start()
      .wait(),
    getVoiceRecorder(
      row.id + "_" + "prac-2" + "_" + subject_id,
      "audio"
    ).stop(),
    getText("prac-2" + "-trigger").remove(),
    newTimer(300).start().wait(),
    newText("Press any key to proceed")
      .css({ "font-size": proceedFontSize })
      .print("center at 50vw", "middle at 50vh"),
    newKey("").wait()
  ).setOption("hideProgressBar", true)
).setOption("hideProgressBar", true);






// !! EXPSTART =============================================================================================
newTrial(
  "prac-transition6",
  newText(
    "prac-transition6-body",
    "<p>Great job! Let's begin the experiment now. " +
      "<p>Press any key to proceed to the experiment"
  )
    .css({ "font-size": bodyFontSize, "text-align": "center" })
    .center()
    .print(),
  newTimer(300).start().wait(),
  newAudio("Transition6Audio", "Transition6.mp3").play(),
  newTimer(1000).start().wait(),
  newKey("prac-transition6-pass", "").wait(),
  getAudio("Transition6Audio").wait("first")
);

newTrial(
  "prac-transition7",
  newText(
    "prac-transition7-body",
    "<p>Remember, you'll read each word of the sentence aloud " +
      "and memorize the sentence. " +
      "Try to picture the scene described in the sentence. " +
      "Then, you'll see some random words and read them aloud. " +
      "The number of these words will vary from trial to trial. " +
      "When one of the random words turns red, say the sentence that you memorized." +
      "There will be a brief pause between trials. " +
      "<p>Before continuing, please double-check " +
      "that you are in a quiet environment with minimal or no background noise." +
      "<p>Press any key to proceed to the experiment"
  )
    .css({ "font-size": bodyFontSize, "text-align": "center" })
    .center()
    .print(),
  newTimer(300).start().wait(),
  newAudio("Transition7Audio", "Intro9.mp3").play(),
  newTimer(1000).start().wait(),
  newKey("prac-transition7-pass", "").wait(),
  getAudio("Transition7Audio").wait("first")
);

// ! EXPERIMENT =============================================================================================
// This creates a trial labeled 'async' that will upload all the samples recorded by the time it is run
UploadRecordings("async", "noblock");

READY("prac-before-exp");

var trial = (label) => (row) => {
  return newTrial(
    label,
    newText("ast-preRSVP", "****") // Present Asterisk
      .css({ "font-size": "70", "text-align": "center" })
      .print("center at 50vw", "middle at 50vh"),
    newTimer("ast-preRSVP", astTime).start().wait(), // Asterisk Timer
    getText("ast-preRSVP").remove(), // Remove Asterisk
    ////

    newMediaRecorder(
      row.head +
        "_" +
        row.verb_type +
        "_" +
        row.trigger_type +
        "_" +
        subject_id,
      "audio"
    ).record(), // TIMER
    newTimer("whitescreen-preRSVP", 100).start().wait(), // 100 ms white screen

    // RSVP TARGET
    newController("DashedSentence", {
      s: row.target,
      mode: "speeded acceptability",
      display: "in place",
      wordTime: RSVPTime,
      wordPauseTime: 100,
    })
      .log()
      .css({ "font-size": "100" })
      .print("center at 50vw", "middle at 50vh")
      .wait()
      .remove(),
    ////

    newTimer("whitescreen-postRSVP", 100).start().wait(), // 100 ms white screen

    // Asterisk
    newText("ast-postRSVP", "****") // Present Asterisk
      .css({ "font-size": "70" })
      .print("center at 50vw", "middle at 50vh"),
    newTimer("ast-postRSVP", astTime).start().wait(), // Asterisk Timer
    getText("ast-postRSVP").remove(), // Remove Asterisk
    ////

    // RANDOM WORD PRESENTATION
    (numbers = [2, 3, 4]), // possible number of words in beetween
    (rand = numbers[(Math.random() * numbers.length) | 0]), // choose one of them
    newText("trigger-black-first", row.trigger)
      .css({ "font-size": wFontSize })
      .print("center at 50vw", "middle at 50vh"),
    newTimer("triger-black-first", interveningWTime).start().wait(),
    getText("trigger-black-first").remove(),

    newText("w1", row.w1) // first word presentation
      .css({ "font-size": wFontSize })
      .print("center at 50vw", "middle at 50vh"),
    newTimer("w1-time", interveningWTime).start().wait(), // wait for 1500 miliseconds
    getText("w1").remove(),
    newTimer("whitescreen-w1", 100).start().wait(),
    newText("w2", row.w2) // second word presentation (at least 2 words will be presented)
      .css({ "font-size": wFontSize })
      .print("center at 50vw", "middle at 50vh"),
    newTimer("w2-time", interveningWTime).start().wait(),
    getText("w2").remove(),
    newTimer("whitescreen-w2", 100).start().wait(),
    newVar("longerthan2", rand > 2) // if rand is greater than 2, present the third word
      .test.is(true)
      .success(
        newText("w3", row.w3)
          .css({ "font-size": wFontSize })
          .print("center at 50vw", "middle at 50vh"),
        newTimer("w3-time", interveningWTime).start().wait(),
        getText("w3").remove(),
        newTimer("whitescreen-w3", 100).start().wait()
      ),
    newVar("longerthan3", rand > 3) // if rand is greater than 3, present the fourth word
      .test.is(true)
      .success(
        newText("w4", row.w4)
          .css({ "font-size": wFontSize })
          .print("center at 50vw", "middle at 50vh"),
        newTimer("w4-time", interveningWTime).start().wait(),
        getText("w4").remove(),
        newTimer("whitescreen-w4", 100).start().wait()
      ),
    ////
    // TIMER
    // MAIN DISTRACTOR // maybe find better words for this
    newText("trigger-black", row.trigger)
      .css({ "font-size": "100" })
      .print("center at 50vw", "middle at 50vh"),
    newTimer("triger-black", blackTrigTime).start().wait(),
    getText("trigger-black").remove(),
    newText("trigger-red", row.trigger)
      .css({ "font-size": "100" })
      .color("red")
      .print("center at 50vw", "middle at 50vh"),
    newTimer("trigger-red", redTrigTime).start().wait(),
    getText("trigger-red").remove(),
    getVoiceRecorder(
      row.head +
        "_" +
        row.verb_type +
        "_" +
        row.trigger_type +
        "_" +
        subject_id,
      "audio"
    ).stop(),
    newTimer(300).start().wait(),
    newText("Press any key to proceed")
      .css({ "font-size": proceedFontSize })
      .print("center at 50vw", "middle at 50vh"),
    newTimer("3s", ProceedTimeOut).start(),
    newKey("").log("last").callback(getTimer("3s").stop()),
    getTimer("3s").wait(),
    // SAVE METADATA
    getVar("head").set(row.head),
    getVar("verb_type").set(row.verb_type),
    getVar("trigger").set(row.trigger),
    getVar("trigger_type").set(row.trigger_type),
    getVar("itemnum").set(row.item),
    getVar("nw").set(rand),
    getVar("w1").set(row.w1),
    getVar("w2").set(row.w2),
    getVar("w3").set(row.w3),
    getVar("w4").set(row.w4)
  ).setOption("hideProgressBar", true);
};

Template(GetTable(fname).filter("head", /ballerina/), trial("trial_ballerina"));
Template(GetTable(fname).filter("head", /lifeguard/), trial("trial_lifeguard"));
Template(GetTable(fname).filter("head", /chef/), trial("trial_chef"));
Template(GetTable(fname).filter("head", /clown/), trial("trial_clown"));
Template(GetTable(fname).filter("head", /cowboy/), trial("trial_cowboy"));
Template(GetTable(fname).filter("head", /dog/), trial("trial_dog"));
Template(GetTable(fname).filter("head", /monkey/), trial("trial_monkey"));
Template(GetTable(fname).filter("head", /octopus/), trial("trial_octopus"));
Template(GetTable(fname).filter("head", /penguin/), trial("trial_penguin"));
Template(GetTable(fname).filter("head", /pirate/), trial("trial_pirate"));
Template(GetTable(fname).filter("head", /rabbit/), trial("trial_rabbit"));
Template(GetTable(fname).filter("head", /snail/), trial("trial_snail"));

newTrial(
  "break",
  newText(
    "Let's take a short break! Press any key to continue when you are ready."
  )
    .css({ "font-size": headerFontSize })
    .print("center at 50vw", "middle at 50vh"),
  newKey("anykey58", "").wait()
);

// ! EXIT ===================================================================================================
SendResults("send_results");

newTrial(
  "bye1",
      newText(
        "confirmation",
        "This is the end of the experiment. Thank you for participating!" +
          "<p> The recordings were sent to the server. Click the Download Recordings button below if you want to have a copy of your recordings." +
          "<p> Click Next to receive a PROLIFIC code."
      ).print(),
  newText("download", DownloadRecordingButton("Download recordings")).print(),
  newButton("Next").center().settings.css("margin", "40px").print().wait()
);

newTrial(
  "bye2",
  newText("confirmation", "Thank you for participating in our study!")
    .center()
    .print(),
  newText(".   ") // Adding space for formatting
    .print()
    .color("white"),
  newText(
    "The experiment code is C12GDTTH  " +
      "Please paste this value into Prolific." +
      "<p>You can also confirm your participation on Prolific by clicking the link below: " +
      "<a href='https://app.prolific.com/submissions/complete?cc=C12GDTTH'>Confirm your participation.</a>" +
      "<p>When you are finished, you may close this tab."
  )
    .center()
    .bold()
    .print(),
  newTimer("infinite", 1000).wait()
);
