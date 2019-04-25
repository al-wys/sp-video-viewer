import React from 'react';

export default class VideoPlayer extends React.Component {
    render() {
        const video = this.props.video;

        return video ? (
            <video controls autoPlay height={video.height} width={video.width}>
                <source preload="auto" type={video.type} src={video.url}></source>
            </video>
        ) : <></>;
    }

    componentDidUpdate() {
        this._setStartTime();
    }

    componentDidMount() {
        this._setStartTime()
    }

    _setStartTime() {
        let startTime = this.props.video;
        if (startTime && (startTime = startTime.startTime)) {
            const videoEle = document.querySelector('video');
            if (videoEle) {
                // videoEle.removeEventListener('loadedmetadata');
                videoEle.addEventListener('loadedmetadata', function () {
                    this.currentTime = startTime;
                }, false);
            }
        }
    }
}