


class ClientObject
{
    id = ""
    autoritytag = ""
    username = ""
    password = ""
    email = ""

    static toJsonStr(clientobj)
    {
        var info = { id : clientobj.id, username : clientobj.username, password : clientobj.password,email : clientobj.email}
        var data = JSON.stringify(info)
        return data
    }

    static toObject(clientstr)
    {
        var info = JSON.parse(clientstr)
        var client = ClientObject()
        client.id = info.id
        client.autoritytag = info.autoritytag
        client.username = info.username
        client.password = info.password
        client.email = info.email
        return client
    }
}