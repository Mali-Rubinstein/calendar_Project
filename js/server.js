
class Server {

    funcServer(ajx) {
        try {
            if (ajx.body) {
                try {
                    ajx.body = JSON.parse(ajx.body);
                } catch (e) {
                    ajx.responseText = "פורמט נתונים שגוי";
                    ajx.status = 400; // בקשה שגויה
                    return;
                }
            }
            switch (ajx.url) {

                case 'http://Calendar_Mannagement_System/signUp':
                    this.SignUpServer(ajx.body.passwordSU, ajx.body.usernameSU, ajx);
                    break;
                case 'http://Calendar_Mannagement_System/login':
                    this.LoginServer(ajx.body.password, ajx.body.userName, ajx);
                    break;
                case 'http://Calendar_Mannagement_System/event':
                    if (ajx.method === 'POST') {
                        db.addEvent(ajx);
                        ajx.responseText = ("הארוע נוסף בהצלחה")
                        ajx.status = 200;
                    } else if (ajx.method === 'GET') {
                        let myEvents = db.getAllEvents(ajx);
                        if (!myEvents) {
                            ajx.responseText = ("אין ארועים להצגה")
                            ajx.status = 404; // לא נמצא
                            return;
                        }
                        myEvents = Array.isArray(myEvents) ? myEvents : [];
                        ajx.responseText = JSON.stringify(myEvents);
                    } else if (ajx.method === 'PUT') {
                        db.updateEvent(ajx);
                        ajx.responseText = ("הארוע עדכן בהצלחה")
                        ajx.status = 200;
                    } else {
                        db.deleteEvent(ajx);
                        if (ajx.status === 200) {
                            ajx.responseText = ("הארוע נמחק בהצלחה")
                        }
                        else {
                            ajx.responseText = ("לא נמצא ארוע בתאריך זה")
                        }


                    }
                    break;
                default:
                    throw ("הבקשה אינה מוכרת")

            }
        } catch (error) {
            ajx.readyState = 4; // סיום ביצוע הבקשה
            ajx.status = 500; // שגיאה פנימית בשרת
            ajx.responseText = error;
        }
        ajx.readyState = 4;

    }
    //פונקצית הרשמה בשרת
    SignUpServer(passwordSU, usernameSU, ajx) {

        let usersArray = db.GetArrayUsers();
        if (usersArray.some(User => User.userName === usernameSU && User.password === passwordSU)) {
            ajx.responseText = ("נמצא משתמש עם נתונים זהים, הכנס כמשתמש קיים")
            ajx.status = 404; // בעיה בבקשה
            return;
        }
        const newUser = { userName: usernameSU, password: passwordSU };

        db.adduser(newUser);

        ajx.responseText = "הרישום הושלם בהצלחה!:" + newUser.userName + ':' + newUser.password;
        ajx.status = 200;
        return;
    }
    //פונקצית התחברות בשרת
    LoginServer(password, username, ajx) {
        let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
        if (db.GetArrayUsers() === null) {
            ajx.responseText = ("פרטייך לא נמצאו במערכת אנא הרשם מחדש!")
            ajx.status = 404; // לא נמצא
        } else {
            currentUser = { userName: username, password: password };
            let usersArray = db.GetArrayUsers();
            let userIndex = usersArray.findIndex(user => user.userName === currentUser.userName && user.password === currentUser.password);
            if (userIndex !== -1) {
                localStorage.setItem("currentUser", JSON.stringify(currentUser));
                ajx.responseText = ("התחברות מוצלחת")
                ajx.status = 200;
            } else {
                ajx.responseText = ("פרטייך לא נמצאו במערכת אנא הרשם מחדש!")
                ajx.status = 404; // לא נמצא
            }
        }
    }


}


let server = new Server();
