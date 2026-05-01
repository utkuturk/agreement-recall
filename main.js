PennController.ResetPrefix(null);
PennController.DebugOff();
var counterOverride = 0;
PennController.SetCounter("setcounter");

// CONSTANTS
const astTime = 450;
const blank_time = 300;
const math_time = 2500;
const recall_time = 9000;
const wFontSize = "100";
const proceedFontSize = "100";
const bodyFontSize = "22";
var headerFontSize = "36";

var header = { "font-size": headerFontSize, "text-align": "center" };

var text_css = {
  "font-size": bodyFontSize,
  "line-height": "150%",
  "text-align": "justify",
};
var page_css = {
  border: "1px solid #ccc",
  padding: "20px",
  "border-radius": "5px",
};
var button_css = {
  "font-size": bodyFontSize,
  padding: "10px 30px",
  margin: "20px",
};

// FUNCTIONS
function getRandomStr() {
  const LENGTH = 8;
  const SOURCE = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < LENGTH; i++) {
    result += SOURCE[Math.floor(Math.random() * SOURCE.length)];
  }
  return result;
}
const subject_id = getRandomStr();

function randomMath() {
  var d1 = Math.floor(Math.random() * 4) + 1; // 1-4
  var d2 = Math.floor(Math.random() * 4) + 1; // 1-4, sum 2-8 stays within 1-9 scale
  return d1 + " + " + d2 + " = ?";
}

