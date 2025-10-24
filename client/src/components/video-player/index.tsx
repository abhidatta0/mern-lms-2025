import ReactPlayer from 'react-player'

type Props = {
   width: string,
   height: string,
   url: string
}
const VideoPlayer = ({width, height, url}:Props) => {

  return (
    <div 
      className={`relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-in-out `}
      style={{ width, height }}
    >
        <ReactPlayer width={'100%'} height={'100%'} src={url}
        className="absolute top-0 left-0"
        controls
        />
    </div>
  )
}
export default VideoPlayer;