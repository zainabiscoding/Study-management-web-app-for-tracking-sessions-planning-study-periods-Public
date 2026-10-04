const currentDateElement =
    document.getElementById("current-date");


function updateCurrentDate() {

    const today = new Date();

    const dateLocale =
        currentLanguage === "ar"
            ? "ar-SA"
            : "en-US";

    currentDateElement.textContent =
        today.toLocaleDateString(
            dateLocale,
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
}

/* =========================
   المتغيرات الأساسية
========================= */

let elapsedSeconds = 0;
let remainingSeconds = 0;
let timer = null;
let sessionState = "not-started";
let sessionStartTime = null;
let pendingSession = null;

/* =========================
   عناصر الصفحة
========================= */

const timerElement =
    document.getElementById("timer");

const startButton =
    document.getElementById("start-session");

const pauseButton =
    document.getElementById("pause-session");

const resumeButton =
    document.getElementById("resume-session");

const subjectSelect =
    document.getElementById("subject");

const sessionTypeSelect =
    document.getElementById("session-type");

const sessionNote =
    document.getElementById("session-note");

const sessionTask =
    document.getElementById("session-task");

const addSessionButton =
    document.getElementById("add-session");

const previousSessionsButton =
    document.getElementById("previous-sessions-btn");

const settingsButton =
    document.getElementById("settings-button");

const plansButton =
    document.getElementById("plans-button");

plansButton.addEventListener(
    "click",
    () => {
        window.location.href =
            "plans.html";
    }
);



const languageButton =
    document.getElementById("language-button");

const taskStatusModal =
    document.getElementById("task-status-modal");

const taskCompletedButton =
    document.getElementById("task-completed");

const taskPartialButton =
    document.getElementById("task-partial");

const taskNotCompletedButton =
    document.getElementById("task-not-completed");

/* =========================
   تنسيق الوقت
========================= */

function formatTime(totalSeconds) {

    const hours =
        Math.floor(totalSeconds / 3600);

    const minutes =
        Math.floor((totalSeconds % 3600) / 60);

    const seconds =
        totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


/* =========================
   تحميل المواد
========================= */


function loadSubjects() {

    const savedSubjects =
        localStorage.getItem("studySubjects");

    const subjects =
        savedSubjects
            ? JSON.parse(savedSubjects)
            : [];


    subjectSelect.innerHTML = "";


    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent =
        currentLanguage === "ar"
            ? "اختر المادة"
            : "Choose subject";

    subjectSelect.appendChild(
        defaultOption
    );


    subjects.forEach((subject) => {

        const option =
            document.createElement("option");

        option.value = subject;

        option.textContent = subject;

        subjectSelect.appendChild(
            option
        );

    });


    const noSubjectsMessage =
        document.getElementById(
            "no-subjects-message"
        );


    if (noSubjectsMessage) {

        noSubjectsMessage.style.display =
            subjects.length === 0
                ? "block"
                : "none";


        noSubjectsMessage.textContent =
            currentLanguage === "ar"
                ? "أضف المواد من الإعدادات"
                : "Add subjects from Settings";

    }

}

   

/* =========================
   إجمالي دراسة اليوم
========================= */

function getTodayStudySeconds() {

    const savedSessions =
        localStorage.getItem("studySessions");


    if (!savedSessions) {
        return 0;
    }


    const sessions =
        JSON.parse(savedSessions);


    const today =
        new Date();


    const startOfToday =
        new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );


    let totalSeconds = 0;


    sessions.forEach((session) => {

        const sessionDate =
            new Date(session.date);


        const startOfSessionDay =
            new Date(
                sessionDate.getFullYear(),
                sessionDate.getMonth(),
                sessionDate.getDate()
            );


        if (
            startOfSessionDay.getTime() ===
            startOfToday.getTime()
        ) {

            totalSeconds += session.duration;

        }

    });


    return totalSeconds;

}


function updateTodayTotal() {

    const todayTotalElement =
        document.getElementById("today-total");


    if (!todayTotalElement) {
        return;
    }


    const todayTotal =
        getTodayStudySeconds();


    todayTotalElement.textContent =
        formatTime(todayTotal);

}


/* =========================
   حالة الأزرار
========================= */

function updateButtons() {

    startButton.disabled =
        sessionState !== "not-started";

    pauseButton.disabled =
        sessionState !== "running";

    resumeButton.disabled =
        sessionState !== "paused";

}


/* =========================
   بدء الجلسة
========================= */

startButton.addEventListener(
    "click",
    () => {

        if (timer !== null) {
            return;
        }


        if (subjectSelect.value === "") {

            alert(
                translations[currentLanguage].chooseSubjectAlert
            );

            return;

        }

        sessionStartTime = new Date().toISOString();


        sessionState = "running";

        updateButtons();


        /* =====================
           جلسة بومودورو
        ===================== */

        if (
            sessionTypeSelect.value ===
            "pomodoro"
        ) {

            remainingSeconds =
                25 * 60;


            elapsedSeconds = 0;


            timerElement.textContent =
                formatTime(remainingSeconds);


            timer = setInterval(
                () => {

                    remainingSeconds--;

                    timerElement.textContent =
                        formatTime(
                            remainingSeconds
                        );


                    if (
                        remainingSeconds <= 0
                    ) {

                        clearInterval(timer);

                        timer = null;


                        /*
                         * الجلسة اكتملت
                         * = 25 دقيقة
                         */

                        elapsedSeconds =
                            25 * 60;


                        remainingSeconds = 0;


                        timerElement.textContent =
                            "00:00:00";


                        sessionState =
                            "not-started";


                        updateButtons();


                        alert(
                            translations[currentLanguage].pomodoroFinished
                        );

                    }

                },
                1000
            );


            return;
        }


        /* =====================
           جلسة عادية
        ===================== */

        timer = setInterval(
            () => {

                elapsedSeconds++;


                timerElement.textContent =
                    formatTime(
                        elapsedSeconds
                    );

            },
            1000
        );

    }
);


/* =========================
   إيقاف مؤقت
========================= */

pauseButton.addEventListener(
    "click",
    () => {

        clearInterval(timer);

        timer = null;

        sessionState = "paused";

        updateButtons();

    }
);


/* =========================
   استئناف الجلسة
========================= */

resumeButton.addEventListener(
    "click",
    () => {

        if (timer !== null) {
            return;
        }


        sessionState = "running";

        updateButtons();


        /* =====================
           استئناف بومودورو
        ===================== */

        if (
            sessionTypeSelect.value ===
            "pomodoro"
        ) {

            timer = setInterval(
                () => {

                    remainingSeconds--;


                    timerElement.textContent =
                        formatTime(
                            remainingSeconds
                        );


                    if (
                        remainingSeconds <= 0
                    ) {

                        clearInterval(timer);

                        timer = null;


                        elapsedSeconds =
                            25 * 60;


                        remainingSeconds = 0;


                        timerElement.textContent =
                            "00:00:00";


                        sessionState =
                            "not-started";


                        updateButtons();


                        alert(
                            translations[currentLanguage].pomodoroFinished
                        );

                    }

                },
                1000
            );


            return;
        }


        /* =====================
           استئناف الجلسة العادية
        ===================== */

        timer = setInterval(
            () => {

                elapsedSeconds++;


                timerElement.textContent =
                    formatTime(
                        elapsedSeconds
                    );

            },
            1000
        );

    }
);


/* =========================
   تحميل الجلسات
========================= */

let sessions = [];

const savedSessions =
    localStorage.getItem("studySessions");


if (savedSessions) {

    sessions =
        JSON.parse(savedSessions);

}

function saveSession(session) {

    sessions.push(session);

    localStorage.setItem(
        "studySessions",
        JSON.stringify(sessions)
    );

    taskStatusModal.style.display = "none";

    pendingSession = null;

    clearInterval(timer);

    timer = null;

    elapsedSeconds = 0;
    remainingSeconds = 0;

    timerElement.textContent = "00:00:00";

    sessionState = "not-started";

    updateButtons();

    subjectSelect.value = "";
    sessionTask.value = "";
    sessionNote.value = "";
    sessionTypeSelect.value = "normal";

    sessionStartTime = null;

    updateTodayTotal();
    updateStreak();

}

/* =========================
   إضافة جلسة
========================= */

addSessionButton.addEventListener(
    "click",
    () => {

        if (subjectSelect.value === "") {

            alert(
                translations[currentLanguage].chooseSubjectAlert
            );

            return;
        }


        let sessionDuration =
            elapsedSeconds;


        if (
            sessionTypeSelect.value ===
            "pomodoro"
        ) {

            sessionDuration =
                (25 * 60) -
                remainingSeconds;

        }


        if (sessionDuration <= 0) {

            alert(
                translations[currentLanguage].sessionNotStarted
            );

            return;
        }


        const selectedSubject =
            subjectSelect.options[
                subjectSelect.selectedIndex
            ].text;


        const note =
            sessionNote.value.trim();


        const sessionDate =
            new Date().toISOString();


        const session = {

            subject: selectedSubject,

            duration: sessionDuration,

            date: sessionDate,

            note: note,

            task: sessionTask.value.trim(),

            taskStatus: null,

            startTime: sessionStartTime

        };


        const task =
            sessionTask.value.trim();


        if (task !== "") {

            pendingSession = session;

            taskStatusModal.style.display =
                "flex";

            return;
        }


        saveSession(session);

    }
);


/* =========================
   حالة المهمة
========================= */

taskCompletedButton.addEventListener(
    "click",
    () => {

        pendingSession.taskStatus =
            "completed";

        saveSession(pendingSession);

    }
);


taskPartialButton.addEventListener(
    "click",
    () => {

        pendingSession.taskStatus =
            "partial";

        saveSession(pendingSession);

    }
);


taskNotCompletedButton.addEventListener(
    "click",
    () => {

        pendingSession.taskStatus =
            "not-completed";

        saveSession(pendingSession);

    }
);


/* =========================
   الجلسات السابقة
========================= */

previousSessionsButton.addEventListener(
    "click",
    () => {

        window.location.href =
            "previous-sessions.html";

    }
);


/* =========================
   حساب الـ Streak
========================= */

function calculateStreak() {

    const savedSessions =
        localStorage.getItem("studySessions");


    if (!savedSessions) {
        return 0;
    }


    const sessions =
        JSON.parse(savedSessions);


    if (sessions.length === 0) {
        return 0;
    }


    const studyDates =
        new Set();


    sessions.forEach((session) => {

        const date =
            new Date(session.date);


        const dateKey =
            `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;


        studyDates.add(dateKey);

    });


    const today =
        new Date();


    let currentDate =
        new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );


    let streak = 0;


    while (true) {

        const dateKey =
            `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;


        if (!studyDates.has(dateKey)) {

            break;

        }


        streak++;


        currentDate.setDate(
            currentDate.getDate() - 1
        );

    }


    return streak;

}


/* =========================
   تحديث الـ Streak
========================= */

function updateStreak() {

    const streakCountElement =
        document.getElementById(
            "streak-count"
        );


    if (!streakCountElement) {
        return;
    }


    streakCountElement.textContent =
        calculateStreak();

}

settingsButton.addEventListener(
    "click",
    () => {
        window.location.href = "settings.html";
    }
);

/* =========================
   نظام اللغة
========================= */

const translations = {

    ar: {
        pageTitle: "متابع الدراسة الشخصي",

        chooseSubject: "اختر المادة",

        studyToday: "إجمالي دراسة اليوم",

        currentSession: "الجلسة الحالية:",

        sessionType: "نوع الجلسة",

        normalSession: "جلسة عادية",

        plansButton: "الخطط",

        pomodoroSession:
            "جلسة بومودورو - 25 دقيقة",

        sessionNote: "ملاحظة الجلسة",

        notePlaceholder:
            "اكتب ملاحظة عن جلسة الدراسة...",

        startSession: "بدء الجلسة",

        pauseSession: "إيقاف مؤقت",

        resumeSession: "استئناف",

        saveSession: "حفظ الجلسة",

        motivation:
            "تبنى الجبال من مستصغر الحجر",

        previousSessions:
            "الجلسات السابقة",

        home: "الواجهة الرئيسية",

        streakLabel:
            "يوم متواصل",

        chooseSubjectAlert:
            "اختر المادة أولًا",

        sessionNotStarted:
            "لم تبدأ جلسة الدراسة بعد.",

        pomodoroFinished:
            "انتهت جلسة البومودورو 🎉",

       
        languageButton: "EN",

        taskStatusTitle: "حالة المهمة",
taskStatusText: "ماذا أنجزتِ من المهمة؟",
taskCompleted: "تمت",
taskPartial: "تمت جزئيًا",
taskNotCompleted: "لم تتم"

    },



    en: {
        pageTitle: "Personal Study Tracker",

        chooseSubject: "Choose subject",

        studyToday: "Today's Study Time",

        currentSession: "Current session:",

        sessionType: "Session type",

        normalSession: "Normal session",

        plansButton: "Plans",

        pomodoroSession:
            "Pomodoro session - 25 minutes",

        sessionNote: "Session note",

        notePlaceholder:
            "Write a note about your study session...",

        startSession: "Start session",


        home: "Home",

        pauseSession: "Pause",

        resumeSession: "Resume",

        saveSession: "Save session",

        motivation:
            "Great things are built one small step at a time",

        previousSessions:
            "Previous sessions",

        streakLabel:
            "day streak",

        chooseSubjectAlert:
            "Please choose a subject first.",

        sessionNotStarted:
            "The study session has not started yet.",

        pomodoroFinished:
            "Pomodoro session finished ",

           
        languageButton: "AR",

         taskStatusTitle: "Task status",
    taskStatusText: "What did you accomplish?",
    taskCompleted: "Completed",
    taskPartial: "Partially completed",
    taskNotCompleted: "Not completed"
    }

};


let currentLanguage =
    localStorage.getItem("studyLanguage") || "ar";


function updateLanguage() {

    const language =
        translations[currentLanguage];


    document.documentElement.lang =
        currentLanguage;

    document.documentElement.dir =
        currentLanguage === "ar"
            ? "rtl"
            : "ltr";



    document.getElementById(
    "plans-button"
).textContent =
    language.plansButton;

 const taskLabel = document.getElementById("session-task-label");
const taskInput = document.getElementById("session-task");

if (taskLabel && taskInput) {
    if (currentLanguage === "ar") {
        taskLabel.textContent = "المهام المراد إنجازها:";
        taskInput.placeholder = "اكتبي المهمة التي تريدين إنجازها...";
    } else {
        taskLabel.textContent = "Tasks to complete";
        taskInput.placeholder = "Write the task you want to complete...";
    
    document.getElementById("task-status-title").textContent =
    language.taskStatusTitle;

document.getElementById("task-status-text").textContent =
    language.taskStatusText;

taskCompletedButton.textContent =
    language.taskCompleted;

taskPartialButton.textContent =
    language.taskPartial;

taskNotCompletedButton.textContent =
    language.taskNotCompleted;
    
    }

    homeButton.setAttribute(
    "aria-label",
    language.home
);

homeButton.setAttribute(
    "title",
    language.home
);
}

    document.title =
        language.pageTitle;


    /* العنوان */

    document.querySelector(
        ".header h1"
    ).textContent =
        language.pageTitle;


    /* إجمالي اليوم */

    document.querySelector(
        ".study-summary h2"
    ).textContent =
        language.studyToday;


    /* الجلسة الحالية */

    document.querySelector(
        ".current-session"
    ).childNodes[0].textContent =
        ` ${language.currentSession} `;


    /* المادة */

    document.querySelector(
        ".subject-section label"
    ).textContent =
        language.chooseSubject;


    subjectSelect.options[0].textContent =
        language.chooseSubject;

const noSubjectsMessage =
    document.getElementById("no-subjects-message");

if (noSubjectsMessage) {
    noSubjectsMessage.textContent =
        currentLanguage === "ar"
            ? "أضف المواد من الإعدادات"
            : "Add subjects from Settings";
}

    /* نوع الجلسة */

    document.querySelector(
        ".session-type-section label"
    ).textContent =
        language.sessionType;


    document.querySelector(
        '#session-type option[value="normal"]'
    ).textContent =
        language.normalSession;


    document.querySelector(
        '#session-type option[value="pomodoro"]'
    ).textContent =
        language.pomodoroSession;


    /* الملاحظة */

    document.querySelector(
        ".notes-section label"
    ).textContent =
        language.sessionNote;


    sessionNote.placeholder =
        language.notePlaceholder;


    /* الأزرار */

    startButton.textContent =
        language.startSession;

    pauseButton.textContent =
        language.pauseSession;

    resumeButton.textContent =
        language.resumeSession;

    addSessionButton.textContent =
    language.saveSession;

    document.querySelector(
        ".motivation p"
    ).textContent =
        language.motivation;


    previousSessionsButton.textContent =
        language.previousSessions;


    /* الستريك */

    document.querySelector(
        ".streak-label"
    ).textContent =
        language.streakLabel;


    /* زر اللغة */

    languageButton.textContent =
        language.languageButton;


    /* الإعدادات */

    settingsButton.title =
        currentLanguage === "ar"
            ? "الإعدادات"
            : "Settings";

    settingsButton.setAttribute(
        "aria-label",
        currentLanguage === "ar"
            ? "الإعدادات"
            : "Settings"
    );

    
updateCurrentDate();

}




languageButton.addEventListener(
    "click",
    () => {

        currentLanguage =
            currentLanguage === "ar"
                ? "en"
                : "ar";


        localStorage.setItem(
            "studyLanguage",
            currentLanguage
        );


        updateLanguage();

    }
);


/* =========================
   التشغيل الأولي
========================= */

loadSubjects();

updateButtons();

updateTodayTotal();

updateStreak();

updateLanguage();