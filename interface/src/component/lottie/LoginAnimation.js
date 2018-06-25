
import React from 'react'
import Lottie from 'react-lottie';
import * as animationData from './jsonfile/splashy_loader.json'

export default class LoginAnimation extends React.Component {

    animation = React.createRef()

    constructor(props) {
        super(props);
        this.state = {isStopped: false, isPaused: false, segment: [0,25]};

    }

    componentDidMount() {
        this.animation.current.stop()
        this.setState({})
    }

    loadingmode = async () => {
        this.setState({segment : [0,25]})
    }

    finishedmode = async () => {
        this.setState({segment : [0,80]})
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

            //rendererSettings: {
            //    preserveAspectRatio: 'XMidyMid slice',
            //}
        };

        return <div  className = {"loginloading"}>
            <Lottie ref={this.animation}
                    options={defaultOptions}
                    height={50}
                    width={200}
                    //segments={this.state.segment}
                    isStopped={this.state.isStopped}
                    isPaused={this.state.isPaused}
                    isClickToPauseDisabled={true}
            />
        </div>
    }
}