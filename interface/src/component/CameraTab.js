import React from "react"
import { Player } from 'video-react';
import "/Users/slimshady23/GitHubProject/AutomaticBicycleInterface/interface/node_modules/video-react/dist/video-react.css";

import SwitchAnimation from '../component/lottie/SwitchAnimation'

import SimpleWebRTC from 'simplewebrtc'
import ReactDOM from 'react-dom'

import $ from 'jquery';

import { OpenVidu, Session, Stream } from 'openvidu-browser';


import {
     TabPane, Fade
} from 'reactstrap';


function getToken(mySessionId) {
    return createSession(mySessionId).then(sessionId => createToken(sessionId));
}

const OPENVIDU_SERVER_URL = "https://" + window.location.hostname + ":4443";

function createSession(sessionId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: OPENVIDU_SERVER_URL + "/api/sessions",
            data: JSON.stringify({ customSessionId: sessionId }),
            headers: {
                "Authorization": "Basic " + btoa("OPENVIDUAPP:MY_SECRET"),
                "Content-Type": "application/json"
            },
            success: response => resolve(response.id),
            error: (error) => {
                if (error.status === 409) {
                    resolve(sessionId);
                } else {
                    console.warn('No connection to OpenVidu Server. This may be a certificate error at ' + OPENVIDU_SERVER_URL);
                    if (window.confirm('No connection to OpenVidu Server. This may be a certificate error at \"' + OPENVIDU_SERVER_URL + '\"\n\nClick OK to navigate and accept it. ' +
                            'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' + OPENVIDU_SERVER_URL + '"')) {
                        window.location.assign(OPENVIDU_SERVER_URL + '/accept-certificate');
                    }
                }
            }
        });
    });
}

function createToken(sessionId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: OPENVIDU_SERVER_URL + "/api/tokens",
            data: JSON.stringify({ session: sessionId }),
            headers: {
                "Authorization": "Basic " + btoa("OPENVIDUAPP:MY_SECRET"),
                "Content-Type": "application/json"
            },
            success: response => resolve(response.token),
            error: error => reject(error)
        });
    });
}




class CameraTab extends React.Component
{
    OV = undefined;
    session = undefined;

    mySessionId = "12345567"

    constructor(props)
    {
        super(props)
        CameraTab.tabRef = this
    }

    componentDidMount()
    {
        this.OV = new OpenVidu()
    }

    readyToCall = async () => {
        this.OV = new OpenVidu()
        this.session = this.OV.initSession()
        getToken(this.mySessionId).then(token => {

            // First param is the token got from OpenVidu Server. Second param can be retrieved by every user on event
            // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
            console.log("The token is : \n" +token)
            this.session.connect(token, { clientData: "asdfasdf" })

        });

        this.session.on('streamCreated', event => {

            // Subscribe to the Stream to receive it. HTML video will be appended to element with 'video-container' id
            var subscriber = this.session.subscribe(event.stream, 'remoteVideos');
            subscriber.on('videoElementCreated', event => {
                console.log("Video Begin.")
            });
        });

        this.session.on('streamDestroyed', event => {

            // Delete the HTML element with the user's nickname. HTML videos are automatically removed from DOM
            console.log("stream destroyed")
        });
    }

    disconnectCall = async () => {
        this.session.disconnect();
        this.OV = undefined;
        this.session = undefined;
    }





    render()
    {
        return(
            <TabPane tabId="CameraTab">
                <SwitchAnimation readyToCall={this.readyToCall} disconnectCall={this.disconnectCall}/>
                <Fade className={"CameraTabContainer"}in={this.props.active == "CameraTab"} id = "remoteVideos" ref = "remotes">
                    <div
                        className = "remotes"
                        id = "remoteVideos"
                        ref = "remotes" >
                    </div>
                </Fade>
            </TabPane>
        );
    }
}


export default CameraTab