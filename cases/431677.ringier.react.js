import React from 'react'

import { withDefinedPropTypes, videoProps } from 'nb-components-common'
import config from '../../../config'
import R from 'ramda'

import './style.scss'

/* Relevant Bright cove official documentation:
 * Responsive player: https://docs.brightcove.com/en/player/brightcove-player/samples/responsive-sizing.html
 * Multiple players on single page: https://docs.brightcove.com/en/player/brightcove-player/guides/multiple-players.html
 * */

const loadBCOVScript = R.once(() => {
  const { accountID, playerID } = config.video
  const scriptURL = `//players.brightcove.net/${accountID}/${playerID}_default/index.min.js`
  const s = document.createElement('script')
  s.src = scriptURL
  s.async = true
  document.head.appendChild(s)
})

class Video extends React.Component {

  _getActivePlayer () {
    if (window.videojs) {
      const activePlayers = Object.entries(window.videojs.getPlayers()).map(playerObj => playerObj[1]).filter(player => !!player)
      if (activePlayers) return activePlayers[0]
    }
  }

  _checkIfPlayerReady () {
    return new Promise((resolve, reject) => {
      let timer = 0
      const interval = setInterval(() => {
        timer += 200
        if (window.videojs !== undefined) {
          clearInterval(interval)
          return resolve()
        }
        if (timer >= 5000) {
          reject({ msg: 'Error: Timeout exceeded while loading Pre-roll ad for the video' })
          clearInterval(interval)
        }
      }, 200)
      this.setState({intervalId: interval}) // Store interval in the state so it can be accessed in componentWillUnmount later
    })
  }

  _loadPreRollAd (videoAdUrl) {
    if (window.videojs) {
      let videoPlayer = this._getActivePlayer()

      if (videoPlayer.ima3.adMacroReplacement) {
        videoPlayer.ima3.adMacroReplacement = url => {
          return videoAdUrl
        }
      }
    }
  }

  componentWillUnmount () {
    if (window.videojs) {
      Object.entries(window.videojs.getPlayers()).forEach(
        playerObj => {
          const player = playerObj[1]
          if (player) {
            player.dispose()
          }
        }
      )
    }
  }

  componentDidMount () {
    loadBCOVScript()
    const videoId = this.props.videoId
    const videoIdRef = 'player' + videoId

    window.videojs ? window.videojs(videoIdRef) : null
    const videoAdUrl = this.props.videoAdUrl

    this._checkIfPlayerReady().then(
      resolve => this._loadPreRollAd(videoAdUrl),
      error => console.warn(error.msg)
    )
  }

  render () {
    const { videoId, autoPlay } = this.props
    const { accountID, playerID, videoBaseURL } = config.video

    return (
      <div className='bc-wrapper'>
        <video data-video-id={videoId}
               data-account={accountID}
               data-player={playerID}
               data-embed='default'
               data-application-id
               autoPlay={autoPlay}
               className='video-js'
               controls
               id={`player${videoId}`}
        >
          <source src={`${videoBaseURL}?videoId=${videoId}`} type='application/x-mpegURL' />
        </video>
      </div>
    )
  }
}

Video.defaultProps = {
  autoPlay: false
}

export default withDefinedPropTypes(Video, videoProps)
