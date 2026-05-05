PennController.ResetPrefix(null);
PennController.DebugOff();
var counterOverride = 0;
PennController.SetCounter("setcounter");

// CONSTANTS
const astTime = 450;
const blank_time = 300;
const math_time = 2500;
const recall_time = 9000;
const wFontSize = "50";
const proceedFontSize = "100";
const bodyFontSize = "22";
var headerFontSize = "36";
const sonaURL = "https://umlinguistics.sona-systems.com/.......";

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
  var sum = d1 + d2;
  return { question: d1 + " + " + d2 + " = ?", d1: d1, d2: d2, sum: sum };
}

function instructionTrial(name, html) {
  return newTrial(
    name,
    newText(html)
      .css({ "font-size": bodyFontSize, "line-height": "125%" })
      .center()
      .print(),
    newKey(name + "-pass", " ").wait(),
  );
}

function buttonTrial(name, btnLabel, html) {
  return newTrial(
    name,
    newText(html)
      .css({ "font-size": bodyFontSize, "line-height": "125%" })
      .print(),
    newButton(name + "-btn", btnLabel)
      .center()
      .settings.css("margin", "40px")
      .print()
      .wait(),
  );
}

function asteriskBlock(prefix) {
  return [
    newText(prefix + "-ast", "****")
      .css({ "font-size": "70", "text-align": "center" })
      .print("center at 50vw", "middle at 50vh"),
    newTimer(prefix + "-ast-t", astTime).start().wait(),
    getText(prefix + "-ast").remove(),
  ];
}

function dashedSentence(s) {
  return newController("DashedSentence", { s: s })
    .log()
    .css({ "font-size": wFontSize })
    .print("center at 50vw", "middle at 50vh")
    .wait()
    .remove();
}

function mathScaleBlock(prefix, math) {
  return [
    newText(prefix + "-math", math.question)
      .css({ "font-size": "50", "text-align": "center" })
      .print("center at 50vw", "middle at 50vh"),
    newTimer(prefix + "-math-t", math_time).start(),
    newScale(prefix + "-ans", "1", "2", "3", "4", "5", "6", "7", "8", "9")
      .labelsPosition("bottom")
      .css("margin", "10pt")
      .css("visibility", "hidden")
      .center()
      .keys()
      .callback(getTimer(prefix + "-math-t").stop())
      .print()
      .log(),
    getTimer(prefix + "-math-t").wait(),
    getScale(prefix + "-ans").test.selected(String(math.sum))
      .success(getVar("math_correct").set("correct"))
      .failure(getVar("math_correct").set("incorrect")),
    getText(prefix + "-math").remove(),
    getScale(prefix + "-ans").remove(),
  ];
}

