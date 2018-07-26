import ReconnectingWebSocket from 'reconnecting-websocket';

class SocketManager
{
    static client = undefined
    static token = undefined
    static loginUser = undefined

    static selectedBike = undefined
    static isBikeOnline = "Offline"

    static handlelogin = undefined
    static handlecheckbike = undefined
    static handleaskforvideo = undefined
    static handleaskforcontrol = undefined

    static targeturl = undefined

    static activitycode = {
        default :   0,
        login   :   1,
        checkbike:  2,
        askforvideo:3,
        givedirection:4,
        askforcontrol:5,
        visitorlogin:6,
    }

    static initialize(ip,port)
    {
        SocketManager.client = new ReconnectingWebSocket('ws://'+ ip +':' + port + '/');
        SocketManager.client.addEventListener('open', () => {
            console.log("Connection Succeeded")
            SocketManager.visitorlogin()
        });

        SocketManager.client.addEventListener('message', (res) => {
            var info = JSON.parse(res.data)
            console.log(info)
            switch(info.code) {
                case SocketManager.activitycode.login:
                    SocketManager.token = info.pack
                    if(info.info === undefined) {
                        if(info.pack === undefined)
                        {
                            if (!(SocketManager.handlelogin === undefined)) {
                                SocketManager.handlelogin("Login Unsuccessful.")
                            }
                        }
                        else
                        {
                            SocketManager.handlelogin("Visitor Login Successful.")
                        }
                    }
                    else {
                        SocketManager.loginUser = JSON.parse(info.info)

                        if (!(SocketManager.handlelogin === undefined)) {
                            SocketManager.handlelogin(info)
                        }
                    }
                    break

                case SocketManager.activitycode.visitorlogin:
                    SocketManager.token = info.pack
                    break

                case SocketManager.activitycode.checkbike:
                    SocketManager.selectedBike = info.pack.bikeid
                    SocketManager.isBikeOnline = info.pack.isBikeOnline

                    if(!(SocketManager.handlecheckbike === undefined))
                    {
                        SocketManager.handlecheckbike(info)
                    }
                    break

                case SocketManager.activitycode.askforvideo:
                    if(!(SocketManager.handleaskforvideo === undefined))
                    {
                        SocketManager.handleaskforvideo(info)
                    }
                    break

                case SocketManager.activitycode.askforcontrol:
                    if(!(SocketManager.handleaskforcontrol === undefined))
                    {
                        SocketManager.handleaskforcontrol(info)
                    }
                    break

                default:
                    return null;
            }
        });

    }

    static packMassage(code,data)
    {
        var pack = {code : code, pack : data}
        if(!(SocketManager.token === undefined))
        {
            pack.token = SocketManager.token
        }
        return JSON.stringify(pack)
    }

    static login(email,password)
    {
        const info = {email : email, password : password}
        const data = JSON.stringify(info)
        const pack = SocketManager.packMassage(SocketManager.activitycode.login,data)

        SocketManager.client.send(pack)
    }

    static visitorlogin()
    {
        const info = {visitorid : "sample"}
        const data = JSON.stringify(info)
        const pack = SocketManager.packMassage(SocketManager.activitycode.visitorlogin,data)

        SocketManager.client.send(pack)
    }

    static checkbike(id)
    {
        const info = {bikeid : id}
        const data = JSON.stringify(info)
        const pack = SocketManager.packMassage(SocketManager.activitycode.checkbike,data)

        SocketManager.client.send(pack)
    }

    static askforvideo(id)
    {
        const info = {bikeid : id}
        const data = JSON.stringify(info)
        const pack = SocketManager.packMassage(SocketManager.activitycode.askforvideo,data)
        SocketManager.client.send(pack)
    }

    static giveBikeDirection(updown,leftright)
    {
        if(this.selectedBike === undefined || this.isBikeOnline === "Offline")
        {
            console.log("There is no connection to a bike.")
            return
        }

        var direction = updown.slice(0)
        for(var ele of leftright)
        {
            if(!direction.includes(ele)) {
                direction.push(ele)
            }
        }
        const info = {bikeid : this.selectedBike,direction : direction}
        const data = JSON.stringify(info)
        const pack  = SocketManager.packMassage(SocketManager.activitycode.givedirection,data)
        SocketManager.client.send(pack)
    }

    static askForToggleControl(status)
    {
        const info = {bikeid : this.selectedBike,status: status}
        const data = JSON.stringify(info)
        const pack  = SocketManager.packMassage(SocketManager.activitycode.askforcontrol,data)
        SocketManager.client.send(pack)
    }

}


export default SocketManager