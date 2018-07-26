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
        fadein : false,
        option : "Logout"
    }

    setmargin = async (margin) =>
    {
        this.setState({
            logincardmargin: margin
        })
    }

    performLogout = async () =>
    {
        if(this.state.option === "Logout") {
            SocketManager.token = undefined
        }
        this.props.loginMode()
    }

    setOption = async (option) =>
    {
        this.setState({option: option})
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
                <Card body className="text-center" style={{width: "200px", float: "right", marginRight: "10px", marginTop: this.state.logincardmargin, backgroundColor: "#fcf6e5"}}>
                    <CardTitle>{this.props.userInfo.username}</CardTitle>
                    <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                    <Button onClick={this.performLogout} style = {{backgroundColor : "#3d8c95", borderColor: "#3d8c95", shadowColor: "#3d8c95"}}>{this.state.option}</Button>
                </Card>
            </Fade>
        )
    }

}


export default UserCard;