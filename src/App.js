import React from 'react';
import './App.css';
import Auth from './components/Auth';
import { initGraphClientWithAutuProvider, getGraphClient } from './GraphClient';
import VideoList from './components/VideoList';
import VideoPlayer from './components/VideoPlayer';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      videos: [],
      selectedVideo: null
    };
  }

  render() {
    return (
      <div className="App">
        <Auth
          scopes={["Files.Read", "Files.ReadWrite", "Files.Read.All", "Files.ReadWrite.All", "Sites.Read.All", "Sites.ReadWrite.All"]}
          authority={process.env.REACT_APP_AUTHORITY}
          appId={process.env.REACT_APP_APP_CLIENT_ID}
          onAuthProviderChanged={initGraphClientWithAutuProvider}
          onSignedIn={this._loadVideos}
        />

        <VideoList
          videos={this.state.videos}
          onSelectedItemIdChanged={this._playVideo}
        />

        <VideoPlayer video={this.state.selectedVideo} />
      </div>
    );
  }

  _loadVideos = async () => {
    const client = getGraphClient();

    try {
      const videos = await client.api("/me/drive/root/search(q='{.mp4}')").get();
      this.setState({ "videos": videos.value });
    } catch (error) {

    }
  }

  _playVideo = async (videoItemId) => {
    this.setState({ selectedVideo: null });

    const client = getGraphClient();

    try {
      const res = await client
        .api(`/me/drive/items/${videoItemId}?select=@microsoft.graph.downloadUrl,name,id,video,file`) // You must to use 'select' instead of '$select' to get downloadUrl
        // .select("name", "id", "video", "file")
        .get();

      const video = res.video;
      this.setState({
        selectedVideo: {
          height: video.height,
          width: video.width,
          type: res.file.mimeType,
          url: res['@microsoft.graph.downloadUrl'],
          startTime: (video.duration || (43 * 60 + 36) * 1000) / 1000 * Math.random()
        }
      });
    } catch (error) {

    }
  }
}

export default App;
