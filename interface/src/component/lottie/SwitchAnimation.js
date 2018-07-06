
import React from 'react'
import Lottie from 'react-lottie';
import * as animationData from './jsonfile/toggle_switch.json'

export default class SwitchAnimation extends React.Component {

    animation = React.createRef()

    constructor(props) {
        super(props);
        this.state = {isPause: false,isStopped: false, isPaused: false, segment: [50, 100], isOnOff: false,shouldrender: true,speed: 200};

    }

    componentDidMount() {

    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.shouldrender
    }

    sample = async () => {
        this.state.shouldrender = true
        if(this.state.isOnOff) {
            this.setState({isOnOff: false, segment: [50, 100], speed: 3, isPaused: false,isStopped: false})
            this.props.disconnectCall()
        }
        else {
            this.setState({isOnOff: true, segment: [0, 50], speed: 3, isPaused: false,isStopped: false})
            this.props.readyToCall()
        }

    }

    complete = async () =>
    {
        console.log("Finish")
        this.state.shouldrender = false
    }



    render() {
        const buttonStyle = {
            display: 'block',
            margin: '10px auto'
        };

        const defaultOptions = {
            loop: false,
            autoplay: false,
            animationData: animationData,
            segmentStart: this.complete,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice',
            },
            eventListeners: {
                complete: this.complete
            }
        };

        return <div className="switchanimation" onClick={this.sample}>
            <Lottie ref={this.animation}
                    options={defaultOptions}
                    eventListeners={[
                        {
                            eventName: 'complete',
                            callback: () => this.complete(),
                        },
                    ]}
                    height={38}
                    width={400}
                    isStopped={this.state.isStopped}
                    isPaused={this.state.isPaused}
                    segments={this.state.segment}
                    isClickToPauseDisabled={true}
                    speed={this.state.speed}
            />
        </div>
    }
}