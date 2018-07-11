import React from "react"
import { Player } from 'video-react';
import "/Users/slimshady23/GitHubProject/AutomaticBicycleInterface/interface/node_modules/video-react/dist/video-react.css";

import SwitchAnimation from '../component/lottie/SwitchAnimation'

import SimpleWebRTC from 'simplewebrtc'
import ReactDOM from 'react-dom'

import $ from 'jquery';
import uuidv1 from 'uuid/v1'

import { OpenVidu, Session, Stream } from 'openvidu-browser';


import {
     TabPane, Fade
} from 'reactstrap';
import SocketManager from "../non-component/SocketManager";



class CameraTab extends React.Component
{
    OV = undefined;
    session = undefined;


    constructor(props)
    {
        super(props)
        CameraTab.tabRef = this
        SocketManager.handleaskforvideo = this.beginCall
    }

    componentDidMount()
    {
        this.OV = new OpenVidu()
    }


    readyToCall = async () => {
        if (!(SocketManager.selectedBike === undefined)) {
            SocketManager.askforvideo(SocketManager.selectedBike)
        }
    }

    beginCall = async (info) => {
        var token = info.pack.token
        console.log("Token is",info.pack.token)

        this.OV = new OpenVidu()
        this.session = this.OV.initSession()

        this.session.on('streamCreated', event => {
            console.log("Stream Receive")
            // Subscribe to the Stream to receive it. HTML video will be appended to element with 'video-container' id
            var subscriber = this.session.subscribe(event.stream, 'remoteVidd');
            subscriber.on('videoElementCreated', event => {
                console.log("Video Begin.")
                console.log("Video Source",event)
            });
        });

        this.session.on('streamDestroyed', event => {
            // Delete the HTML element with the user's nickname. HTML videos are automatically removed from DOM
            console.log("stream destroyed")
        });

        this.session.connect(token, { clientData: uuidv1() })
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
