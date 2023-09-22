"use strict";

class Chatbox {
	//constructor
	constructor() {
		this.args = {
			openButton: document.querySelector(".chatbox__button"),
			chatBox: document.querySelector(".chatbox__support"),
			sendButton: document.querySelector(".send__button"),
		};
		this.speak = false;
		this.state = false;
		this.messages = [];
	}

	display() {
		const { openButton, chatBox, sendButton } = this.args;

		openButton.addEventListener("click", () => this.toggleState(chatBox));

		sendButton.addEventListener("click", () => this.onSendButton(chatBox));

		const node = chatBox.querySelector("input");
		node.addEventListener("keyup", ({ key }) => {
			if (key === "Enter") {
				this.onSendButton(chatBox);
			}
		});
	}

	toggleState(chatbox) {
		this.state = !this.state;

		// show or hides the box
		if (this.state) {
			chatbox.classList.add("chatbox--active");
		} else {
			chatbox.classList.remove("chatbox--active");
		}
	}

	onSendButton(chatbox, text1) {
		var textField = chatbox.querySelector("input");
		text1 = text1 || textField.value;
		if (text1 === "") {
			return;
		}

		let msg1 = { name: "User", message: text1 };
		this.messages.push(msg1);

		fetch("http://localhost:5000/predict", {
			method: "POST",
			body: JSON.stringify({ message: text1 }),
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((r) => r.json())
			.then((r) => {
				let msg2 = { name: "Aarav", message: r.answer };
				this.messages.push(msg2);
				this.updateChatText(chatbox);
				textField.value = "";
			})
			.catch((error) => {
				console.error("Error:", error);
				this.updateChatText(chatbox);
				textField.value = "";
			});
	}

	updateChatText(chatbox) {
		var html = "";
		this.messages
			.slice()
			.reverse()
			.forEach(function (item, index) {
				if (item.name === "Aarav") {
					html +=
						'<div class="messages__item messages__item--visitor">' +
						item.message +
						"</div>";
				} else {
					html +=
						'<div class="messages__item messages__item--operator">' +
						item.message +
						"</div>";
				}
			});
		const chatmessage = chatbox.querySelector(".chatbox__messages");
		chatmessage.innerHTML = html;
		const latestResponse = this.messages[this.messages.length - 1].message;

		if (this.speak) {
			this.textToSpeech(latestResponse);
		}
	}
	//text to speech functionality
	textToSpeech(text) {
		let utterance = new SpeechSynthesisUtterance(text);
		window.speechSynthesis.cancel();
		// Set the voice name to "Google US English"
		for (let voice of window.speechSynthesis.getVoices()) {
			if (voice.name === "Google US English") {
				utterance.voice = voice;
				break;
			}
		}
		window.speechSynthesis.speak(utterance);
	}

	//additional functions
	openChatbox() {
		const { chatBox } = this.args;
		chatBox.classList.add("chatbox--active");
		this.messages.push({
			name: "Aarav",
			message: "Hello! How can I assist you?",
		});
		this.speak = true;
		this.updateChatText(chatBox);
		this.startSpeechRecognition();
	}

	startSpeechRecognition() {
		const recognition = new webkitSpeechRecognition();
		recognition.continuous = true;
		recognition.lang = "en-US";
		recognition.interimResults = false;
		recognition.maxAlternatives = 1;

		recognition.addEventListener("result", (event) => {
			const transcript =
				event.results[event.results.length - 1][0].transcript.trim();
			this.updateChatText(this.args.chatBox);
			this.onSendButton(this.args.chatBox, transcript); // Send the user's query
		});

		recognition.start();
	}
}

const chatbox = new Chatbox();
chatbox.display();

//SPEECH - TEXT FUNCTIONALITY----------------

// Speech to text functionality
const voiceBtn = document.querySelector("#text");

const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.start();

// Listen for recognition results
recognition.addEventListener("result", (event) => {
	const transcript =
		event.results[event.results.length - 1][0].transcript.trim();
	console.log(event.results);
	// Check if the recognized speech contains "aarav"
	if (transcript.includes("hello")) {
		console.log(transcript);
		chatbox.openChatbox();
	}
});
