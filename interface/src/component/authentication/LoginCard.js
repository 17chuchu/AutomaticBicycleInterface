import React from "react"
import ReactDOM from 'react-dom'
import LoginAnimation from '../../component/lottie/LoginAnimation'

import {
    Card ,CardTitle, CardText, CardHeader
    , Button
    , Fade
    , Form, FormGroup, Label, Col, Input
    , FormFeedback
} from 'reactstrap';
import SocketManager from "../../non-component/SocketManager";


class LoginCard extends React.Component
{
    username = React.createRef();
    password = React.createRef();

    state = {
        logincardmargin : "-600px",
        loginpresent : false,
        fadein : true,

        usernameInvalid : false,
        passwordValid : false,

        userinfo : undefined
    }

    constructor(props)
    {
        super(props)
        SocketManager.handlelogin = this.handlelogin
    }

    setmargin = async (margin) =>
    {
        this.setState({
            logincardmargin: margin
        })
    }

    setfade = async (fade) =>
    {
        this.setState({fadein: fade})
    }

    performLogin = async () =>
    {
        this.setState({loginpresent : true})
        SocketManager.login(this.username.value,this.password.value)
        this.password.value = ""
    }

    handlelogin = async (data) =>
    {
        if(data === "Login Unsuccessful.")
        {
            this.setState({usernameInvalid : true, passwordValid : true})
        }
        else if(data === "Visitor Login Successful.")
        {
            this.props.visitorMode()
        }
        else
        {
            this.props.loadUserInfo(JSON.parse(data.info))
            this.props.userMode()
            this.setState({usernameInvalid : false, passwordValid : false})
        }
        this.setState({loginpresent : false})
    }



    render() {
        return (
            <Fade in={this.state.fadein} >
                    <Card body className="text-center" style={{width: "500px", float: "right", marginRight: "10px", marginTop: this.state.logincardmargin,zIndex: "100", backgroundColor: "#fcf6e5"}}>
                        <CardTitle style = {{color : "#c34580"}}>Welcome</CardTitle>
                        {this.state.loginpresent && <LoginAnimation/>}
                        <Form style={{marginTop: "20px"}} onSubmit = {this.performLogin}>
                            <FormGroup row>
                                <Label for="exampleEmail" style = {{color : "#bd535b"}} sm={3}>Email</Label>
                                <Col sm={9}>
                                    <Input invalid={this.state.usernameInvalid} innerRef={input => (this.username = input)} type="email" name="email" id="exampleEmail" placeholder="enter your email" />
                                    <FormFeedback tooltip>Please, try another email</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="examplePassword" style = {{color : "#bd535b"}} sm={3}>Password</Label>
                                <Col sm={9}>
                                    <Input invalid={this.state.passwordValid} innerRef={input => (this.password = input)} ref={this.password} type="password" name="password" id="examplePassword" placeholder="enter your password" />
                                    <FormFeedback tooltip>Please, try another password</FormFeedback>
                                </Col>
                            </FormGroup>
                        </Form>
                        <Button onClick={this.performLogin} type="submit" style = {{backgroundColor : "#ec5731", borderColor: "#ec5731", shadowColor: "#ec5731"}}>Login</Button>
                        <Button style = {{marginTop : "5px", backgroundColor : "#eeb850", borderColor: "#eeb850"}} >Register</Button>
                    </Card>
            </Fade>
        )
    }
}




export default LoginCard