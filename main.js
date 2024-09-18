let vocabularies = [];
let currentVocabulary = null;
let currentLanguage = '';

function fetchLanguages() {
    // Simulate fetching language files dynamically (you can load JSON files with AJAX).
    const languages = ['swedish'];
    const select = document.getElementById('language-select');

    languages.forEach(language => {
        const option = document.createElement('option');
        option.value = language;
        option.text = language;
        select.appendChild(option);
    });
}

function Home() {
    document.getElementById('start-page').classList.remove('hidden');
    document.getElementById('new-vocabulary-page').classList.add('hidden');
    document.getElementById('learn-page').classList.add('hidden');
    console.log("home");
}


function loadVocabulary() {
    const select = document.getElementById('language-select');
    currentLanguage = select.value;

    if (!currentLanguage) {
        alert('Please select a language!');
        return;
    }

    const fileName = `data/${currentLanguage}.json`; // Create the file name based on selected language

    // Fetch the vocabulary JSON file dynamically
    fetch(fileName)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load file: ${fileName}`);
            }
            return response.json(); // Parse the JSON file content
        })
        .then(data => {
            vocabularies = data; // Store loaded vocabularies
            if (vocabularies.length === 0) {
                alert(`No vocabularies found for ${currentLanguage}`);
                return;
            }
            showLearningPage(); // Go to the learning page once vocabularies are loaded
        })
        .catch(error => {
            console.error('Error fetching the vocabulary file:', error);
            alert('Failed to load the vocabulary file. Please ensure the file exists.');
        });
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

function playAudio() {
    const audioPlayer = document.getElementById('audio-player');

    // Generate Google Translate TTS URL
    const text = encodeURIComponent(currentVocabulary.translation); // The word to be spoken
    const lang = getLanguageCode(currentLanguage); // Convert language to Google Translate language code
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${text}&tl=${lang}&client=tw-ob`;

    audioPlayer.src = ttsUrl;
    audioPlayer.play();
    console.log("played audio");
}

function getLanguageCode(language) {
    // Mapping user-friendly language names to Google Translate codes
    const languageCodes = {
        english: 'en',
        french: 'fr',
        spanish: 'es',
        german: 'de',
        italian: 'it',
        portuguese: 'pt',
		swedish: 'sv'
        // Add more languages as needed
    };

    return languageCodes[language.toLowerCase()] || 'en'; // Default to English if not found
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

    const newVocabulary = {
        original: originalWord,
        translation: translation
    };

    // Save vocabulary to JSON file (simulated here, you would need backend code)
    console.log(`Saving vocabulary to ${language}.json`, newVocabulary);

    // Clear inputs
    document.getElementById('new-language').value = '';
    document.getElementById('new-original-word').value = '';
    document.getElementById('new-translation').value = '';

    // Return to start page
    document.getElementById('new-vocabulary-page').classList.add('hidden');
    document.getElementById('start-page').classList.remove('hidden');
}

fetchLanguages();
