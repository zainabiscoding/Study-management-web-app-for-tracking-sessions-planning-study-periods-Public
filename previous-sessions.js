/* =========================
   اللغة
========================= */

let currentLanguage =
    localStorage.getItem("studyLanguage") || "ar";


const translations = {

    ar: {

        pageTitle: "الجلسات السابقة",

        totalStudyTime: "إجمالي وقت الدراسة",

        sessionCount: "عدد الجلسات",

        date: "التاريخ",

        subject: "المادة",

        duration: "مدة الجلسة",

        notes: "الملاحظات",

        startTime: "وقت البداية",

        task: "المهمة",

        taskStatus: "حالة المهمة",

        today: "اليوم",

        yesterday: "أمس",

        completed: "تمت",

        partial: "تمت جزئيًا",

        notCompleted: "لم تتم",

        back: "العودة للواجهة الرئيسية",

        languageButton: "EN",

        detailsLabel: "عرض تفاصيل الجلسة"

    },


    en: {

        pageTitle: "Previous Sessions",

        totalStudyTime: "Total Study Time",

        sessionCount: "Number of Sessions",

        date: "Date",

        subject: "Subject",

        duration: "Session Duration",

        notes: "Notes",

        startTime: "Start Time",

        task: "Task",

        taskStatus: "Task Status",

        today: "Today",

        yesterday: "Yesterday",

        completed: "Completed",

        partial: "Partially completed",

        notCompleted: "Not completed",

        back: "Back to dashboard",

        languageButton: "AR",

        detailsLabel: "Show session details"

    }

};


/* =========================
   تحميل الجلسات
========================= */

const savedSessions =
    localStorage.getItem("studySessions");


const sessions =
    savedSessions
        ? JSON.parse(savedSessions)
        : [];


/* =========================
   تنسيق الوقت
========================= */

function formatTime(totalSeconds) {

    const hours =
        Math.floor(totalSeconds / 3600);

    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );

    const seconds =
        totalSeconds % 60;


    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


/* =========================
   الإحصائيات
========================= */

const sessionCountElement =
    document.getElementById(
        "session-count"
    );


sessionCountElement.textContent =
    sessions.length;


let totalStudySeconds = 0;


sessions.forEach((session) => {

    totalStudySeconds +=
        session.duration;

});


const totalStudyTimeElement =
    document.getElementById(
        "total-study-time"
    );


totalStudyTimeElement.textContent =
    formatTime(totalStudySeconds);


/* =========================
   التاريخ
========================= */

