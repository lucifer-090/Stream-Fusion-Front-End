import '../styles/videoItem.css';
const VideoItem = ({ video }) => {
    return (
      <div className="video-list">
      <h1>Video List</h1>
      <ul>
        {video.map((video) => (
          <li key={video._id}>
            <h2>{video.title}</h2>
            <p>{video.description}</p>
            <video controls width="400">
              <source src={`http://localhost:8080/${video.path}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </li>
        ))}
      </ul>
    </div>
    );
  };
  
  export default VideoItem;
  