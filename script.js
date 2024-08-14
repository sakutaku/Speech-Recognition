const recordBtn = document.querySelector(".record"),
result = document.querySelector(".result"),
downloadBtn = document.querySelector(".download"),
languagesSelect = document.querySelector("#language"),
clearBtn = document.querySelector(".clear");

function populateLanguages() {
    languages.forEach(lang => {
        const option =  document.createElement("option");
        option.value = lang.code;
        option.innerHTML = lang.name;
        languagesSelect.appendChild(option);
    });
}

populateLanguages();

let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition,
recognition,
recording = false;

function speechToText() {
    try {
        recognition = new speechRecognition();
        recognition.lang = languagesSelect.value;
        recognition.interimResults = true;

        recordBtn.classList.add("recording");
        const pElement = recordBtn.querySelector(".result");
        if (pElement) pElement.innerHTML = "listening... ";
        recognition.start();
        recognition.onresult = (event) => {
            const speechResult = event.results[0][0].transcript;

            if (event.results[0].isFinal) {
                result.innerHTML += " " + speechResult;
                result.querySelector("p").remove(); 
            } else {
                if (!document.querySelector(".interim")) {
                    const interim = document.createElement("p");
                    interim.classList.add("interim");
                    result.appendChild(interim);
                }
                document.querySelector("interim").innerHTML = " " + speechResult;
            }
            downloadBtn.disabled = false;
        }

        recognition.onspeechend = () => {
            speechToText();
        }
        recognition.onerror = (event) => {
            alert("Error Occured: " + event.error);
        }
    } catch (error) {
        recording = false;
        console.log(error);
    }
}

function stopRecording() {
    recognition.stop();
    recordBtn.querySelector("p").innerHTML = "Start listeting";
    recordBtn.classList.remove("recording");
    recording = false;
}

recordBtn.addEventListener("click", () => {
    if (!recording) {
        speechToText()
        recording = true;
    } else {
        stopRecording();
    }
});

const { jsPDF } = window.jspdf;

function downloadTxt() {
    const text = result.innerHTML;
    const filename = "speech.txt";

    const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text)
      );
      element.setAttribute("download", filename);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
}

function downloadPdf() {
    const doc = new jsPDF();
    const text = result.innerHTML;

    doc.text(text, 10, 10);

    doc.save("speech.pdf");
}

function download() {
    const selectedLanguage = languagesSelect.value;
    console.log(selectedLanguage);
    if (selectedLanguage === 'en') {  // Adjust this to match your language codes
        downloadPdf();
    } else {
        downloadTxt();
    }
}

downloadBtn.addEventListener("click", download);

clearBtn.addEventListener("click", () => {
  result.innerHTML = "";
  downloadBtn.disabled = true;
});