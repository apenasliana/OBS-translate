
const settings= {
  source: document.querySelector("#select_dialect").value,
  target: 'en-US',
}


window.onload = function () {
  getSpeechRecon();
}
function getSpeechRecon(){ 

  if ("webkitSpeechRecognition" in window) {
    // Initialize webkitSpeechRecognition
    let speechRecognition = new webkitSpeechRecognition();

    // window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
    // String for the Final Transcript
    let final_transcript = "";

    // Set the properties for the Speech Recognition object
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = document.querySelector("#select_dialect").value;


    // Callback Function for the onStart Event
    speechRecognition.onstart = () => {
      // Show the Status Element
      document.querySelector("#status").style.display = "block";
    };
    speechRecognition.onerror = () => {
      // Hide the Status Element
      document.querySelector("#status").style.display = "none";
    };
    speechRecognition.onend = () => {
      // Hide the Status Element
      document.querySelector("#status").style.display = "none";
      speechRecognition.stop()
      getSpeechRecon();
    };
    speechRecognition.onspeechend = function () {
      // document.getElementById('status').innerHTML = "Stopping";
      speechRecognition.stop()
      getSpeechRecon();
  };

    speechRecognition.onresult =  (event) => {
      // Create the interim transcript string locally because we don't want it to persist like final transcript
      let interim_transcript = "";

      // Loop through the results from the speech recognition object.
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        // If the result item is Final, add it to Final Transcript, Else add it to Interim transcript
        if (event.results[i].isFinal) {
          final_transcript = event.results[i][0].transcript;

             
          getTranslation(final_transcript, settings)


          getSpeechRecon();

        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
      // Set the Final transcript and Interim transcript.
      document.querySelector("#final").innerHTML = final_transcript;
      document.querySelector("#interim").innerHTML = interim_transcript;
    };

    // Set the onClick property of the start button
    document.querySelector("#start").onclick = () => {
      // Start the Speech Recognition
      speechRecognition.start();
    };
    // Set the onClick property of the stop button
    document.querySelector("#stop").onclick = () => {
      // Stop the Speech Recognition
      speechRecognition.stop();
      final_transcript = "";

    };
    document.querySelector("#reset").onclick = () => {
      document.querySelector("#final").innerHTML = '';
      document.querySelector("#interim").innerHTML = '';
      final_transcript = "";
    };
  } else {
    console.log("Speech Recognition Not Available");
  }
}

function getTranslation(text,settings) {
  const gs_key=''
  const TRANS_URL = 'https://script.google.com/macros/s/' + gs_key + '/exec';
  let query

  query = TRANS_URL + '?text=' + text + '&source=' + settings.source + '&target=' + settings.target;

  let request = new XMLHttpRequest();
  request.open('GET', query, true);
  
  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
        console.log(request.responseText)

        document.getElementById('trans-final').innerHTML = request.responseText
    }
    getSpeechRecon()
  }
  request.send(null);
}