function SepWithN(sep, main, n) {
  this.args = [sep, main];

  this.run = function (arrays) {
    assert(arrays.length == 2, "Wrong number of arguments to SepWithN");
    assert(parseInt(n) > 0, "N must be a positive number");

    const sepArr = arrays[0];
    const mainArr = arrays[1];

    const newArray = [];

    for (let i = 0; i < mainArr.length; i++) {
      newArray.push(mainArr[i]);

      // insert separator every n trials
      if ((i + 1) % n === 0 && i < mainArr.length - 1) {
        for (let j = 0; j < sepArr.length; j++) {
          newArray.push(sepArr[j]);
        }
      }
    }

    return newArray;
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
  newVar("math_d1").global(),
  newVar("math_d2").global(),
  newVar("math_sum").global(),
  newVar("math_correct").global(),
)
  .log("subject_id", subject_id)
  .log("SONA_ID", GetURLParameter("id"))
  .log("trial_type", getVar("trial_type"))
  .log("item_id", getVar("item_id"))
  .log("condition", getVar("condition"))
  .log("head_number", getVar("head_number"))
  .log("attractor_number", getVar("attractor_number"))
  .log("grammaticality", getVar("grammaticality"))
  .log("rec_file", getVar("rec_file"))
  .log("math_d1", getVar("math_d1"))
  .log("math_d2", getVar("math_d2"))
  .log("math_sum", getVar("math_sum"))
  .log("math_correct", getVar("math_correct"));

// CONSENT
newTrial(
  "consent",
  newText(
    "<center><b>Consent Form</b></center>" +
      "<p>Please click <a target='_blank' rel='noopener noreferrer' href='https://utkuturk.com/files/web_consent.pdf'>here</a> to download the consent form for this study. If you read it and agree to participate, click 'I AGREE' below. If you do not agree, you may close this tab. You can leave the experiment at any time by closing the tab. If you leave before completion, you will not be compensated. If you encounter any problems, please contact us by email." +
      "<br><br><b>Researchers:</b><br>Sebastián Mancha, PhD Student <i>(mancha@umd.edu)</i><br>Utku Turk, PhD Student <i>(utkuturk@umd.edu)</i><br>Assoc. Prof. Ellen Lau<br>Prof. Colin Phillips<br>University of Maryland, Department of Linguistics"
  ).css(text_css).print(),
  newButton("agree", "I AGREE").bold().css(button_css).center().print().wait()
).setOption("hideProgressBar", true);

// RECORDING SETUP
InitiateRecorder(
  "https://p1f1zmaix0.execute-api.us-east-2.amazonaws.com/default/recall-lambda",
).label("initiate_recorder");

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
buttonTrial(
  "inst-1",
  "Next",
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
);

buttonTrial(
  "inst-2",
  "Proceed to Introduction Section",
  "<center><b>Instructions</b></center>" +
    "<p>Please move to a quiet environment so that there are no background sounds " +
    "(e.g. music, television, voices) that will be picked up in the audio recordings. " +
    "Please also silence computer notifications or use headphones " +
    "(note that there will be audio during the experiment, so please do not mute your computer)." +
    "<p>When you are ready, please turn off any distractions " +
    "such as music, television, or your cell phone for the duration of the experiment, " +
    "and click below to begin the introduction section. Thank you!",
);

// INTRO 1 - explain SPR reading
instructionTrial(
  "Intro1",
  "<center><b>Introduction</b></center>" +
    "<p>In this experiment, you will see sentences presented word-by-word. " +
    "For each sentence, press the <b>SPACE</b> bar to reveal each word one at a time. " +
    "Please read each sentence silently, in your head." +
    "<p>Let's try an example. Press SPACE to start.",
);

newTrial(
  "Intro1Demo",
  ...asteriskBlock("i1d"),
  dashedSentence("The cat near the yarn is purring."),
  newTimer("i1d-blank", blank_time).start().wait(),
).setOption("hideProgressBar", true);

// INTRO 2 - explain math
instructionTrial(
  "Intro2",
  "<center><b>Introduction</b></center>" +
    "<p>After reading each sentence, there will be a brief pause, " +
    "then you will see a simple addition problem. " +
    "Use the number keys (1-9) on your keyboard to answer it. " +
    "You have about 2.5 seconds. Don't worry if you miss one!" +
    "<p>Let's try an example. Press SPACE to start.",
);

newTrial(
  "Intro2Demo",
  ...asteriskBlock("i2d"),
  dashedSentence("The marker on the desk is yellowish green."),
  newTimer("i2d-blank1", blank_time).start().wait(),
  ...mathScaleBlock("i2d", { question: "2 + 3 = ?", d1: 2, d2: 3, sum: 5 }),
  newTimer("i2d-blank2", blank_time).start().wait(),
).setOption("hideProgressBar", true);

// INTRO 3 - explain recall
instructionTrial(
  "Intro3",
  "<center><b>Introduction</b></center>" +
    "<p>After the math problem, you will see a <b>RECORDING...</b> prompt. " +
    "This is when you should say the sentence out loud, as best as you can recall it. " +
    "You have up to 9 seconds, or you can click <b>Done speaking</b> when you finish, or hit the space bar." +
    "<p>Try to recall the sentence accurately. It's ok to be imperfect. " +
    "Avoid saying things unrelated to the sentence, like 'um' or 'I forget'." +
    "<p>Let's try a full example. Press SPACE to start.",
);

newTrial(
  "Intro3Demo",
  ...asteriskBlock("i3d"),
  dashedSentence("The frog on the lilypad is relaxing."),
  newTimer("i3d-blank1", blank_time).start().wait(),
  ...mathScaleBlock("i3d", { question: "1 + 4 = ?", d1: 1, d2: 4, sum: 5 }),
  newTimer("i3d-blank2", blank_time).start().wait(),
  newMediaRecorder("intro_demo_" + subject_id, "audio").record(),
  newText("i3d-rec", "RECORDING...")
    .css({ "font-size": "40px", "text-align": "center", color: "darkred" })
    .bold()
    .print("center at 50vw", "middle at 50vh"),
  newTimer("i3d-rec-t", recall_time).start(),
  newButton("i3d-rec-btn", "Done speaking")
    .center()
    .print("center at 50vw", "top at 55vh")
    .callback(getTimer("i3d-rec-t").stop()),
  newKey(" ") 
    .callback( getButton("i3d-rec-btn").click() ), // spacebar to move on
  getTimer("i3d-rec-t").wait(),
  getMediaRecorder("intro_demo_" + subject_id).stop(),
  getText("i3d-rec").remove(),
  getButton("i3d-rec-btn").remove(),
).setOption("hideProgressBar", true);

instructionTrial(
  "Intro4",
  "<center><b>Introduction</b></center>" +
    "<p>Great! Now you understand the task. " +
    "We will now do some practice trials before the actual experiment." +
    "<p>Press SPACE to begin practice.",
);

// PRACTICE
instructionTrial(
  "prac-intro",
  "<center><b>Practice</b></center>" +
    "<p>Let's do 6 practice trials. Each trial works like this: " +
    "read the sentence word by word, answer the math problem, " +
    "then recall the sentence out loud when you see <b>RECORDING...</b>." +
    "<p>Press SPACE to start.",
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
  var math = randomMath();
  return newTrial(
    "prac-full",
    ...asteriskBlock("pf"),
    dashedSentence(row.target),
    newTimer("pf-blank1", blank_time).start().wait(),
    ...mathScaleBlock("pf", math),
    newTimer("pf-blank2", blank_time).start().wait(),
    newMediaRecorder("prac_" + row.id + "_" + subject_id, "audio").record(),
    newText("pf-rec", "RECORDING...")
      .css({ "font-size": "40px", "text-align": "center", color: "darkred" })
      .bold()
      .print("center at 50vw", "middle at 50vh"),
    newTimer("pf-rec-t", recall_time).start(),
    newButton("pf-rec-btn", "Done speaking")
      .center()
      .print("center at 50vw", "top at 55vh")
      .callback(getTimer("pf-rec-t").stop()),
    newKey(" ") 
      .callback( getButton("pf-rec-btn").click() ), // spacebar to move on
    getTimer("pf-rec-t").wait(),
    getMediaRecorder("prac_" + row.id + "_" + subject_id).stop(),
    getText("pf-rec").remove(),
    getButton("pf-rec-btn").remove(),
    getVar("math_d1").set(math.d1),
    getVar("math_d2").set(math.d2),
    getVar("math_sum").set(math.sum),
  ).setOption("hideProgressBar", true);
});

