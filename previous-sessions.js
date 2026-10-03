const savedSessions = localStorage.getItem("studySessions");

const sessions = savedSessions
    ? JSON.parse(savedSessions)
    : [];

console.log(sessions);

const sessionCountElement = document.getElementById("session-count");

sessionCountElement.textContent = sessions.length;


let totalStudySeconds = 0;

sessions.forEach((session) => {
    totalStudySeconds += session.duration;
});


function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


const totalStudyTimeElement =
    document.getElementById("total-study-time");

totalStudyTimeElement.textContent =
    formatTime(totalStudySeconds);


const sessionsContainer =
    document.getElementById("sessions-container");

function formatSessionDate(dateString) {
    const sessionDate = new Date(dateString);
    const today = new Date();

    const startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    const startOfSessionDay = new Date(
        sessionDate.getFullYear(),
        sessionDate.getMonth(),
        sessionDate.getDate()
    );

    const differenceInDays =
        Math.floor(
            (startOfToday - startOfSessionDay) /
            (1000 * 60 * 60 * 24)
        );

    if (differenceInDays === 0) {
        return "اليوم";
    }

    if (differenceInDays === 1) {
        return "أمس";
    }

    return sessionDate.toLocaleDateString("ar-SA", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}



sessions.slice().reverse().forEach((session) => {
const sessionElement = document.createElement("tr");

    sessionElement.classList.add("session-card");

  sessionElement.innerHTML = `
    <td>${formatSessionDate(session.date)}</td>
    <td>${session.subject}</td>
    <td>${formatTime(session.duration)}</td>
   <td>${session.note || "—"}</td>
`;

    sessionsContainer.appendChild(sessionElement);
});


const backToDashboardButton =
    document.getElementById("back-to-dashboard");

backToDashboardButton.addEventListener("click", () => {
    window.location.href = "index.html";
});