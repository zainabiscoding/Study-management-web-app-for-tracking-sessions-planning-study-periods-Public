/* =========================
   اللغة
========================= */

let currentLanguage =
    localStorage.getItem("studyLanguage") || "ar";


const translations = {

    ar: {

        edit: "تعديل",
 
        delete: "حذف", 


        pageTitle: "الخطة والتذكيرات",

        indexTitle: "الفهرس",

        studyPlans: "الخطط الدراسية",

        reminders: "الاختبارات والتذكيرات",

        plansTitle: "الخطط",

        addPlan: "+ إضافة خطة / تذكير",

        type: "النوع",

        subject: "المادة",

        from: "من",

        to: "إلى",

        content: "الخطة / التذكير",

        status: "الحالة",

        studyPlan: "خطة دراسية",

        reminder: "تذكير / اختبار",

        chooseSubject: "اختر المادة",

        modalTitle: "إضافة خطة / تذكير",

        typeLabel: "النوع",

        subjectLabel: "المادة",

        startLabel: "من",

        endLabel: "إلى",

        contentLabel:
            "ماذا ستدرسين / التذكير",

        contentPlaceholder:
            "مثال: مراجعة Chapter 1 - 3",

        noteLabel: "ملاحظة",

        notePlaceholder:
            "ملاحظة إضافية...",

        cancel: "إلغاء",

        save: "حفظ",

        notStarted: "لم تبدأ",

        inProgress: "قيد التنفيذ",

        completed: "مكتملة",

        languageButton: "EN",

        today: "اليوم"

    },


    en: {


        edit: "Edit",
 
        delete: "Delete", 

        pageTitle: "Plans & Reminders",

        indexTitle: "Index",

        studyPlans: "Study Plans",

        reminders: "Exams & Reminders",

        plansTitle: "Plans",

        addPlan: "+ Add Plan / Reminder",

        type: "Type",

        subject: "Subject",

        from: "From",

        to: "To",

        content: "Plan / Reminder",

        status: "Status",

        studyPlan: "Study Plan",

        reminder: "Reminder / Exam",

        chooseSubject: "Choose subject",

        modalTitle: "Add Plan / Reminder",

        typeLabel: "Type",

        subjectLabel: "Subject",

        startLabel: "From",

        endLabel: "To",

        contentLabel:
            "What will you study / Reminder",

        contentPlaceholder:
            "Example: Review Chapter 1 - 3",

        noteLabel: "Note",

        notePlaceholder:
            "Additional note...",

        cancel: "Cancel",

        save: "Save",

        notStarted: "Not started",

        inProgress: "In progress",

        completed: "Completed",

        languageButton: "AR",

        today: "Today"

    }

};


/* =========================
   عناصر الصفحة
========================= */

const calendarElement =
    document.getElementById("calendar");

const calendarMonthElement =
    document.getElementById("calendar-month");

const previousMonthButton =
    document.getElementById("previous-month");

const nextMonthButton =
    document.getElementById("next-month");

const plansIndex =
    document.getElementById("plans-index");

const plansContainer =
    document.getElementById("plans-container");


const addPlanButton =
    document.getElementById("add-plan-button");

const planModal =
    document.getElementById("plan-modal");

const cancelPlanButton =
    document.getElementById(
        "cancel-plan-button"
    );

const savePlanButton =
    document.getElementById(
        "save-plan-button"
    );

const planType =
    document.getElementById("plan-type");

const planSubject =
    document.getElementById("plan-subject");

const planStartDate =
    document.getElementById(
        "plan-start-date"
    );

const planEndDate =
    document.getElementById(
        "plan-end-date"
    );

const planContent =
    document.getElementById(
        "plan-content"
    );

const planNote =
    document.getElementById("plan-note");


/* =========================
   الشهر الحالي
========================= */

let currentCalendarDate =
    new Date();


/* =========================
   الخطط
========================= */

let plans = [];

const savedPlans =
    localStorage.getItem("studyPlans");


if (savedPlans) {

    plans =
        JSON.parse(savedPlans);

}

let editingPlanId = null;


/* =========================
   المواد
========================= */

