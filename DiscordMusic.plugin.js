/**
 * @name DiscordMusic
 * @version 0.0.1
 * @description Music bot client side script with Youtube Music Integration
 * @author Lakshy Gupta, Daniel Chen, James Su, Vincent Guo
 */

class Song{
    videoId = 'bhjM12GlpMM'
    name = 'AYA'
    artist = 'MAMAMOO'
    mute = false
    time = 0
    coverArtLink = 'https://lh3.googleusercontent.com/dnNcNKHkbyzicUxTyE2_EZ3lzoZD3k2iFYmoBAyTaO0aCzDzrGdpWfvawJccY-e66tzZgpfteg7pzWc=w1000-h1000-l90-rj'

    embedLink(){
        let link = 'https://www.youtube.com/embed/'+this.videoId+'?autoplay=1';
        let args = { //embed get request args
            'mute': this.mute?1:0,
            't': this.time,
        }
        for(let arg in args){
            link += '&'+arg+'='+args[arg]
        }
        return link
    }
}

class DiscordMusic {

    start() {
      console.log('started')
    }

    loadSong(song) {

    }

    stop(){
      console.log('ended')
    }
}

