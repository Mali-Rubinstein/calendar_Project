
var ajx = new FXMLHttpRequest();
const monthNames = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
const daysElement = document.getElementById('days');
const monthElement = document.getElementById('month');
const yearElement = document.getElementById('year');
let currentDate = new Date();
currentDate.setFullYear(2024);git init


//פונקציה המעדכנת את הלוח הנוכחי לפי הארועים של המשתמש הנוכחי
 function renderCalendar(date) {
    let allEvents = [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let body = {
        id: currentUser.password,
        name: currentUser.userName
    };
    ajx.open("GET", 'http://Calendar_Mannagement_System/event')
    ajx.onload = function () {
        if (ajx.status === 200 && ajx.readyState === 4) {

            allEvents = JSON.parse(ajx.responseText);
            buildCalendar(date, allEvents);
        }
    };

    ajx.send(JSON.stringify(body));
}

//פונקציה שבונה את הלוח הנוכחי 
 function buildCalendar(date, allEvents) {
    date.setDate(1);
    const month = date.getMonth();
    const year = date.getFullYear();
    const firstDayIndex = date.getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();
    const lastDayIndex = new Date(year, month + 1, 0).getDay();
    const nextDays = 7 - lastDayIndex - 1;

    monthElement.innerHTML = monthNames[month];
    yearElement.innerHTML = year;
    let days = "";
    let today = new Date();
    for (let x = firstDayIndex; x > 0; x--) {
        days += `<div class="prev-date">${prevLastDate - x + 1}</div>`;
    }
    for (let i = 1; i <= lastDate; i++) {
        let dateStr = `${year}-${month + 1}-${i}`;
        let event = allEvents.find(event => event.date === dateStr);
        let eventText = event ? event.event : '';
        let isToday = i === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
        let backgroundColor = isToday ? '#87CEFA' : eventText ? '#FFD700' : 'transparent';

        days += `<div class="${isToday ? 'today' : ''}" data-date="${dateStr}" style="background-color: ${backgroundColor}">${i}<div class="event">${eventText}</div></div>`;
    }
    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="next-date">${j}</div>`;
    }
    daysElement.innerHTML = days;
    document.querySelectorAll('.days div').forEach(day => {//מציאת היום שעליו אני עומדת בלוח הנוכחי שלי
        day.addEventListener('click', function () {//מבצע עדכון בעת לחיצה לפי התנאים הנל
            const clickedDate = this.getAttribute('data-date');
            if (clickedDate) {
                let event = allEvents.find(event => event.date === clickedDate);
                if (event) {
                    const newEventText = prompt(`עדכון אירוע ב-${clickedDate}:`, event.event);
                    if (newEventText !== null) {
                        updateEvent(clickedDate, newEventText);//קריאה לפונקתית העדכון
                    }
                } else {
                    const confirmation = confirm(`התאריך שנבחר הוא: ${clickedDate}\nהאם ברצונך להוסיף אירוע חדש?`);
                    if (confirmation) {
                        const newEventText = prompt(`הוספת אירוע ל-${clickedDate}`);
                        if (newEventText !== null) {
                            addEvent(clickedDate, newEventText);//קריאה לפונקתית ההוספת ארוע
                        }
                    }
                }
            }
        });
    });
};

//החודשים הקודמים
document.getElementById('prevMonth').addEventListener('click', () => {
    if (currentDate.getFullYear() === 2024 && currentDate.getMonth() === 0) return;
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

//החודשים הבאים
document.getElementById('nextMonth').addEventListener('click', () => {
    if (currentDate.getFullYear() === 2024 && currentDate.getMonth() === 11) return;
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

//רענון הלוח לפני שנכנסים אליו 
document.getElementById('bookCover').addEventListener('click', () => {
    renderCalendar(currentDate);
});

//הרשמת משתמש חדש
document.getElementById('submitsignUp').addEventListener('click', (event) => {
    event.preventDefault();
    const form2 = document.getElementById("signUpForm");
    const username = form2["usernameSU"].value;
    const password = form2["passwordSU"].value;
    const confirmPassword = form2["authentication"].value;
    if (password !== confirmPassword) {
        alert("הסיסמה והאימות אינם זהים")
    }
    else {
        let body = {
            usernameSU: username,
            passwordSU: password,
        }
        ajx.open("POST", 'http://Calendar_Mannagement_System/signUp')
        ajx.onload = function () {
            if (ajx.status === 200 && ajx.readyState === 4) {
                const responseText = ajx.responseText;
                const parts = responseText.split(":"); // מפרידים לפי :
                const alertMessage = parts[0].trim(); // הודעת ה-alert, עם ניקוי של רווחים מיותרים
                const usernameAndPassword = parts.slice(1).join(":").trim(); // החלק עם שם המשתמש והסיסמה
                const currentUserParts = usernameAndPassword.split(":");
                const username = currentUserParts[0].trim();
                const password = currentUserParts[1].trim();
                const currentUser = { userName: username, password: password };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                alert(alertMessage);
                navigateTo('bookCover');
            }
        };


        ajx.onerror = function () {
            if (ajx.status !== 200 || ajx.readyState !== 4) {
                alert(ajx.responseText);
                navigateTo('login_form');
            }
        };
        ajx.send(JSON.stringify(body));
    }

    document.getElementById('usernameSU').value = '';
    document.getElementById('passwordSU').value = '';
    document.getElementById('authentication').value = '';

});

//כניסת משתמש קיים
document.getElementById('submitLogin').addEventListener('click', (event) => {
    event.preventDefault();
    const form1 = document.getElementById("loginForm");
    const username = form1["username"].value;
    const password = form1["password"].value;
    let body = {
        userName: username,
        password: password
    }
    ajx.open("POST", 'http://Calendar_Mannagement_System/login')
    ajx.onload = function () {
        if (ajx.status === 200 && ajx.readyState === 4) {


            alert(ajx.responseText);
            navigateTo('bookCover');
        }
    };
    ajx.onerror = function () {
        if (ajx.status !== 200 || ajx.readyState !== 4) {
            alert(ajx.responseText);
            navigateTo('signUp_form');
        }
    };
    ajx.send(JSON.stringify(body));
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
});


//הצגת כל הארועים בעת לחיצה
document.getElementById('allEvents').addEventListener('click', allEvents);

//מחיקת ארוע בעת לחיצה
document.getElementById('deleteEvent').addEventListener('click', () => {
    const eventDate = prompt('אנא ציין את תאריך האירוע למחיקה (YYYY-MM-DD):');
    deleteEvent(eventDate)
});

//בעת לחיצה נווט לטופס הכניסה
document.getElementById('navigateToLogin').addEventListener('click', (event) => {
    navigateTo('login_form');
});

// בעת לחיצה נווט לטופס ההרשמה
document.getElementById('navigateToSignUP').addEventListener('click', (event) => {
    navigateTo('signUp_form');
});

//נווט בעת לחיצה לעמוד ללוח
document.getElementById('CurrentCalendar').addEventListener('click', (event) => {
    navigateTo('calendar');
});

//פונקציה לננוט לדף הבית
document.addEventListener('DOMContentLoaded', function () {
    const elements = document.getElementsByClassName('backHome');
    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', function () {
            navigateTo('home');
        });
    }
});

//התנתקות
document.getElementById('logOut').addEventListener('click', (event) => {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    currentUser.password = null;
    currentUser.userName = null;
    localStorage.setItem('currentUser', JSON.stringify(currentUser))
    navigateTo('home');
});

//פונקצית שמציגה את כל הארועים
function allEvents() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let body = {
        id: currentUser.password,
        name: currentUser.userName
    };
    ajx.open("GET", 'http://Calendar_Mannagement_System/event')
    ajx.onload = function () {
        let eventText = '';
        let response = JSON.parse(ajx.responseText);
        if (ajx.status === 200 && ajx.readyState === 4) {

            for (let i = 0; i < response.length; i++) {
                eventText += `תאריך: ${response[i].date}, אירוע: ${response[i].event}\n`;
            }
            alert(eventText);
        }
    };

    ajx.onerror = function () {
        if (ajx.status !== 200 || ajx.readyState !== 4) {
            alert(ajx.responseText);
        }
    };

    ajx.send(JSON.stringify(body));
}

//פונקציה שמוחקת ארוע מסוים
function deleteEvent(eventDate) {
    if (eventDate) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        let body = {
            date: eventDate,
            id: currentUser.password,
            name: currentUser.userName
        };
        ajx.open("DELETE", 'http://Calendar_Mannagement_System/event')
        ajx.onload = function () {
            if (ajx.status === 200 && ajx.readyState === 4) {
                alert(ajx.responseText);
                renderCalendar(new Date(eventDate));
            }
        };

        ajx.onerror = function () {
            if (ajx.status !== 200 || ajx.readyState !== 4) {
                alert(ajx.responseText);

            }
        };

        ajx.send(JSON.stringify(body));

    }
};


// פונקציה להוספת אירוע
function addEvent(clickedDate, newEventText) {
    if (newEventText.trim() !== "" && localStorage.getItem('currentUser')) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let body = {
            date: clickedDate,
            event: newEventText,
            id: currentUser.password,
            name: currentUser.userName
        };
        ajx.open("POST", 'http://Calendar_Mannagement_System/event');
        ajx.onload = function () {
            if (ajx.status === 200 && ajx.readyState === 4) {
                alert(ajx.responseText);
                renderCalendar(currentDate);
            }
        };
        ajx.send(JSON.stringify(body));
    } else if (newEventText.trim() === "") {
        alert("לא ניתן להוסיף אירוע ריק. אנא הזן תוכן.");
    }
}

// פונקציה לעדכון אירוע
function updateEvent(clickedDate, newEventText) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let body = {
        date: clickedDate,
        event: newEventText,
        id: currentUser.password,
        name: currentUser.userName
    };
    if (body.event !== '') {
        ajx.open("PUT", 'http://Calendar_Mannagement_System/event');
        ajx.onload = function () {
            if (ajx.status === 200 && ajx.readyState === 4) {
                alert(ajx.responseText);
                renderCalendar(currentDate);
            }
        };
        ajx.onerror = function () {
            if (ajx.status !== 200 || ajx.readyState !== 4) {
                alert(ajx.responseText);
            }
        };
        ajx.send(JSON.stringify(body));
    } else {
        deleteEvent(clickedDate);
    }
}