buttonTrial(
  "prac-done",
  "Begin Experiment",
  "<p>Great job! You're ready for the experiment." +
    "<p>Remember: read the sentence word by word, answer the math problem with your keyboard, " +
    "then recall the sentence word-for-word out loud when you see <b>RECORDING...</b>. " +
    "Then, finish the recording by pressing space bar or the button on your screen and move on." +
    "<p>Please make sure you are in a quiet environment with minimal background noise.",
);

// UPLOAD (blocking, runs after all trials)
UploadRecordings("upload");

// FILLERS
Template("fillers.csv", (row) => {
  var math = randomMath();
  var recFile = subject_id + "_fill_" + row.FillerNo;
  return newTrial(
    "filler",
    ...asteriskBlock("fill"),
    dashedSentence(row.Sentence),
    newTimer("fill-blank1", blank_time).start().wait(),
    ...mathScaleBlock("fill", math),
    newTimer("fill-blank2", blank_time).start().wait(),
    newMediaRecorder(recFile, "audio").record(),
    newText("fill-rec", "RECORDING...")
      .css({ "font-size": "40px", "text-align": "center", color: "darkred" })
      .bold()
      .print("center at 50vw", "middle at 50vh"),
    newTimer("fill-rec-t", recall_time).start(),
    newButton("fill-rec-btn", "Done speaking")
      .center()
      .print("center at 50vw", "top at 55vh")
      .callback(getTimer("fill-rec-t").stop()),
    newKey(" ") 
      .callback( getButton("fill-rec-btn").click() ), // spacebar to move on
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
    getVar("math_d1").set(math.d1),
    getVar("math_d2").set(math.d2),
    getVar("math_sum").set(math.sum),
  ).setOption("hideProgressBar", true);
});

// EXPERIMENTAL ITEMS
Template("stim.csv", (row) => {
  var math = randomMath();
  var recFile = subject_id + "_exp_" + row.item + "_" + row.condition;
  return newTrial(
    "experimental",
    ...asteriskBlock("exp"),
    dashedSentence(row.sentence),
    newTimer("exp-blank1", blank_time).start().wait(),
    ...mathScaleBlock("exp", math),
    newTimer("exp-blank2", blank_time).start().wait(),
    newMediaRecorder(recFile, "audio").record(),
    newText("exp-rec", "RECORDING...")
      .css({ "font-size": "40px", "text-align": "center", color: "darkred" })
      .bold()
      .print("center at 50vw", "middle at 50vh"),
    newTimer("exp-rec-t", recall_time).start(),
    newButton("exp-rec-btn", "Done speaking")
      .center()
      .print("center at 50vw", "top at 55vh")
      .callback(getTimer("exp-rec-t").stop()),
    newKey(" ") 
      .callback( getButton("exp-rec-btn").click() ), // spacebar to move on
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
    getVar("math_d1").set(math.d1),
    getVar("math_d2").set(math.d2),
    getVar("math_sum").set(math.sum),
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
    "<p><a href='" + sonaURL + GetURLParameter("id") + "' target='_blank'>" +
      "Click here to confirm your participation on SONA!</a></p>" +
      "<p>This is a necessary step in order for you to receive participation credit!</p>" +
      "If you have any problems with this step, please email utkuturk@umd.edu" +
      "<p>When you are finished, you may close this tab.",
  )
    .center()
    .bold()
    .print(),
  newButton().wait(),
);
