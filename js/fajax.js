
class FXMLHttpRequest {

    constructor() {
        this.url = "";
        this.status = 0;
        this.readyState = 0;
        this.responseText = "";
        this.method = "";
        this.body = "";
        this.onload = null;
        this.onerror = null;
    }
   //פונקציה פתחית בקשה
    open(method, url) {
        this.readyState = 1;
        this.method = method;
        this.url = url;

    }
    //פונקצית שליחת בקשה
    send(body = null) {
        this.readyState = 2;
        this.body = body;
        network.messageDelivery(this);
        // בדיקה וקריאה לפונקציה onerror במקרה של שגיאה בקבלת התשובה
        if ( typeof this.onload === 'function') {
            this.onload();
        }
        // בדיקה וקריאה לפונקציה onerror במקרה של שגיאה בקבלת התשובה
        if ( typeof this.onerror === 'function') {
            this.onerror();
        }
    }

}