function loadSubjects() {

    const savedSubjects =
        localStorage.getItem(
            "studySubjects"
        );


    const subjects =
        savedSubjects
            ? JSON.parse(savedSubjects)
            : [];


    planSubject.innerHTML = `
        <option value="">
            ${translations[currentLanguage].chooseSubject}
        </option>
    `;


    subjects.forEach((subject) => {

        const option =
            document.createElement("option");


        option.value = subject;

        option.textContent = subject;

        planSubject.appendChild(option);

    });

}


/* =========================
   أسماء الأشهر
========================= */

function getMonthName(
    month,
    year
) {

    const locale =
        currentLanguage === "ar"
            ? "ar-SA"
            : "en-US";


    return new Date(
        year,
        month,
        1
    ).toLocaleDateString(
        locale,
        {
            month: "long",
            year: "numeric"
        }
    );

}


/* =========================
   إنشاء التقويم
========================= */

function renderCalendar() {

    calendarElement.innerHTML = "";


    const year =
        currentCalendarDate.getFullYear();

    const month =
        currentCalendarDate.getMonth();


    calendarMonthElement.textContent =
        getMonthName(
            month,
            year
        );


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const weekDays =
        currentLanguage === "ar"
            ? [
                "الأحد",
                "الإثنين",
                "الثلاثاء",
                "الأربعاء",
                "الخميس",
                "الجمعة",
                "السبت"
            ]
            : [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ];


    weekDays.forEach((day) => {

        const dayName =
            document.createElement("div");


        dayName.classList.add(
            "calendar-weekday"
        );


        dayName.textContent =
            day;


        calendarElement.appendChild(
            dayName
        );

    });


    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const emptyDay =
            document.createElement("div");


        emptyDay.classList.add(
            "calendar-empty"
        );


        calendarElement.appendChild(
            emptyDay
        );

    }


    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const dayElement =
            document.createElement("div");


        dayElement.classList.add(
            "calendar-day"
        );


        dayElement.textContent =
            day;


        const date =
            new Date(
                year,
                month,
                day
            );


        const dateString =
            formatDateForStorage(
                date
            );


        const dayPlans =
            plans.filter(
                (plan) =>
                    dateString >=
                        plan.startDate &&
                    dateString <=
                        plan.endDate
            );


        dayPlans.forEach((plan) => {

            if (
                plan.type ===
                "study-plan"
            ) {

                dayElement.classList.add(
                    "has-study-plan"
                );

            }


            if (
                plan.type ===
                "reminder"
            ) {

                dayElement.classList.add(
                    "has-reminder"
                );

            }

        });


        calendarElement.appendChild(
            dayElement
        );

    }

}


/* =========================
   تنسيق التاريخ
========================= */

function formatDateForStorage(date) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


/* =========================
   تنسيق التاريخ للعرض
========================= */

