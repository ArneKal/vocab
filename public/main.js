let vocabularies = [];
let currentVocabulary = null;
let currentLanguage = '';

function fetchLanguages() {
    // Available languages (this could be dynamic)
    const languages = ['swedish']; // Add more languages here
    const select = document.getElementById('language-select');

    languages.forEach(language => {
        const option = document.createElement('option');
        option.value = language;
        option.text = language;
        select.appendChild(option);
    });
}

function loadVocabulary() {
    const select = document.getElementById('language-select');
    currentLanguage = select.value;

    if (!currentLanguage) {
        alert('Please select a language!');
        return;
    }

    fetch(`/vocabularies/${currentLanguage}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load vocabulary for ${currentLanguage}`);
            }
            return response.json();
        })
        .then(data => {
            vocabularies = data;
            if (vocabularies.length === 0) {
                alert(`No vocabularies found for ${currentLanguage}`);
                return;
            }
            showLearningPage();
        })
        .catch(error => {
            console.error('Error loading vocabulary:', error);
            alert('Error loading vocabulary.');
        });
}

function Home() {
    document.getElementById('start-page').classList.remove('hidden');
    document.getElementById('new-vocabulary-page').classList.add('hidden');
    document.getElementById('learn-page').classList.add('hidden');
    //Console.log("home");
}

function showLearningPage() {
    document.getElementById('start-page').classList.add('hidden');
    document.getElementById('learn-page').classList.remove('hidden');
    pickRandomVocabulary();
}

function pickRandomVocabulary() {
    const randomIndex = Math.floor(Math.random() * vocabularies.length);
    currentVocabulary = vocabularies[randomIndex];

    document.getElementById('original-word').textContent = currentVocabulary.original;
    document.getElementById('user-input').value = '';
    document.getElementById('result').textContent = '';
    document.getElementById('reveal-answer').classList.add('hidden');
    document.getElementById('play-audio').classList.add('hidden');
}

function checkAnswer() {
    const userInput = document.getElementById('user-input').value.trim();
    const resultElement = document.getElementById('result');

    if (userInput.toLowerCase() === currentVocabulary.translation.toLowerCase()) {
        resultElement.textContent = 'Correct!';
        resultElement.classList.add('correct');
        resultElement.classList.remove('wrong');
    } else {
        resultElement.textContent = 'Wrong!';
        resultElement.classList.add('wrong');
        resultElement.classList.remove('correct');
    }

    document.getElementById('reveal-answer').classList.remove('hidden');
    document.getElementById('play-audio').classList.remove('hidden');
}

function revealAnswer() {
    const resultElement = document.getElementById('result');
    resultElement.textContent += ` Correct Answer: ${currentVocabulary.translation}`;
}

//notimplemented
function playAudio() {
    //const audioPlayer = document.getElementById('audio-player');
    //const text = encodeURIComponent(currentVocabulary.original);
    //const lang = getLanguageCode(currentLanguage);
    //const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${text}&tl=${lang}&client=tw-ob`;

    //audioPlayer.src = ttsUrl;
    //audioPlayer.play();
}

//only needed for playAudio which isnt implemented
function getLanguageCode(language) {
    const languageCodes = {
        english: 'en',
        french: 'fr',
        spanish: 'es',
        swedish: 'sv',
        // Add more languages here
    };
    return languageCodes[language.toLowerCase()] || 'en';
}

function showNewVocabularyForm() {
    document.getElementById('start-page').classList.add('hidden');
    document.getElementById('new-vocabulary-page').classList.remove('hidden');
}

function saveVocabulary() {
    const language = document.getElementById('new-language').value;
    const originalWord = document.getElementById('new-original-word').value;
    const translation = document.getElementById('new-translation').value;

    if (!language || !originalWord || !translation) {
        alert('Please fill out all fields.');
        return;
    }

    const newVocabulary = { original: originalWord, translation };

    fetch(`/vocabularies/${language}.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newVocabulary)
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            document.getElementById('new-language').value = '';
            document.getElementById('new-original-word').value = '';
            document.getElementById('new-translation').value = '';

            document.getElementById('new-vocabulary-page').classList.add('hidden');
            document.getElementById('start-page').classList.remove('hidden');
        })
        .catch(error => {
            console.error('Error saving vocabulary:', error);
            alert('Failed to save vocabulary.');
        });
}

fetchLanguages();
