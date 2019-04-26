import React from 'react';

export default class VideoPlayer extends React.Component {
    render() {
        const video = this.props.video;

        return video ? (
            <video controls autoPlay height={video.height} width={video.width} onLoadedMetadata={(e) => {
                e.target.currentTime = video.startTime;
            }}>
                <source preload="auto" type={video.type} src={video.url}></source>
            </video>
        ) : <></>;
    }
}