import React from "react"
import {
    Card ,CardTitle, CardText, CardHeader
    , Button
    , Fade
    , Form, FormGroup, Label, Col, Input
} from 'reactstrap';

import SocketManager from "../../non-component/SocketManager";

class UserCard extends React.Component
{
    state = {
        logincardmargin : "-600px",
        fadein : false
    }

    setmargin = async (margin) =>
    {
        this.setState({
            logincardmargin: margin
        })
    }

    performLogout = async () =>
    {
        SocketManager.token = undefined
        this.props.loginMode()
    }


    constructor(props)
    {
        super(props)
    }

    setfade = async (fade) =>
    {
        this.setState({fadein: fade})
    }

    render()
    {
        return(
            <Fade in={this.state.fadein}>
                <Card body className="text-center" style={{width: "200px", float: "right", marginRight: this.state.logincardmargin, marginTop: "10px", backgroundColor: "#fcf6e5"}}>
                    <CardTitle>{this.props.userInfo.username}</CardTitle>
                    <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                    <Button onClick={this.performLogout} style = {{backgroundColor : "#3d8c95", borderColor: "#3d8c95", shadowColor: "#3d8c95"}}>Logout</Button>
                </Card>
            </Fade>
        )
    }

}


export default UserCard;