function formatDisplayDate(
    dateString
) {

    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    const locale =
        currentLanguage === "ar"
            ? "ar-SA"
            : "en-US";


    return date.toLocaleDateString(
        locale,
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================
   الفهرس
========================= */

function renderIndex() {

    plansIndex.innerHTML = "";


    plans.forEach((plan) => {

        const item =
            document.createElement("div");


        item.classList.add(
            "plan-index-item"
        );


        const colorClass =
            plan.type === "study-plan"
                ? "study-plan-color"
                : "reminder-color";


        item.innerHTML = `

            <span
                class="legend-color ${colorClass}"
            ></span>

            <div>

                <strong>
                    ${formatDisplayDate(
                        plan.startDate
                    )}
                </strong>

                —

                <span>
                    ${plan.subject}
                </span>

                <br>

                <small>
                    ${plan.content}
                </small>

            </div>

        `;


        plansIndex.appendChild(
            item
        );

    });

}


/* =========================
   الجدول
========================= */

function renderPlansTable() {

    plansContainer.innerHTML = "";


    plans.forEach((plan) => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${
                    plan.type ===
                    "study-plan"
                        ? translations[
                            currentLanguage
                        ].studyPlan
                        : translations[
                            currentLanguage
                        ].reminder
                }
            </td>

            <td>
                ${plan.subject}
            </td>

            <td>
                ${formatDisplayDate(
                    plan.startDate
                )}
            </td>

            <td>
                ${formatDisplayDate(
                    plan.endDate
                )}
            </td>

            <td>
                ${plan.content}
            </td>

            <td>
                ${getStatusText(
                    plan.status
                )}
            </td>

            <td class="plan-actions">

                <button
                    class="edit-plan-button"
                    data-id="${plan.id}"
                    type="button"
                >
                    ${translations[currentLanguage].edit}
                </button>

                <button
                    class="delete-plan-button"
                    data-id="${plan.id}"
                    type="button"
                >
                    ${translations[currentLanguage].delete}
                </button>

            </td>

        `;


        plansContainer.appendChild(
            row
        );


        /* =====================
           أزرار التعديل والحذف
        ===================== */

        const editButton =
            row.querySelector(
                ".edit-plan-button"
            );

        const deleteButton =
            row.querySelector(
                ".delete-plan-button"
            );


        editButton.addEventListener(
            "click",
            () => {

                const planId =
                    Number(
                        editButton.dataset.id
                    );

                editingPlanId = planId;

                const plan =
                    plans.find(
                        (item) =>
                            item.id === planId
                    );

                if (!plan) return;


                planType.value =
                    plan.type;

                planSubject.value =
                    plan.subject;

                planStartDate.value =
                    plan.startDate;

                planEndDate.value =
                    plan.endDate;

                planContent.value =
                    plan.content;

                planNote.value =
                    plan.note || "";


                planModal.style.display =
                    "flex";

            }
        );


        deleteButton.addEventListener(
            "click",
            () => {

                const planId =
                    Number(
                        deleteButton.dataset.id
                    );

                const confirmed =
                    confirm(
                        currentLanguage === "ar"
                            ? "هل تريدين حذف هذه الخطة؟"
                            : "Do you want to delete this plan?"
                    );

                if (!confirmed) return;


                plans =
                    plans.filter(
                        (plan) =>
                            plan.id !== planId
                    );


                localStorage.setItem(
                    "studyPlans",
                    JSON.stringify(plans)
                );


                renderCalendar();
                renderIndex();
                renderPlansTable();

            }
        );

    });

}


/* =========================
   حالة الخطة
========================= */

function getStatusText(status) {

    const language =
        translations[
            currentLanguage
        ];


    if (
        status === "in-progress"
    ) {

        return language.inProgress;

    }


    if (
        status === "completed"
    ) {

        return language.completed;

    }


    return language.notStarted;

}


/* =========================
   فتح النافذة
========================= */

addPlanButton.addEventListener(
    "click",
    () => {

        planModal.style.display =
            "flex";

    }
);


/* =========================
   إغلاق النافذة
========================= */

cancelPlanButton.addEventListener(
    "click",
    () => {

        planModal.style.display =
            "none";

    }
);


/* =========================
   حفظ الخطة
========================= */

savePlanButton.addEventListener(
    "click",
    () => {

        const subject =
            planSubject.value;


        const startDate =
            planStartDate.value;


        const endDate =
            planEndDate.value;


        const content =
            planContent.value.trim();


        if (
            subject === "" ||
            startDate === "" ||
            endDate === "" ||
            content === ""
        ) {

            alert(
                currentLanguage === "ar"
                    ? "يرجى تعبئة البيانات المطلوبة."
                    : "Please fill in the required fields."
            );

            return;
        }


        if (
            endDate < startDate
        ) {

            alert(
                currentLanguage === "ar"
                    ? "تاريخ النهاية يجب أن يكون بعد تاريخ البداية."
                    : "End date must be after the start date."
            );

            return;

        }


        const newPlan = {

            id: Date.now(),

            type:
                planType.value,

            subject:
                subject,

            startDate:
                startDate,

            endDate:
                endDate,

            content:
                content,

            note:
                planNote.value.trim(),

            status:
                "not-started"

        };


        if (editingPlanId !== null) {

            const plan = plans.find(
                (item) => item.id === editingPlanId
            );

            if (plan) {
                plan.type = newPlan.type;
                plan.subject = newPlan.subject;
                plan.startDate = newPlan.startDate;
                plan.endDate = newPlan.endDate;
                plan.content = newPlan.content;
                plan.note = newPlan.note;
            }

            editingPlanId = null;

        } else {

            plans.push(newPlan);

        }


        localStorage.setItem(
            "studyPlans",
            JSON.stringify(plans)
        );


        clearPlanForm();


        planModal.style.display =
            "none";


        renderCalendar();

        renderIndex();

        renderPlansTable();

    }
);


/* =========================
   تنظيف النموذج
========================= */

function clearPlanForm() {

    planType.value =
        "study-plan";

    planSubject.value =
        "";

    planStartDate.value =
        "";

    planEndDate.value =
        "";

    planContent.value =
        "";

    planNote.value =
        "";

}


/* =========================
   تغيير الشهر
========================= */

previousMonthButton.addEventListener(
    "click",
    () => {

        currentCalendarDate.setMonth(
            currentCalendarDate.getMonth() - 1
        );


        renderCalendar();

    }
);


nextMonthButton.addEventListener(
    "click",
    () => {

        currentCalendarDate.setMonth(
            currentCalendarDate.getMonth() + 1
        );


        renderCalendar();

    }
);


/* =========================
   اللغة
========================= */

function updateLanguage() {

    const language =
        translations[
            currentLanguage
        ];


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
        "index-title"
    ).textContent =
        language.indexTitle;


    document.getElementById(
        "study-plan-label"
    ).textContent =
        language.studyPlans;


    document.getElementById(
        "reminder-label"
    ).textContent =
        language.reminders;


    document.getElementById(
        "plans-title"
    ).textContent =
        language.plansTitle;


    document.getElementById(
        "add-plan-button"
    ).textContent =
        language.addPlan;


    document.getElementById(
        "plan-type-header"
    ).textContent =
        language.type;


    document.getElementById(
        "plan-subject-header"
    ).textContent =
        language.subject;


    document.getElementById(
        "plan-from-header"
    ).textContent =
        language.from;


    document.getElementById(
        "plan-to-header"
    ).textContent =
        language.to;


    document.getElementById(
        "plan-content-header"
    ).textContent =
        language.content;


    document.getElementById(
        "plan-status-header"
    ).textContent =
        language.status;


    document.getElementById(
        "modal-title"
    ).textContent =
        language.modalTitle;


    document.getElementById(
        "plan-type-label"
    ).textContent =
        language.typeLabel;


    document.getElementById(
        "plan-subject-label"
    ).textContent =
        language.subjectLabel;


    document.getElementById(
        "plan-start-label"
    ).textContent =
        language.startLabel;


    document.getElementById(
        "plan-end-label"
    ).textContent =
        language.endLabel;


    document.getElementById(
        "plan-content-label"
    ).textContent =
        language.contentLabel;


    document.getElementById(
        "plan-note-label"
    ).textContent =
        language.noteLabel;


    document.getElementById(
        "cancel-plan-button"
    ).textContent =
        language.cancel;


    document.getElementById(
        "save-plan-button"
    ).textContent =
        language.save;


    document.getElementById(
        "language-button"
    ).textContent =
        language.languageButton;


    planContent.placeholder =
        language.contentPlaceholder;


    planNote.placeholder =
        language.notePlaceholder;


    planType.options[0].textContent =
        language.studyPlan;


    planType.options[1].textContent =
        language.reminder;


    loadSubjects();

    renderCalendar();

    renderIndex();

    renderPlansTable();

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


        updateLanguage();

    }
);


/* =========================
   الإعدادات
========================= */

const settingsButton =
    document.getElementById(
        "settings-button"
    );


settingsButton.addEventListener(
    "click",
    () => {

        window.location.href =
            "settings.html";

    }
);



const homeButton =
    document.getElementById("home-button");

homeButton.addEventListener(
    "click",
    () => {
        window.location.href =
            "index.html";
    }
);
 
/* =========================
   التشغيل الأولي
========================= */

loadSubjects();

renderCalendar();

renderIndex();

renderPlansTable();

updateLanguage();