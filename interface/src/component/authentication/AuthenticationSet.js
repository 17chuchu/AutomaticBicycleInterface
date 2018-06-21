


import React from "react"
import LoginCard from "./LoginCard";
import UserCard from "./UserCard";

import {
    Card ,CardTitle, CardText, CardHeader
    , Button
    , Fade
    , Form, FormGroup, Label, Col, Input
} from 'reactstrap';

class AuthenticationSet extends React.Component
{
    bundle = React.createRef();
    loginCard = React.createRef();
    userCard = React.createRef();

    constructor(props)
    {
        super(props)
        /*var temp = this.authenset[0]
        this.authenset[0] = this.authenset[1]
        this.authenset[1] = temp*/
    }

    handleExisted = async () =>
    {
        this.props.setLoginButton(false)
        this.loginCard.current.setmargin("-600px")
        this.userCard.current.setmargin("-600px")
    }

    handleEnter = async () =>
    {
        this.props.forceCollapse()
        this.props.setLoginButton(true)


        //localStorage.setItem('bikeappnum' + this.state.allBikeId.length, id)
        //!(localStorage.getItem('bikeappnum' + num) === null

        this.loginMode()
        //this.userMode()
    }

    loginMode = async() =>
    {
        this.loginCard.current.setmargin("10px")
        this.userCard.current.setmargin("-600px")
    }

    userMode = async() =>
    {
        this.userCard.current.setmargin("10px")
        this.loginCard.current.setmargin("-600px")
    }

    componentWillMount()
    {
        document.addEventListener('mousedown',this.handleClick,false);
    }

    componentWillUnmount()
    {
        document.removeEventListener('mousedown',this.handleClick,false);
    }

    handleClick = async (e) =>
    {
        if(!this.bundle.current.contains(e.target) && this.props.loginTog)
        {
            this.props.toggleLogin()
        }
    }

    render()
    {
        return(
            <Fade in={this.props.loginTog} onExited={this.handleExisted} onEnter={this.handleEnter} style={{marginTop: "-60px"}}>
                <div ref={this.bundle}>
                    <LoginCard ref={this.loginCard} loginTog = {this.props.loginTog} toggleLogin = {this.props.toggleLogin} setBikeId = {this.props.setBikeId} setLoginButton = {this.props.setLoginButton} forceCollapse={this.props.forceCollapse} userMode={this.userMode}/>,
                    <UserCard ref={this.userCard}/>
                </div>
            </Fade>
        )
    }
}

export default AuthenticationSet