
class DB {

    //פונקציה להוספת ארוע חדש
    addEvent(ajx) {
        let events = JSON.parse(localStorage.getItem('events')) || [];
        const newEvent = { date: ajx.body.date, event: ajx.body.event, id: ajx.body.id, name: ajx.body.name };
        if (events.some(Event => Event.date === ajx.body.date && Event.event === ajx.body.event && Event.id === ajx.body.id && Event.name === ajx.body.name)) {
            return;
        }
        events.push(newEvent);

        localStorage.setItem('events', JSON.stringify(events));
    }

    // פונקצית למחיקת ארוע
    deleteEvent(ajx) {
        let events = localStorage.getItem('events');
        events = events ? JSON.parse(events) : [];

        let initialLength = events.length;

        events = events.filter(event => !(event.date === ajx.body.date && event.id === ajx.body.id && event.name === ajx.body.name));

        if (events.length === initialLength) {
            ajx.status = 404;
        } else {
            localStorage.setItem('events', JSON.stringify(events));

        }
        return;
    }

    // פונקצית עדכון ארוע 
    updateEvent(ajx) {
        let events = localStorage.getItem('events');
        events = events ? JSON.parse(events) : [];
        let indexToUpdate = events.findIndex(event =>
            event.date === ajx.body.date && event.id === ajx.body.id && event.name === ajx.body.name
        );
        if (indexToUpdate !== -1) {
            events[indexToUpdate].event = ajx.body.event;
            localStorage.setItem('events', JSON.stringify(events));
        }
    }

    //הצגת כל הארועים
    getAllEvents(ajx) {
        let events = JSON.parse(localStorage.getItem('events')) || [];
        return events.filter(event => event.id === ajx.body.id && event.name === ajx.body.name);
    }

    // פונקציה לרישום משתמש חדש
    adduser(newUser) {
        let usersArray = this.GetArrayUsers();
        usersArray.push(newUser);
        localStorage.setItem("Users", JSON.stringify(usersArray));
        return;
    }
    //פונקצית שליפת מערך המשתמשים
    GetArrayUsers() {
        let usersArray = JSON.parse(localStorage.getItem("Users")) || [];
        return usersArray;
    }

    //פונקצית שליפת מערך הארועים
    GetArrayEvents() {
        let events = JSON.parse(localStorage.getItem('events')) || [];
        return events.filter(event => event.id === ajx.body.id && event.name === ajx.body.name);
    }

}
let db = new DB();