function SepWithN(sep, main, n) {
  this.args = [sep, main];
  this.run = function (arrays) {
    assert(
      arrays.length == 2,
      "Wrong number of arguments (or bad argument) to SepWithN",
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

// SEQUENCE
Sequence(
  "setcounter",
  "consent",
  "initiate_recorder",
  "recording_test",
  "preloadTrial",
  startsWith("inst-"),
  startsWith("Intro"),
  startsWith("prac-"),
  sepWithN("break", rshuffle("filler", "experimental"), 24),
  "upload",
  "send_results",
  "bye1",
  "bye2",
);

// HEADER
Header(
  newVar("trial_type").global(),
  newVar("item_id").global(),
  newVar("condition").global(),
  newVar("head_number").global(),
  newVar("attractor_number").global(),
  newVar("grammaticality").global(),
  newVar("rec_file").global(),
)
  .log("subject_id", subject_id)
  .log("SONA_ID", GetURLParameter("id"))
  .log("trial_type", getVar("trial_type"))
  .log("item_id", getVar("item_id"))
  .log("condition", getVar("condition"))
  .log("head_number", getVar("head_number"))
  .log("attractor_number", getVar("attractor_number"))
  .log("grammaticality", getVar("grammaticality"))
  .log("rec_file", getVar("rec_file"));

// CONSENT
newTrial(
  "consent",
  defaultText.css(text_css),
  newText(
    "consent-body",
    "<center><b>Consent Form</b></center>" +
      "<p>Please click <a target='_blank' rel='noopener noreferrer' href='https://utkuturk.com/files/web_consent.pdf'> here</a> to download the consent form for this study. If you read it and agree to participate in this study, click 'I Agree' below. If you do not agree to participate in this study, you can leave this study by closing the tab. You can leave the experiment at any time by closing the tab during the experiment. If you leave the experiment before completion of both parts, you will not be compensated for your time. If you encounter any problems, do not hesitate to reach us either via " +
      "email. " +
      "<br><br><b> Researchers:</b> <br>Sebastián Mancha, PhD Student <i> (smancha@umd.edu)</i>,<br>Utku Turk, PhD Student <i> (utkuturk@umd.edu)</i><br>Assoc. Prof. Ellen Lau<br>Prof. Colin Phillips<br>University of Maryland, Department of Linguistics",
  ),
  newCanvas("consent-page", 1500, 500)
    .add(100, 20, newImage("umd_ling.png").size("60%", "auto"))
    .add(0, 120, getText("consent-body"))
    .cssContainer(page_css)
    .print(),
  newText("<p>").print(),
  newButton("agree", "I AGREE").bold().css(button_css).print().wait(),
).setOption("hideProgressBar", true);

CheckPreloaded().label("preloadTrial");

// RECORDING SETUP
InitiateRecorder(
  "https://p1f1zmaix0.execute-api.us-east-2.amazonaws.com/default/recall-lambda",
).label("initiate_recorder"); // !!! TODO

newTrial(
  "recording_test",
  newText(
    "rec-t1",
    "This experiment involves audio recording. Before you start the experiment, please test your recording.",
  )
    .bold()
    .print(),
  newText("rec-sp1", "   ").print().color("white"),
  newText(
    "rec-t2",
    "Please record yourself saying the sentence 'This is a test' (this recording will be saved). To start the recording, press the Record button below. To stop the recording, press it again. To test whether your voice was recorded, click the play button.",
  ).print(),
  newText("rec-sp2", "   ").print().color("white"),
  newVoiceRecorder("test-recorder").print(),
  newText("rec-sp3", "   ").print().color("white"),
  newText(
    "rec-t3",
    "Make sure you can hear your voice clearly in the playback before you continue. <b>Please do not hesitate to test recording yourself multiple times to adjust your volume, and make sure you can hear your voice clearly in the playback before you continue.</b>",
  ).print(),
  newText("rec-sp4", "   ").print().color("white"),
  newText(
    "rec-t4",
    "During the experiment, recordings will start and stop automatically. There is a notification at the top of the page that will indicate when audio is being recorded.",
  ).print(),
  newText("rec-sp5", "   ").print().color("white"),
  newButton("rec-continue", "Click here to continue")
    .print()
    .wait(
      getVoiceRecorder("test-recorder")
        .test.recorded() // !TODO: maybe add test played as well?
        .failure(
          newText(
            "rec-warn",
            "Please test your audio recording before continuing",
          )
            .color("red")
            .print(),
        ),
    ),
);

// INSTRUCTIONS
newTrial(
  "inst-1",
  newText(
    "<center><b>Instructions</b></center>" +
      "<p>Please read these instruction sections carefully! " +
      "If you fail to understand the task, your data will NOT be usable." +
      "<p>In this experiment, you will read some sentences word-by-word by pressing 'space' and later recall them. " +
      "Your voice will be recorded while you recall these sentences." +
      "<p>This experiment requires your FULL ATTENTION. " +
      "The experiment is reasonably brief. Most people find that the study takes around XXXX minutes. " + // !!! TODO
      "During this time, you must give your complete attention." +
      "<p>Before proceeding please make sure:<ol>" +
      "<li>You are using your <b>computer</b>, and not your phone or tablet,</li>" +
      "<li>You are using <b>Google Chrome</b>, and not Safari or Firefox,</li>" +
      "<li>You have a <b>working mouse/trackpad and keyboard</b>,</li>" +
      "<li>You are <b>between the ages of 18 - 30</b>,</li>" +
      "<li>This is your <b>first time doing this experiment</b>,</li>" +
      "<li>You were able to record yourself and listen to your recording.</li></ol>",
  )
    .css({ "font-size": bodyFontSize, "line-height": "125%" })
    .print(),
  newButton("inst1-next", "Next")
    .center()
    .settings.css("margin", "40px")
    .print()
    .wait(),
);

newTrial(
  "inst-2",
  newText(
    "<center><b>Instructions</b></center>" +
      "<p>Please move to a quiet environment so that there are no background sounds " +
      "(e.g. music, television, voices) that will be picked up in the audio recordings. " +
      "Please also silence computer notifications or use headphones " +
      "(note that there will be audio during the experiment, so please do not mute your computer)." +
      "<p>When you are ready, please turn off any distractions " +
      "such as music, television, or your cell phone for the duration of the experiment, " +
      "and click below to begin the introduction section. Thank you!",
  )
    .css({ "font-size": bodyFontSize, "line-height": "125%" })
    .print(),
  newButton("inst2-next", "Proceed to Introduction Section")
    .center()
    .settings.css("margin", "40px")
    .print()
    .wait(),
);

// INTRO 1 - explain SPR reading
newTrial(
  "Intro1",
  newText(
    "<center><b>Introduction</b></center>" +
      "<p>In this experiment, you will see sentences presented word-by-word. " +
      "For each sentence, press the <b>SPACE</b> bar to reveal each word one at a time. " +
      "Please read each sentence silently, in your head." +
      "<p>Let's try an example. Press SPACE to start.",
  )
    .css({ "font-size": bodyFontSize, "line-height": "125%" })
    .center()
    .print(),
  newKey("Intro1-pass", " ").wait(),
);

newTrial(
  "Intro1Demo",
  newText("i1d-ast", "****")
    .css({ "font-size": "70", "text-align": "center" })
    .print("center at 50vw", "middle at 50vh"),
  newTimer("i1d-ast-t", astTime).start().wait(),
  getText("i1d-ast").remove(),
  newController("DashedSentence", { s: "The cat near the yarn is purring." })
    .log()
    .css({ "font-size": wFontSize })
    .print("center at 50vw", "middle at 50vh")
    .wait()
    .remove(),
  newTimer("i1d-blank", blank_time).start().wait(),
).setOption("hideProgressBar", true);

// INTRO 2 - explain math
newTrial(
  "Intro2",
  newText(
    "<center><b>Introduction</b></center>" +
      "<p>After reading each sentence, there will be a brief pause, " +
      "then you will see a simple addition problem. " +
      "Use the number keys (1-9) on your keyboard to answer it. " +
      "You have about 2.5 seconds. Don't worry if you miss one!" +
      "<p>Let's try an example. Press SPACE to start.",
  )
    .css({ "font-size": bodyFontSize, "line-height": "125%" })
    .center()
    .print(),
  newKey("Intro2-pass", " ").wait(),
);

newTrial(
  "Intro2Demo",
  newText("i2d-ast", "****")
    .css({ "font-size": "70", "text-align": "center" })
    .print("center at 50vw", "middle at 50vh"),
  newTimer("i2d-ast-t", astTime).start().wait(),
  getText("i2d-ast").remove(),
  newController("DashedSentence", {
    s: "The marker on the desk is yellowish green.",
  })
    .log()
    .css({ "font-size": wFontSize })
    .print("center at 50vw", "middle at 50vh")
    .wait()
    .remove(),
  newTimer("i2d-blank1", blank_time).start().wait(),
  newText("i2d-math", "2 + 3 = ?")
    .css({ "font-size": "50", "text-align": "center" })
    .print("center at 50vw", "middle at 50vh"),
  newTimer("i2d-math-t", math_time).start(),
  newScale("i2d-ans", "1", "2", "3", "4", "5", "6", "7", "8", "9")
    .labelsPosition("bottom")
    .css("margin", "10pt")
    .center()
    .keys()
    .callback(getTimer("i2d-math-t").stop())
    .print()
    .log(),
  getTimer("i2d-math-t").wait(),
  getText("i2d-math").remove(),
  getScale("i2d-ans").remove(),
  newTimer("i2d-blank2", blank_time).start().wait(),
).setOption("hideProgressBar", true);

// INTRO 3 - explain recall
newTrial(
  "Intro3",
  newText(
    "<center><b>Introduction</b></center>" +
      "<p>After the math problem, you will see a <b>RECORDING...</b> prompt. " +
      "This is when you should say the sentence out loud, as best as you can recall it. " +
      "You have up to 9 seconds, or you can click <b>Done speaking</b> when you finish." +
      "<p>Try to recall the sentence accurately. It's ok to be imperfect. " +
      "Avoid saying things unrelated to the sentence, like 'um' or 'I forget'." +
      "<p>Let's try a full example. Press SPACE to start.",
  )
    .css({ "font-size": bodyFontSize, "line-height": "125%" })
    .center()
    .print(),
  newKey("Intro3-pass", " ").wait(),
);

newTrial(
  "Intro3Demo",
  newText("i3d-ast", "****")
    .css({ "font-size": "70", "text-align": "center" })
    .print("center at 50vw", "middle at 50vh"),
  newTimer("i3d-ast-t", astTime).start().wait(),
  getText("i3d-ast").remove(),
  newController("DashedSentence", { s: "The frog on the lilypad is relaxing." })
    .log()
    .css({ "font-size": wFontSize })
    .print("center at 50vw", "middle at 50vh")
    .wait()
    .remove(),
  newTimer("i3d-blank1", blank_time).start().wait(),
  newText("i3d-math", "1 + 4 = ?")
    .css({ "font-size": "50", "text-align": "center" })
    .print("center at 50vw", "middle at 50vh"),
  newTimer("i3d-math-t", math_time).start(),
  newScale("i3d-ans", "1", "2", "3", "4", "5", "6", "7", "8", "9")
    .labelsPosition("bottom")
    .css("margin", "10pt")
    .center()
    .keys()
    .callback(getTimer("i3d-math-t").stop())
    .print()
    .log(),
  getTimer("i3d-math-t").wait(),
  getText("i3d-math").remove(),
  getScale("i3d-ans").remove(),
  newTimer("i3d-blank2", blank_time).start().wait(),
  newMediaRecorder("intro_demo_" + subject_id, "audio").record(),
  newText("i3d-rec", "RECORDING...")
    .css({ "font-size": "40px", "text-align": "center", color: "darkred" })
    .bold()
    .print("center at 50vw", "middle at 50vh"),
  newTimer("i3d-rec-t", recall_time).start(),
  newButton("i3d-rec-btn", "Done speaking")
    .center()
    .print()
    .callback(getTimer("i3d-rec-t").stop()),
  getTimer("i3d-rec-t").wait(),
  getMediaRecorder("intro_demo_" + subject_id).stop(),
  getText("i3d-rec").remove(),
  getButton("i3d-rec-btn").remove(),
).setOption("hideProgressBar", true);

newTrial(
  "Intro4",
  newText(
    "<center><b>Introduction</b></center>" +
      "<p>Great! Now you understand the task. " +
      "We will now do some practice trials before the actual experiment." +
      "<p>Press SPACE to begin practice.",
  )
    .css({ "font-size": bodyFontSize, "line-height": "125%" })
    .center()
    .print(),
  newKey("Intro4-pass", " ").wait(),
);

// PRACTICE
newTrial(
  "prac-intro",
  newText(
    "<center><b>Practice</b></center>" +
      "<p>Let's do 6 practice trials. Each trial works like this: " +
      "read the sentence word by word, answer the math problem, " +
      "then recall the sentence out loud when you see <b>RECORDING...</b>." +
      "<p>Press SPACE to start.",
  )
    .css({ "font-size": bodyFontSize, "line-height": "125%" })
    .center()
    .print(),
  newKey("prac-intro-pass", " ").wait(),
);

AddTable(
  "prac-table",
  "id,target\n" +
    "1,The cat near the yarn is purring.\n" +
    "2,The frog on the lilypad is relaxing.\n" +
    "3,The singer by the microphone is performing.\n" +
    "4,The wolf in the woods is hunting.\n" +
    "5,The bird on the branch is singing.\n" +
    "6,The kid at the park is playing.",
);

Template("prac-table", (row) => {
  var mathQ = randomMath();
  return newTrial(
    "prac-full",
    newText("pf-ast", "****")
      .css({ "font-size": "70", "text-align": "center" })
      .print("center at 50vw", "middle at 50vh"),
    newTimer("pf-ast-t", astTime).start().wait(),
    getText("pf-ast").remove(),
    newController("DashedSentence", { s: row.target })
      .log()
      .css({ "font-size": wFontSize })
      .print("center at 50vw", "middle at 50vh")
      .wait()
      .remove(),
    newTimer("pf-blank1", blank_time).start().wait(),
    newText("pf-math", mathQ)
      .css({ "font-size": "50", "text-align": "center" })
      .print("center at 50vw", "middle at 50vh"),
    newTimer("pf-math-t", math_time).start(),
    newScale("pf-ans", "1", "2", "3", "4", "5", "6", "7", "8", "9")
      .labelsPosition("bottom")
      .css("margin", "10pt")
      .center()
      .keys()
      .callback(getTimer("pf-math-t").stop())
      .print()
      .log(),
    getTimer("pf-math-t").wait(),
    getText("pf-math").remove(),
    getScale("pf-ans").remove(),
    newTimer("pf-blank2", blank_time).start().wait(),
    newMediaRecorder("prac_" + row.id + "_" + subject_id, "audio").record(),
    newText("pf-rec", "RECORDING...")
      .css({ "font-size": "40px", "text-align": "center", color: "darkred" })
      .bold()
      .print("center at 50vw", "middle at 50vh"),
    newTimer("pf-rec-t", recall_time).start(),
    newButton("pf-rec-btn", "Done speaking")
      .center()
      .print()
      .callback(getTimer("pf-rec-t").stop()),
    getTimer("pf-rec-t").wait(),
    getMediaRecorder("prac_" + row.id + "_" + subject_id).stop(),
    getText("pf-rec").remove(),
    getButton("pf-rec-btn").remove(),
  ).setOption("hideProgressBar", true);
});

newTrial(
  "prac-done",
  newText(
    "<p>Great job! You're ready for the experiment." +
      "<p>Remember: read the sentence word by word, answer the math problem, " +
      "then recall the sentence out loud when you see <b>RECORDING...</b>." +
      "<p>Please make sure you are in a quiet environment with minimal background noise." +
      "<p>Press any key to begin.",
  )
    .css({ "font-size": bodyFontSize, "text-align": "center" })
    .center()
    .print(),
  newKey("prac-done-pass", "").wait(),
);

// UPLOAD (blocking, runs after all trials)
UploadRecordings("upload");

// FILLERS
Template(GetTable("fillers.csv").separator(";"), (row) => {
  var mathQ = randomMath();
  var recFile = subject_id + "_fill_" + row.FillerNo;
  return newTrial(
    "filler",
    newText("fill-ast", "****")
      .css({ "font-size": "70", "text-align": "center" })
      .print("center at 50vw", "middle at 50vh"),
    newTimer("fill-ast-t", astTime).start().wait(),
    getText("fill-ast").remove(),
    newController("DashedSentence", { s: row.Sentence })
      .log()
      .css({ "font-size": wFontSize })
      .print("center at 50vw", "middle at 50vh")
      .wait()
      .remove(),
    newTimer("fill-blank1", blank_time).start().wait(),
    newText("fill-math", mathQ)
      .css({ "font-size": "50", "text-align": "center" })
      .print("center at 50vw", "middle at 50vh"),
    newTimer("fill-math-t", math_time).start(),
    newScale("fill-ans", "1", "2", "3", "4", "5", "6", "7", "8", "9")
      .labelsPosition("bottom")
      .css("margin", "10pt")
      .center()
      .keys()
      .callback(getTimer("fill-math-t").stop())
      .print()
      .log(),
    getTimer("fill-math-t").wait(),
    getText("fill-math").remove(),
    getScale("fill-ans").remove(),
    newTimer("fill-blank2", blank_time).start().wait(),
    newMediaRecorder(recFile, "audio").record(),
    newText("fill-rec", "RECORDING...")
      .css({ "font-size": "40px", "text-align": "center", color: "darkred" })
      .bold()
      .print("center at 50vw", "middle at 50vh"),
    newTimer("fill-rec-t", recall_time).start(),
    newButton("fill-rec-btn", "Done speaking")
      .center()
      .print()
      .callback(getTimer("fill-rec-t").stop()),
    getTimer("fill-rec-t").wait(),
    getMediaRecorder(recFile).stop(),
    getText("fill-rec").remove(),
    getButton("fill-rec-btn").remove(),
    getVar("trial_type").set("filler"),
    getVar("item_id").set(row.FillerNo),
    getVar("condition").set("NA"),
    getVar("head_number").set("NA"),
    getVar("attractor_number").set("NA"),
    getVar("grammaticality").set("NA"),
    getVar("rec_file").set(recFile),
  ).setOption("hideProgressBar", true);
});

// EXPERIMENTAL ITEMS
Template("stim.csv", (row) => {
  var mathQ = randomMath();
  var recFile = subject_id + "_exp_" + row.item + "_" + row.condition;
  return newTrial(
    "experimental",
    newText("exp-ast", "****")
      .css({ "font-size": "70", "text-align": "center" })
      .print("center at 50vw", "middle at 50vh"),
    newTimer("exp-ast-t", astTime).start().wait(),
    getText("exp-ast").remove(),
    newController("DashedSentence", { s: row.sentence })
      .log()
      .css({ "font-size": wFontSize })
      .print("center at 50vw", "middle at 50vh")
      .wait()
      .remove(),
    newTimer("exp-blank1", blank_time).start().wait(),
    newText("exp-math", mathQ)
      .css({ "font-size": "50", "text-align": "center" })
      .print("center at 50vw", "middle at 50vh"),
    newTimer("exp-math-t", math_time).start(),
    newScale("exp-ans", "1", "2", "3", "4", "5", "6", "7", "8", "9")
      .labelsPosition("bottom")
      .css("margin", "10pt")
      .center()
      .keys()
      .callback(getTimer("exp-math-t").stop())
      .print()
      .log(),
    getTimer("exp-math-t").wait(),
    getText("exp-math").remove(),
    getScale("exp-ans").remove(),
    newTimer("exp-blank2", blank_time).start().wait(),
    newMediaRecorder(recFile, "audio").record(),
    newText("exp-rec", "RECORDING...")
      .css({ "font-size": "40px", "text-align": "center", color: "darkred" })
      .bold()
      .print("center at 50vw", "middle at 50vh"),
    newTimer("exp-rec-t", recall_time).start(),
    newButton("exp-rec-btn", "Done speaking")
      .center()
      .print()
      .callback(getTimer("exp-rec-t").stop()),
    getTimer("exp-rec-t").wait(),
    getMediaRecorder(recFile).stop(),
    getText("exp-rec").remove(),
    getButton("exp-rec-btn").remove(),
    getVar("trial_type").set("experimental"),
    getVar("item_id").set(row.item),
    getVar("condition").set(row.condition),
    getVar("head_number").set(row.head_number),
    getVar("attractor_number").set(row.attractor_number),
    getVar("grammaticality").set(row.grammaticality),
    getVar("rec_file").set(recFile),
  ).setOption("hideProgressBar", true);
});

newTrial(
  "break",
  newText(
    "break-text",
    "Let's take a short break! Please keep this to only a moment, to ensure that you finish in proper time. " +
      "Press any key to continue when you are ready.",
  )
    .css({ "font-size": headerFontSize })
    .print("center at 50vw", "middle at 50vh"),
  newKey("break-pass", "").wait(),
);

// EXIT
SendResults("send_results");

newTrial(
  "bye1",
  newText(
    "bye1-text",
    "This is the end of the experiment. Thank you for participating!" +
      "<p>The recordings were sent to the server. Click the Download Recordings button below if you want a copy.",
  ).print(),
  newText("bye1-dl", DownloadRecordingButton("Download recordings")).print(),
  newButton("bye1-next", "Next")
    .center()
    .settings.css("margin", "40px")
    .print()
    .wait(),
);

newTrial(
  "bye2",
  newText("bye2-thanks", "Thank you for participating in our study!")
    .center()
    .print(),
  newText("bye2-sp", "   ").print().color("white"),
  newHtml("debrief", "debrief.html").print(),
  newText(
    "bye2-sona",
    "<p><a href='https://umlinguistics.sona-systems.com/......." +
      GetURLParameter("id") +
      "' target='_blank'>" +
      "Click here to confirm your participation on SONA!</a></p>" +
      "<p>This is a necessary step in order for you to receive participation credit!</p>" +
      "If you have any problems with this step, please email utkuturk@umd.edu" +
      "<p>When you are finished, you may close this tab.",
  )
    .center()
    .bold()
    .print(),
  newTimer("infinite", 99999999).start().wait(),
);
