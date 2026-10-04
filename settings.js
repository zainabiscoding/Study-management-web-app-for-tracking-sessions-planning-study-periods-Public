/* =========================
   المواد الافتراضية
========================= */




/* =========================
   اللغة
========================= */

let currentLanguage =
    localStorage.getItem("studyLanguage") || "ar";
 

const translations = {

    ar: {
        pageTitle: "الإعدادات",

        subjectsTitle: "المواد الدراسية",

        addSubjectLabel: "إضافة مادة جديدة",

        subjectPlaceholder: "اكتب اسم المادة",

        addSubjectButton: "إضافة المادة",

        dangerTitle: "منطقة الخطر",

        dangerDescription:
            "حذف جميع بيانات الدراسة والجلسات والمواد",

        deleteAll: "حذف جميع البيانات",

        backToDashboard:
            "العودة للواجهة الرئيسية",

        deleteSubject: "حذف",

        duplicateSubject:
            "هذه المادة موجودة بالفعل",

        emptySubject:
            "اكتب اسم المادة أولًا",

        confirmDelete:
            "هل تريد حذف مادة",

        confirmAllData:
            "هل أنت متأكدة؟ سيتم حذف جميع الجلسات والمواد وجميع بيانات الدراسة نهائيًا.",

        deletedMessage:
            "تم حذف جميع البيانات.",

        notFound:
            "لم يتم العثور على المادة."
    },


    en: {
        pageTitle: "Settings",

        subjectsTitle: "Subjects",

        addSubjectLabel: "Add New Subject",

        subjectPlaceholder:
            "Enter subject name",

        addSubjectButton: "Add Subject",

        dangerTitle: "Danger Zone",

        dangerDescription:
            "Delete all study data, sessions, and subjects",

        deleteAll: "Delete All Data",

        backToDashboard:
            "Back to Dashboard",

        deleteSubject: "Delete",

        duplicateSubject:
            "This subject already exists.",

        emptySubject:
            "Please enter a subject name first.",

        confirmDelete:
            "Do you want to delete",

        confirmAllData:
            "Are you sure? All study sessions, subjects, and study data will be permanently deleted.",

        deletedMessage:
            "All data has been deleted.",

        notFound:
            "Subject not found."
    }

};


/* =========================
   عناصر الصفحة
========================= */

const subjectsContainer =
    document.getElementById("subjects-container");

const newSubjectInput =
    document.getElementById("new-subject");

const addSubjectButton =
    document.getElementById("add-subject");

const backToDashboardButton =
    document.getElementById("back-to-dashboard");

const deleteAllDataButton =
    document.getElementById("delete-all-data");


/* =========================
   تحميل المواد
========================= */

let subjects = [];

const savedSubjects =
    localStorage.getItem("studySubjects");

if (savedSubjects) {

    subjects = JSON.parse(savedSubjects);

}


/* =========================
   تحديث لغة الصفحة
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


    /* العنوان */

    document.querySelector(
        ".header h1"
    ).textContent =
        language.pageTitle;


    /* المواد */

    document.querySelector(
        ".settings-section h2"
    ).textContent =
        language.subjectsTitle;


    /* إضافة مادة */

    document.querySelector(
        ".add-subject-section label"
    ).textContent =
        language.addSubjectLabel;


    newSubjectInput.placeholder =
        language.subjectPlaceholder;


    addSubjectButton.textContent =
        language.addSubjectButton;


    /* منطقة الخطر */

    const dangerTitle =
        document.querySelector(
            ".danger-zone h2"
        );

    if (dangerTitle) {

        dangerTitle.textContent =
            language.dangerTitle;

    }


    const dangerDescription =
        document.querySelector(
            ".danger-zone p"
        );

    if (dangerDescription) {

        dangerDescription.textContent =
            language.dangerDescription;

    }


    if (deleteAllDataButton) {

        deleteAllDataButton.textContent =
            language.deleteAll;

    }


    /* العودة */

    backToDashboardButton.textContent =
        language.backToDashboard;


    /* إعادة عرض المواد */

    displaySubjects();

}


/* =========================
   عرض المواد
========================= */

function displaySubjects() {

    subjectsContainer.innerHTML = "";


    const language =
        translations[currentLanguage];


    subjects.forEach((subject, index) => {

        const subjectElement =
            document.createElement("div");


        subjectElement.classList.add(
            "setting-subject"
        );


        subjectElement.innerHTML = `

            <span>${subject}</span>

            <button
                class="delete-subject"
                data-index="${index}"
            >
                ${language.deleteSubject}
            </button>

        `;


        subjectsContainer.appendChild(
            subjectElement
        );

    });


    /* أزرار الحذف */

    const deleteButtons =
        document.querySelectorAll(
            ".delete-subject"
        );


    deleteButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const index =
                    Number(
                        button.dataset.index
                    );


                if (
                    index < 0 ||
                    index >= subjects.length
                ) {

                    alert(
                        language.notFound
                    );

                    return;

                }


                const confirmed =
                    confirm(
                        `${language.confirmDelete} "${subjects[index]}"?`
                    );


                if (!confirmed) {
                    return;
                }


                subjects.splice(
                    index,
                    1
                );


                localStorage.setItem(
                    "studySubjects",
                    JSON.stringify(subjects)
                );


                displaySubjects();

            }
        );

    });

}


/* =========================
   إضافة مادة
========================= */

addSubjectButton.addEventListener(
    "click",
    () => {

        const newSubject =
            newSubjectInput.value.trim();


        const language =
            translations[currentLanguage];


        if (newSubject === "") {

            alert(
                language.emptySubject
            );

            return;

        }


        if (
            subjects.includes(
                newSubject
            )
        ) {

            alert(
                language.duplicateSubject
            );

            return;

        }


        subjects.push(
            newSubject
        );


        localStorage.setItem(
            "studySubjects",
            JSON.stringify(subjects)
        );


        newSubjectInput.value = "";


        displaySubjects();

    }
);


/* =========================
   حذف جميع البيانات
========================= */

if (deleteAllDataButton) {

    deleteAllDataButton.addEventListener(
        "click",
        () => {

            const language =
                translations[currentLanguage];


            const confirmed =
                confirm(
                    language.confirmAllData
                );


            if (!confirmed) {
                return;
            }


            localStorage.removeItem(
                "studySessions"
            );

            localStorage.removeItem(
                "studySubjects"
            );

            localStorage.removeItem(
                "studyLanguage"
            );


            alert(
                language.deletedMessage
            );


            window.location.href =
                "index.html";

        }
    );

}


/* =========================
   العودة للرئيسية
========================= */

backToDashboardButton.addEventListener(
    "click",
    () => {

        window.location.href =
            "index.html";

    }
);


/* =========================
   التشغيل الأولي
========================= */

updateLanguage();