function formatSessionDate(dateString) {

    const sessionDate =
        new Date(dateString);


    const today =
        new Date();


    const startOfToday =
        new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );


    const startOfSessionDay =
        new Date(
            sessionDate.getFullYear(),
            sessionDate.getMonth(),
            sessionDate.getDate()
        );


    const differenceInDays =
        Math.floor(
            (
                startOfToday -
                startOfSessionDay
            ) /
            (1000 * 60 * 60 * 24)
        );


    const language =
        translations[currentLanguage];


    if (differenceInDays === 0) {

        return language.today;

    }


    if (differenceInDays === 1) {

        return language.yesterday;

    }


    const locale =
        currentLanguage === "ar"
            ? "ar-SA"
            : "en-US";


    return sessionDate.toLocaleDateString(
        locale,
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


/* =========================
   وقت البداية
========================= */

function formatStartTime(startTime) {

    if (!startTime) {

        return "—";

    }


    const date =
        new Date(startTime);


    const locale =
        currentLanguage === "ar"
            ? "ar-SA"
            : "en-US";


    return date.toLocaleTimeString(
        locale,
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* =========================
   حالة المهمة
========================= */

function getTaskStatusText(status) {

    const language =
        translations[currentLanguage];


    if (status === "completed") {

        return language.completed;

    }


    if (status === "partial") {

        return language.partial;

    }


    if (status === "not-completed") {

        return language.notCompleted;

    }


    return "—";

}


/* =========================
   عرض الجلسات
========================= */

const sessionsContainer =
    document.getElementById(
        "sessions-container"
    );


const displayedSessions =
    sessions
        .map((session, index) => ({
            session,
            index
        }))
        .reverse();


displayedSessions.forEach(
    ({ session }) => {

        const sessionElement =
            document.createElement("tr");


        sessionElement.classList.add(
            "session-row"
        );


        sessionElement.innerHTML = `

            <td>
                ${formatSessionDate(
                    session.date
                )}
            </td>

            <td>
                ${session.subject}
            </td>

            <td>
                ${formatTime(
                    session.duration
                )}
            </td>

            <td>
                ${session.note || "—"}
            </td>

            <td class="session-details-cell">

                <button
                    class="session-details-button"
                    type="button"
                    aria-label="${
                        translations[
                            currentLanguage
                        ].detailsLabel
                    }"
                >
                    ⌄
                </button>

            </td>

        `;


        /* =========================
           صف التفاصيل
        ========================== */

        const detailsRow =
            document.createElement("tr");


        detailsRow.classList.add(
            "session-details-row"
        );


        detailsRow.style.display =
            "none";


        const language =
            translations[currentLanguage];


        detailsRow.innerHTML = `

            <td colspan="5">

                <div class="session-details">

                    <div class="session-detail-item">

                        <span class="session-detail-label">
                            ${language.startTime}
                        </span>

                        <span>
                            ${formatStartTime(
                                session.startTime
                            )}
                        </span>

                    </div>


                    <div class="session-detail-item">

                        <span class="session-detail-label">
                            ${language.task}
                        </span>

                        <span>
                            ${session.task || "—"}
                        </span>

                    </div>


                    <div class="session-detail-item">

                        <span class="session-detail-label">
                            ${language.taskStatus}
                        </span>

                        <span>
                            ${getTaskStatusText(
                                session.taskStatus
                            )}
                        </span>

                    </div>

                </div>

            </td>

        `;


        /* =========================
           زر السهم
        ========================== */

        const detailsButton =
            sessionElement.querySelector(
                ".session-details-button"
            );


        detailsButton.addEventListener(
            "click",
            () => {

                const isOpen =
                    detailsRow.style.display !==
                    "none";


                if (isOpen) {

                    detailsRow.style.display =
                        "none";

                    detailsButton.textContent =
                        "⌄";

                } else {

                    detailsRow.style.display =
                        "table-row";

                    detailsButton.textContent =
                        "⌃";

                }

            }
        );


        sessionsContainer.appendChild(
            sessionElement
        );


        sessionsContainer.appendChild(
            detailsRow
        );

    }
);


/* =========================
   تحديث اللغة
========================= */

function updateLanguage() {

    const language =
        translations[currentLanguage];


    document.documentElement.lang =
        currentLanguage;


    document.documentElement.dir =
        currentLanguage === "ar"
            ? "rtl"
            : "ltr";


    document.title =
        language.pageTitle;


    document.getElementById(
        "page-title"
    ).textContent =
        language.pageTitle;


    document.getElementById(
        "total-study-label"
    ).textContent =
        language.totalStudyTime;


    document.getElementById(
        "session-count-label"
    ).textContent =
        language.sessionCount;


    document.getElementById(
        "date-header"
    ).textContent =
        language.date;


    document.getElementById(
        "subject-header"
    ).textContent =
        language.subject;


    document.getElementById(
        "duration-header"
    ).textContent =
        language.duration;


    document.getElementById(
        "notes-header"
    ).textContent =
        language.notes;


    document.getElementById(
        "back-to-dashboard"
    ).textContent =
        language.back;


    document.getElementById(
        "language-button"
    ).textContent =
        language.languageButton;

}


/* =========================
   زر اللغة
========================= */

const languageButton =
    document.getElementById(
        "language-button"
    );


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


        /*
         * نعيد تحميل الصفحة
         * حتى تُعاد الجلسات والتفاصيل
         * باللغة الجديدة.
         */

        location.reload();

    }
);




const settingsButton =
    document.getElementById("settings-button");


settingsButton.addEventListener(
    "click",
    () => {

        window.location.href =
            "settings.html";

    }
);




/* =========================
   التشغيل الأولي
========================= */

updateLanguage();