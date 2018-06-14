import React from "react"

import Titles from "./component/SearchBike"
import RealtimeTab from "./component/RealtimeTab"
import CameraTab from "./component/CameraTab"
import SearchBike from "./component/SearchBike"
import BlockUi from 'react-block-ui';
import ReconnectingWebSocket from 'reconnecting-websocket';

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-block-ui/style.css';


import {
    Nav, NavItem, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, NavLink, Container, Row, Col, TabContent, TabPane, Button, Collapse, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';




class App extends React.Component
{
    localStream;
    localVideoRef = React.createRef();
    remoteVideoRef = React.createRef();
    localsource = undefined;
    remoteVideo = this.remoteVideoRef.current;

    serverConnection;
    peerConnectionConfig = {'iceServers': [{'url': 'stun:stun.services.mozilla.com'}, {'url': 'stun:stun.l.google.com:19302'}]};


    constructor(props)
    {
        super(props)

        navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
        window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
        window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;

        this.pageReady()
    }

    pageReady = async () => {
        this.serverConnection = new WebSocket('ws://localhost:7000/');
        //this.serverConnection.onmessage = gotMessageFromServer;

        var constraints = {
            video: true,
            audio: true,
        };

        if(navigator.getUserMedia) {
            navigator.getUserMedia(constraints, this.getUserMediaSuccess, this.getUserMediaError);
        } else {
            alert('Your browser does not support getUserMedia API');
        }
    }

    getUserMediaSuccess = async (stream) => {
        this.localStream = stream;
        this.localsource = window.URL.createObjectURL(stream);
    }
    getUserMediaError = async (error) => {
        console.log(error);
    }


    render()
    {
        return(
            <div>
                <video ref={this.localVideoRef} src={this.localsource} width={800} autoPlay={true} muted={true}></video>
                <video id="remoteVideo" autoplay style={{width:40}} ref={this.remoteVideoRef}></video>
            </div>
        );
    }
};



export default App;



