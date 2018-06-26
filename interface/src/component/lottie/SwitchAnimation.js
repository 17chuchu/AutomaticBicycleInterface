
import React from 'react'
import Lottie from 'react-lottie';
import * as animationData from './jsonfile/switch.json'

export default class SwitchAnimation extends React.Component {

    animation = React.createRef()

    constructor(props) {
        super(props);
        this.state = {isStopped: false, isPaused: false, segment: [0, 50], isOnOff: false,speed: 100};

    }

    componentDidMount() {
        this.animation.current.stop()
        this.setState({})
    }

    sample = async () => {
       if(this.state.isOnOff) {
           this.setState({isOnOff: false, segment: [0, 50], speed: 1})
           this.animation.current.play()
           this.props.disconnectCall()
       }
       else {
           this.setState({isOnOff: true, segment: [50, 100], speed: 1})
           this.animation.current.play()
           this.props.readyToCall()
       }
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
            loop: false,
            autoplay: true,
            animationData: animationData,

            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice',
            }
        };

        return <div className="switchanimation" onClick={this.sample}>
            <Lottie ref={this.animation}
                    options={defaultOptions}
                    height={30}
                    width={400}
                    segments={this.state.segment}
                    isStopped={this.state.isStopped}
                    isPaused={this.state.isPaused}
                    isClickToPauseDisabled={true}
                    speed={this.state.speed}
            />
        </div>
    }
}