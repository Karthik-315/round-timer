"use strict";

const rootElement = document.querySelector(":root");
var rootElementStyle = getComputedStyle(rootElement);
const timerRingContainer = document.querySelector(".timer-ring-svg");
const timerRing = document.querySelector(".ring");

const timerBody = document.querySelector(".timer-body");
const hoursInput = document.querySelector(".input--hours");
const minutesInput = document.querySelector(".input--minutes");
const secondsInput = document.querySelector(".input--seconds");

const startTimerButton = document.querySelector(".timer-button--start");
const pauseTimerButton = document.querySelector(".timer-button--pause");
const stopTimerButton = document.querySelector(".timer-button--stop");

const svgSize = +rootElementStyle.getPropertyValue("--ring-svg-size").replace("px", "");
const svgStrokeSize = +rootElementStyle
    .getPropertyValue("--ring-stroke-size")
    .replace("px", "");
const svgRadius = svgSize / 2 - svgStrokeSize * 2;

let timerDuration = 0; // In seconds.
let [inputHours, inputMinutes, inputSeconds] = [
    hoursInput.value,
    minutesInput.value,
    secondsInput.value,
];

const ringCircumference = Math.ceil(2 * 3.14 * svgRadius);

let dashOffset = 0;
let timerInterval;
// Stroke offset to add, per second.
let offsetPerSecond;

const pauseTimer = () => {
    // Reset timer
    clearInterval(timerInterval);

    if (pauseTimerButton.innerText === "Resume") {
        pauseTimerButton.innerText = "Pause";
        startTimerCountdown();
    } else {
        rootElement.style.setProperty("--stroke-color", "hsl(27, 87%, 50%)");
        pauseTimerButton.innerText = "Resume";
    }
    pauseTimerButton.classList.remove("button-disabled");
    stopTimerButton.classList.remove("button-disabled");
};

const stopTimer = () => {
    // Reset timer
    clearInterval(timerInterval);
    timerRing.style.strokeDasharray = `${ringCircumference} ${ringCircumference}`;
    timerRing.style.strokeDashoffset = 0;
    timerDuration = offsetPerSecond - 1;

    [hoursInput, minutesInput, secondsInput].forEach((input) => {
        input.classList.remove("inactive");
    });

    [hoursInput.value, minutesInput.value, secondsInput.value] = [
        `${inputHours}`.padStart(2, "0"),
        `${inputMinutes}`.padStart(2, "0"),
        `${inputSeconds}`.padStart(2, "0"),
    ];

    dashOffset = 0;

    startTimerButton.classList.remove("button-disabled");
    pauseTimerButton.classList.add("button-disabled");
    stopTimerButton.classList.add("button-disabled");
    pauseTimerButton.innerText = "Pause";

    document
        .querySelector(":root")
        .style.setProperty("--stroke-color", "hsl(136, 54%, 43%)");
};

const startTimerCountdown = function () {
    startTimerButton.classList.add("button-disabled");
    pauseTimerButton.classList.remove("button-disabled");
    stopTimerButton.classList.remove("button-disabled");

    document
        .querySelector(":root")
        .style.setProperty("--stroke-color", "hsl(136, 54%, 43%)");

    // Start up the timer
    timerInterval = setInterval(function () {
        if (timerDuration < 0) {
            // End the timer and clear the interval.
            stopTimer();
            return;
        }

        // Set the offset, based on the total time.
        dashOffset = dashOffset + ringCircumference / offsetPerSecond;
        timerRing.style.strokeDashoffset = dashOffset;

        // Convert thime in seconds to formatted time.
        var hr = `${Math.floor(timerDuration / 3600)}`.padStart(2, "0");
        var min = `${Math.floor((timerDuration % 3600) / 60)}`.padStart(2, "0");
        var sec = `${Math.floor((timerDuration % 3600) % 60)}`.padStart(2, "0");

        [hoursInput.value, minutesInput.value, secondsInput.value] = [hr, min, sec];
        timerDuration--;
    }, 1000);
};

const startTimer = function () {
    // Set the stroke of the SVG.
    timerRing.style.strokeDasharray = `${ringCircumference} ${ringCircumference}`;
    timerRing.style.strokeDashoffset = 0;

    [inputHours, inputMinutes, inputSeconds] = [
        +hoursInput.value,
        +minutesInput.value,
        +secondsInput.value,
    ];

    timerDuration = inputHours * 3600 + inputMinutes * 60 + inputSeconds;
    offsetPerSecond = timerDuration + 1;

    [hoursInput, minutesInput, secondsInput].forEach((input) => {
        input.classList.add("inactive");
    });

    startTimerCountdown();
};

window.addEventListener("load", function () {
    stopTimerButton.classList.add("button-disabled");
    pauseTimerButton.classList.add("button-disabled");
    secondsInput.focus();
});

startTimerButton.addEventListener("click", startTimer);
pauseTimerButton.addEventListener("click", pauseTimer);
stopTimerButton.addEventListener("click", stopTimer);
