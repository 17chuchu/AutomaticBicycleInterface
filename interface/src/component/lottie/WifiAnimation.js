
import React from 'react'
import Lottie from 'react-lottie';
import * as animationData from './jsonfile/location.json'

export default class MountainAnimation extends React.Component {

    animation = React.createRef()

    constructor(props) {
        super(props);
        this.state = {isPause: false,isStopped: false, isPaused: false, segment: [30, 0], isOnOff: false,shouldrender: true,speed: 200};
    }

    componentDidMount() {

    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.shouldrender
    }

    focus = async () =>
    {
        if(!this.props.isLock) {
            this.state.shouldrender = true
            if (this.state.isOnOff) {
                this.setState({isOnOff: false, segment: [45, 90], speed: 2, isPaused: false, isStopped: false})
                this.props.onBlur()
            }
            else {
                this.setState({isOnOff: true, segment: [0, 45], speed: 2, isPaused: false, isStopped: false})
                this.props.onFocus()
            }
        }
    }


    complete = async () =>
    {
        console.log("Finish")
        this.state.shouldrender = false
    }



    render() {
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

        return <div className="mountainanimation" onFocus={this.focus} onBlur={this.focus} onKeyUp={this.props.onKeyUp} onKeyDown={this.props.onKeyDown}>
            <Lottie ref={this.animation}
                    options={defaultOptions}
                    eventListeners={[
                        {
                            eventName: 'complete',
                            callback: () => this.complete(),
                        },
                    ]}
                    height={65}
                    width={65}
                    progress={this.state.progress}
                    isStopped={this.state.isStopped}
                    isPaused={this.state.isPaused}
                    segments={this.state.segment}
                    isClickToPauseDisabled={true}
                    speed={this.state.speed}
            />
        </div>
    }
}