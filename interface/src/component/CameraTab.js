import React from "react"

import SwitchAnimation from '../component/lottie/SwitchAnimation'

import SimpleWebRTC from 'simplewebrtc'
import ReactDOM from 'react-dom'


import $ from 'jquery';
import uuidv1 from 'uuid/v1'



import {
    TabPane,
    Fade,
    Container, Row, Col,
    Alert
} from 'reactstrap';
import SocketManager from "../non-component/SocketManager";
import WifiAnimation from "./lottie/WifiAnimation";




class CameraTab extends React.Component
{

    webrtc = undefined
    switch = React.createRef();
    isReady = false

    state = {
        switchlock: false,
        visible: false,
        waitsecond: 10
    }

    constructor(props)
    {
        super(props)
        SocketManager.handleaskforvideo = this.handleReceiveRoomId
        SocketManager.handleaskforcontrol = this.handleAskForControl
    }

    componentDidMount() {
        //'http://versuch.ess-project.ovgu.de:8080'
        this.webrtc = new SimpleWebRTC({
            url: 'http://141.44.17.141:8080'
        });
        this.webrtc.on('videoAdded', this.addVideo);
        this.webrtc.on('videoRemoved', this.removeVideo);

        console.log("webrtc component mounted");
    }

    addVideo = async (video, peer) => {
        console.log('video added', peer);
        //  console.log(this.refs.remotes);
        var remotes = ReactDOM.findDOMNode(this.refs.remotes);
        console.log(video);
        if (remotes) {
            var container = document.createElement('div');
            container.style.transform = 'rotateY(-180deg)'
            container.className = 'videoContainer';
            container.id = 'container_' + this.webrtc.getDomId(peer);
            container.appendChild(video);
            // suppress contextmenu
            video.oncontextmenu = function() {
                return false;
            };
            video.width = 800
            video.muted = true
            console.log(container);
            remotes.appendChild(container);
        }
        this.webrtc.mute()
    }

    removeVideo = async(video, peer) => {
        console.log('video removed ', peer);
        var remotes = ReactDOM.findDOMNode(this.refs.remotes);
        var el = document.getElementById(peer ? 'container_' +       this.webrtc.getDomId(peer) : 'localScreenContainer');
        if (remotes && el) {
            remotes.removeChild(el);
        }
    }

    readyToCall = async () => {
        console.log("Connect to room");
        this.isReady = true;
    }

    disconnectCall = async () => {
        console.log("Disconnect from room");
        return this.webrtc.leaveRoom();
    }

    forceswitchOff = async () => {
        if(this.switch.current.state.isOnOff)
        {
            this.switch.current.toggleswitch()
        }
    }

    beginToCall = async () => {
        SocketManager.askforvideo(SocketManager.selectedBike)
    }

    handleReceiveRoomId = async (info) => {
        console.log(info.pack.token)
        this.webrtc.joinRoom(info.pack.token);
    }

    updown = [];
    leftright = [];

    handleKeyUp = async (event) => {
        if(event.key == 's'){
            this.updown.pop("down")
        }
        if(event.key == 'w'){
            this.updown.pop("up")
        }
        if(event.key == 'd'){
            this.leftright.pop("right")
        }
        if(event.key == 'a'){
            this.leftright.pop("left")
        }
        SocketManager.giveBikeDirection(this.updown,this.leftright)
        console.log(this.updown,this.leftright)
    }

    handleKeyDown = async (event) => {
        if(event.key == 's') {
            if (!this.updown.includes("down")) {
                this.updown.push("down")
                SocketManager.giveBikeDirection(this.updown,this.leftright)
            }
        }
        if(event.key == 'w'){
            if (!this.updown.includes("up")) {
                this.updown.push("up")
                SocketManager.giveBikeDirection(this.updown,this.leftright)
            }
        }
        if(event.key == 'd'){
            if (!this.leftright.includes("right")) {
                this.leftright.push("right")
                SocketManager.giveBikeDirection(this.updown,this.leftright)
            }
        }
        if(event.key == 'a'){
            if (!this.leftright.includes("left")) {
                this.leftright.push("left")
                SocketManager.giveBikeDirection(this.updown,this.leftright)
            }
        }
        console.log(this.updown,this.leftright)
    }

    handleFocus = async () => {
        SocketManager.askForToggleControl("true")
    }

    handleBlur = async () => {
        SocketManager.askForToggleControl("false")
    }

    onDismiss = async () => {
        this.setState({ visible: false });
    }

    handleAskForControl = async (info) => {
        console.log("waittime is",info.pack)
        this.setState({visible: true,waitsecond: info.pack})
    }

    render()
    {
        return(
            <TabPane tabId="CameraTab">
                <Alert color="warning" isOpen={this.state.visible} toggle={this.onDismiss} style = {{ marginRight: "10px",marginLeft: "10px"}}>
                    There is someone else controlling this bike. Please wait {this.state.waitsecond} seconds and try again.
                </Alert>
                <Container>
                    <Row>
                        <Col><SwitchAnimation ref={this.switch} readyToCall={this.beginToCall} disconnectCall={this.disconnectCall} isLock={this.state.switchlock}/></Col>
                        <Col><WifiAnimation onKeyUp={this.handleKeyUp} onKeyDown={this.handleKeyDown} onFocus={this.handleFocus} onBlur={this.handleBlur}/></Col>
                    </Row>
                </Container>
                <Fade className="CameraTabContainer" in={this.props.active == "CameraTab"} ref = "remotes">
                    <div
                        className="videoContainer"
                        id = "remoteVidd"
                        ref = "remotes" >
                    </div>
                </Fade>
            </TabPane>
        );
    }
}


export default CameraTab
