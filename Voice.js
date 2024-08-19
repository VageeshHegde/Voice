const btn = document.querySelector(".talk");
const content = document.querySelector(".content");
// const audio = new Audio("D:\Meditation\01-Bastrika.mp3");  // Update this path to the song you want to play
const audio = new Audio("D:\\Meditation\\01-Bastrika.mp3");

function speak(text) {
  const text_speak = new SpeechSynthesisUtterance(text);
  text_speak.rate = 1;
  text_speak.volume = 1;
  text_speak.pitch = 1;

  window.speechSynthesis.speak(text_speak);
}

function wishMe() {
  var day = new Date();
  var hour = day.getHours();

  if (hour >= 0 && hour < 12) {
    speak("Good Morning Vageesh..");
  } else if (hour >= 12 && hour < 17) {
    speak("Good Afternoon Vageesh..");
  } else {
    speak("Good Evening Vageesh..");
  }
}

window.addEventListener("load", () => {
  speak("Initializing Virtual Assistant..");
  wishMe();
});

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
  const currentIndex = event.resultIndex;
  const transcript = event.results[currentIndex][0].transcript;
  content.textContent = transcript;
  takeCommand(transcript.toLowerCase());
  saveMessage(transcript);
};

btn.addEventListener("click", () => {
  content.textContent = "Listening..";
  recognition.start();
});

function takeCommand(message) {
  if (
    message.includes("hey") ||
    message.includes("hello") ||
    message.includes("hi")
  ) {
    speak("Hello Vageesh, how may I help you?");
  } else if (message.includes("open google")) {
    window.open("https://google.com", "_blank");
    speak("Opening Google..");
  } else if (message.includes("open youtube")) {
    window.open("https://youtube.com", "_blank");
    speak("Opening YouTube..");
  } else if (message.includes("open facebook")) {
    window.open("https://facebook.com", "_blank");
    speak("Opening Facebook..");
  } else if (message.includes("open twitter")) {
    window.open("https://twitter.com", "_blank");
    speak("Opening Twitter..");
  } else if (message.includes("open linkedin")) {
    window.open("https://linkedin.com", "_blank");
    speak("Opening LinkedIn..");
  } else if (message.includes("show distance on google maps")) {
    const locations = extractLocations(message);
    if (locations.origin && locations.destination) {
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
        locations.origin
      )}&destination=${encodeURIComponent(locations.destination)}`;
      window.open(mapsUrl, "_blank");
      speak(
        `Showing the distance from ${locations.origin} to ${locations.destination} on Google Maps...`
      );
    } else {
      speak("Please provide both the origin and destination.");
    }
  } else if (message.includes("open github")) {
    window.open("https://github.com", "_blank");
    speak("Opening GitHub..");
  } else if (message.includes("open gmail")) {
    window.open("https://mail.google.com", "_blank");
    speak("Opening Gmail..");
  } else if (message.includes("what is your name")) {
    speak("I am your virtual assistant.");
  } else if (message.includes("calculator")) {
    window.open("Calculator:///");
    speak("Opening Calculator..");
  } else if (message.includes("what time is it")) {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strTime = `${hours}:${
      minutes < 10 ? "0" + minutes : minutes
    } ${ampm}`;
    speak(`It is ${strTime}.`);
  } else if (
    message.includes("what is the date") ||
    message.includes("what is today's date")
  ) {
    const now = new Date();
    const date = now.toDateString();
    speak(`Today's date is ${date}.`);
  } else if (message.includes("tell me a joke")) {
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything.",
      "Why did the scarecrow win an award? Because he was outstanding in his field.",
      "Why don't skeletons fight each other? They don't have the guts.",
    ];
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    speak(joke);
  } else if (message.includes("thank you")) {
    speak("You're welcome, Vageesh!");
  } else if (message.includes("play a song")) {
    audio.play();
    speak("Playing your song.");
  } else if (message.includes("sing a song")) {
    speak(
      "Johny, Johny, Yes Papa, Eating sugar? No, Papa, Telling lies? No, Papa Open your mouth Ha, ha, ha!"
    );
  } else {
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(message)}`,
      "_blank"
    );
    speak("Here are the search results for " + message);
  }
}

function extractLocations(message) {
    // Assuming the message format is: "show distance on google maps from [origin] to [destination]"
    const regex = /from (.+) to (.+)/i;
    const match = message.match(regex);
    if (match) {
        return {
            origin: match[1].trim(),
            destination: match[2].trim()
        };
    }
    return {
        origin: null,
        destination: null
    };
}

function saveMessage(message) {
  fetch("http://localhost:3030/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: message }),
  })
    .then((response) => response.json())
    .then((data) => console.log("Message saved:", data))
    .catch((error) => console.error("Error saving message:", error));
}
