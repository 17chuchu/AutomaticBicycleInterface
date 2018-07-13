import React from "react"

import SwitchAnimation from '../component/lottie/SwitchAnimation'

import * as mediasoupClient from 'mediasoup-client';
import mySignalingChannel from './mySignalingChannel';

import $ from 'jquery';
import uuidv1 from 'uuid/v1'

import { OpenVidu, Session, Stream } from 'openvidu-browser';


import {
     TabPane, Fade
} from 'reactstrap';
import SocketManager from "../non-component/SocketManager";




class CameraTab extends React.Component
{


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

    render()
    {
        return(
            <TabPane tabId="CameraTab">
                <SwitchAnimation readyToCall={this.beginCall} disconnectCall={this.disconnectCall}/>
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
