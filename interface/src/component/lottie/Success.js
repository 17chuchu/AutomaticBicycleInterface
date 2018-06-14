import React from 'react'
import Lottie from 'react-lottie';

import * as animationData from '/Users/slimshady23/GitHubProject/AutomaticBicycleInterface/interface/src/local/lottie/cycle_animation.json'

class Success extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isStopped: false, isPaused: false};
    }

    render() {
        const buttonStyle = {
            display: 'block',
            margin: '10px auto'
        };

        const defaultOptions = {
            loop: true,
            autoplay: true,
            animationData: animationData,
            rendererSettings: {
            }
        };

        return <Lottie options={defaultOptions}
                    height={500}
                    width={500}
                    isStopped={this.state.isStopped}
                    isPaused={this.state.isPaused}/>

    }
}



export default Success;