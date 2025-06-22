
class Network {

     //העברת הבקשה לשרת
     messageDelivery(ajx) {
        server.funcServer(ajx);
    }
}

let network = new Network();

