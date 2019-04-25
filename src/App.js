import React from 'react';
import './App.css';
import Auth from './components/Auth';
import { initGraphClientWithAutuProvider, getGraphClient } from './GraphClient';
import VideoList from './components/VideoList';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      videos: [],
      selectedVideo: null
    };
  }

  render() {
    let video = this.state.selectedVideo;

    return (
      <div className="App">
        <Auth
          scopes={["Files.Read", "Files.ReadWrite", "Files.Read.All", "Files.ReadWrite.All", "Sites.Read.All", "Sites.ReadWrite.All"]}
          authority={process.env.REACT_APP_AUTHORITY}
          appId={process.env.REACT_APP_APP_CLIENT_ID}
          onAuthProviderChanged={initGraphClientWithAutuProvider}
          onSignedIn={this.loadVideos}
        />

        <VideoList
          videos={this.state.videos}
          onSelectedItemIdChanged={this.playVideo}
        />

        {video ? (
          <video controls autoPlay height={video.height} width={video.width}>
            <source preload="auto" type={video.type} src={video.url}></source>
          </video>
        ) : <div></div>}
      </div>
    );
  }

  componentDidUpdate() {
    let startTime = this.state.selectedVideo;
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

  loadVideos = async () => {
    const client = getGraphClient();

    try {
      const videos = await client.api("/me/drive/root/search(q='{.mp4}')").get();
      this.setState({ "videos": videos.value });
    } catch (error) {

    }
  }

  playVideo = async (videoItemId) => {
    this.setState({ selectedVideo: null });

    const client = getGraphClient();

    try {
      const res = await client
        .api(`/me/drive/items/${videoItemId}?select=@microsoft.graph.downloadUrl`) // You must to use 'select' instead of '$select' to get downloadUrl
        .select("name", "id", "video", "file")
        .get();

      this.setState({
        selectedVideo: {
          height: res.video.height,
          width: res.video.width,
          type: res.file.mimeType,
          url: res['@microsoft.graph.downloadUrl'],
          startTime: (43 * 60 + 36) * Math.random()
        }
      });
    } catch (error) {

    }
  }
}

export default App;
