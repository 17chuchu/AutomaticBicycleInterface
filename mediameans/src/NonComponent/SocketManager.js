import ReconnectingWebSocket from 'reconnecting-websocket';


class SocketManager
{
    static subscriber = {}
    static publisher = {}

    static url = 'undefined'
    static handlenewroom = undefined

    static initialize(ip,port)
    {
        console.log('Websocket Begin')
        SocketManager.client = new ReconnectingWebSocket('ws://'+ ip +':' + port + '/');
        SocketManager.client.addEventListener('open', () => {
            console.log("Connection Succeed")
        });

        SocketManager.client.addEventListener('message', (res) => {
            var info = JSON.parse(res.data)
            console.log(info.comment)
            if(info.topic == 'registerNewRoom') {
                SocketManager.subscriber[info.comment.bikeid] = info.comment.clientroomid
                SocketManager.publisher[info.comment.bikeid] = info.comment.bikeroomid
                console.log(SocketManager.handlenewroom)
                if(!(SocketManager.handlenewroom === undefined)) {
                    SocketManager.handlenewroom(info.comment.bikeid)
                }
            }
        });

        SocketManager.client.addEventListener('close', (res) => {
            console.log("Disconnect from server.")
        })

    }
}

export default SocketManager