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