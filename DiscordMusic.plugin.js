/**
 * @name DiscordMusic
 * @version 0.0.1
 * @description Music bot client side script with Youtube Music Integration
 * @author Lakshy Gupta, Daniel Chen, James Su, Vincent Guo
 */

//hello good sirs
//simply put this inside your better discord plugins folder and you should be good to see the cringe

//string to become css code
//css is very spaghet, do not touch
//you will not understand it
//do not think you are smart and that you will understand it
//I do not understand, so you will not understand
//this does not imply that I think I am smart
//I am clearly not smart I wrote this train wreck
let css =
`
<style id="discord_music_styles">
    .root{
        position: fixed;
        z-index: 1200;
        background-color: rgb(41,43,47);
        border-radius: 7px;
    }    
    .minimized-player{
        margin: 15px;
        width: 350px;
        display: grid;
        grid-template-rows: 45px 24px 24px 50px;
    }
    .control-bar{
        display: grid;
        grid-gap: 5px;
        grid-template-columns: 45px 175px 120px;
    }   
    .cover-art{
        height: 45px;
        width: 45px;
        border-radius: 5px;
    }
    .song-info{
        display: grid;
        grid-template-rows: auto auto;
        height: 45px;   
    }
    .song-title{
        font-weight: normal;
        color: #DCDDDE;
        margin: 0;
        padding-top: 1px;
        font-size: 25px;
    }
    .song-artist{
        font-weight: lighter;
        color: #DCDDDE;
        font-size: 15px;
        margin: 0;
        height: 20px;
        line-height: 20px;
    }
    .scroll-div{
        position: relative;
        display: grid;
        overflow: hidden;
        align-items: center;
    }
    .scroll-div span {
        position: absolute;
        white-space: nowrap;
        transform: translateX(0);
        transition: 2s;
    }
    .scroll-div:hover span {
        transform: translateX(calc(min(175px - 100%, 0px)));
    }
    .control-icons{
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }
    .player-icon-button{
        height: 35px;
        width: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        cursor: pointer;
    }
    .player-icon-button:hover{
        background-color: #36393f
    }
    .player-icon{
        font-size: 24px;
        filter: invert(0.7);
    }
    .progress-bar-row{
        display: grid;
        grid-gap: 5px;
        grid-template-columns: auto 75px;
    }
    .small-number{
        color: #dcddde;
        margin: 0;
        font-size: 12px;
        line-height: 24px;
        text-align: right;
    }
    .progress-bar{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .bar{
        background-color: #36393f;
        border-radius: 5px;
        height: 5px;
        width: 100%;
    }
    .progress{
        background-color: #1ed760;
        border-radius: 5px;
        height: 5px;
        width: 50%;
    }
    .volume-bar{
        color: #DCDDDE;
        display: grid;
        grid-gap: 5px;
        grid-template-columns: 24px auto 30px 40px;
    }
    .volume-icon{
        filter: invert(0.2)
    }
    .queue-bar{
    }
</style>
`

//html is slightly less spaghet
//IDs have not been made yet for things that haven't been touched by JS
//string to become HTML code inside of the root div
let rootContent =
`
<div class="minimized-player">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet">
    <div class="control-bar">
        <img id="cover_art" class="cover-art" src="https://upload.wikimedia.org/wikipedia/en/5/5e/KDA_THE_BADDEST.jpeg">
        <div class="song-info">
            <div class="scroll-div">
                <span class="song-title">THE BADDEST</span>
            </div>
            <div class="scroll-div">
                <span class="song-artist">K/DA, (G)I-DLE, Bea Miller, Wolftyla</span>
            </div>
        </div>
        <div class="control-icons">
            <div class="player-icon-button">
                <i class="player-icon ri-skip-back-fill"></i>
            </div>
            <div class="player-icon-button">
                <i class="player-icon ri-pause-fill"></i>
            </div>
            <div class="player-icon-button">
                <i class="player-icon ri-skip-forward-fill"></i>
            </div>
        </div>
    </div>
    <div class="progress-bar-row">
        <div class="progress-bar">
            <div id="time_bar" class="bar">
                <div id="time_progress" class="progress"></div>
            </div>
        </div>
        <p class="small-number">32:37 / 56:43</p>
    </div>
    <div class="volume-bar"">
        <i class="player-icon volume-icon ri-volume-up-fill"></i>
        <div class="progress-bar">
            <div id="volume_bar" class="bar">
                <div id = "volume_progress" class="progress"></div>
            </div>
        </div>
        <p id="volume_percent" class="small-number">117%</p>
    </div>
    <div class="queue-bar">
        
    </div>
</div>
`

//thing that we can maybe use later someday
class Song{
    videoId = 'bhjM12GlpMM'
    name = 'AYA'
    artist = 'MAMAMOO'
    mute = true
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

//all sliders go here after instantiated
Sliders = []
//greens !!
green =  '#1ed760'
lightGreen = '#69ff68'
//class to represent a slider added dynamically with yavascribt
class Slider{
    //sliders have bars, progress bars, and an onslide function
    constructor(barId, progressId, onSlide, sliderRadius, slideDelay) {
        //state vars
        this.barId = barId
        this.progressId = progressId
        this.onSlide = onSlide
        this.sliding = false
        this.sliderRadius = sliderRadius
        this.lastSlide = -1000
        this.mouseOver = false
        this.slideDelay = slideDelay
        //html stuffs
        let bar = document.getElementById(barId)
        let progress = document.getElementById(progressId)
        let rect = progress.getBoundingClientRect()
        let barRect = bar.getBoundingClientRect()
        //create the slider
        let slider = document.createElement('div')
        this.sliderId = 'Slider_'+Sliders.length //id based on creation order
        slider.id = this.sliderId
        slider.style.width = (sliderRadius*2)+'px'
        slider.style.height = (sliderRadius*2)+'px'
        slider.style.borderRadius = sliderRadius
        this.sliderX = rect.right-sliderRadius //end of progress bar
        slider.style.left = this.sliderX+'px'
        this.sliderY = (rect.top+rect.bottom)/2 - sliderRadius //halfway through progress bar
        slider.style.top = this.sliderY+'px'
        slider.style.backgroundColor = 'white'
        slider.style.borderRadius = sliderRadius+'px'
        slider.style.position = 'absolute' //absolute coords to specify position
        slider.style.zIndex = '1300'

        //change color of the progress bar only when the slider is moused over
        slider.addEventListener('mouseenter', e => {
            let slider = e.currentTarget
            //get index in object list from id
            let i = parseInt(slider.id.substring(slider.id.length-1))
            let progress = document.getElementById(Sliders[i].progressId)
            progress.style.backgroundColor = lightGreen //light green
            Sliders[i].mouseOver = true
        })
        slider.addEventListener('mouseleave', e => {
            let slider = e.currentTarget
            //get index in object list from id
            let i = parseInt(slider.id.substring(slider.id.length-1))
            let progress = document.getElementById(Sliders[i].progressId)
            if(!Sliders[i].sliding){
                progress.style.backgroundColor = green //reg green
            }
            Sliders[i].mouseOver = false
        })

        //on clicked basically
        slider.onmousedown = (e) => {
            this.sliding = true
            this.pX = e.clientX //set prev mouse coords
        }

        //farthest a slider can go
        this.maxSliderX = barRect.right - sliderRadius
        this.minSliderX = barRect.left - sliderRadius

        //abs position only works if its in the body not in a div idk why
        document.body.appendChild(slider)
    }

    //function to update slider after root drags
    reGenerateSlider(){ //mostly the same as the constructor
        let bar = document.getElementById(this.barId)
        let progress = document.getElementById(this.progressId)
        let rect = progress.getBoundingClientRect()
        let barRect = bar.getBoundingClientRect()

        let slider = document.getElementById(this.sliderId)
        this.sliderX = rect.right-this.sliderRadius
        slider.style.left = this.sliderX+'px'
        this.sliderY = (rect.top+rect.bottom)/2 - this.sliderRadius
        slider.style.top = this.sliderY+'px'

        this.maxSliderX = barRect.right - this.sliderRadius
        this.minSliderX = barRect.left - this.sliderRadius
    }
}

//helper function to make the slider slidable
function addSliderEvents(){
    //function to be called upon slide
    //slideEvt is whether or not the defined onSlide function runs
    function slideSlider(i, nX, slideEvt=false){
        //new slider x coord
        Sliders[i].sliderX = Sliders[i].sliderX+(nX-Sliders[i].pX)
        //keep within bounds
        Sliders[i].sliderX = Math.min(Sliders[i].sliderX, Sliders[i].maxSliderX)
        Sliders[i].sliderX = Math.max(Sliders[i].sliderX, Sliders[i].minSliderX)
        //get and move slider
        let slider = document.getElementById(Sliders[i].sliderId)
        slider.style.left = Sliders[i].sliderX+'px'
        //get progress bar stuffs
        let bar = document.getElementById(Sliders[i].barId)
        let progress = document.getElementById(Sliders[i].progressId)
        let rect = bar.getBoundingClientRect()
        //update the progress bar after calculating new progress
        let slidePx = Sliders[i].sliderX+Sliders[i].sliderRadius-rect.left //get amount of pixels slid to
        let barPx = rect.right-rect.left //get total pixels in bar
        let percent = (slidePx/barPx)*100 //maffs
        progress.style.width = percent+'%' //update progress bar
        if(slideEvt){ //call the onslide if needed
            Sliders[i].onSlide(percent)
        }
        //set the previous slide to current slide
        Sliders[i].pX = nX
    }

    //when redefining the mouse move function, make sure to not lose the previous function
    let prevMouseMove = document.onmousemove
    document.onmousemove = e => {
        prevMouseMove(e)
        let nX = e.clientX //new x client moved to
        for(let i=0;i<Sliders.length;i++){ //iterate over all sliders
            if(Sliders[i].sliding){ //only check active sliders sus
                //only fire onslide if the last move occured within the slider's delay
                //to make sure slower APIs/websocket operations dont get overloaded and die
                let toSlide = false
                let curTime = performance.now()
                if(curTime-Sliders[i].lastSlide > Sliders[i].slideDelay){
                    Sliders[i].lastSlide = curTime
                    toSlide = true
                }
                //still call the function regardless to update GUI
                slideSlider(i, nX, toSlide)
            }
        }
    }
    //add to the mouse up function
    let prevMouseUp = document.onmouseup
    document.onmouseup = e => {
        //same as mouse move function, except the sliders are set to no longer be sliding
        prevMouseUp(e)
        let nX = e.clientX
        for(let i=0;i<Sliders.length;i++){
            if(Sliders[i].sliding){
                slideSlider(i, nX, true)
                Sliders[i].sliding = false //dont slide anymore
                if(!Sliders[i].mouseOver){ //change the progress color if not hovering slider
                    document.getElementById(Sliders[i].progressId).style.backgroundColor = green
                }
                if(i === 0 && !Sliders[i].onTimeBar){ //hide time slider if not hovering bar
                    document.getElementById('Slider_0').style.visibility = 'hidden'
                }
            }
        }
    }
}

class DiscordMusic {

    //if false the plugin will not start (use discord without plugin for debug purposes)
    startPlugin = true

    start() {
        if(!this.startPlugin){
            return
        }

        console.log('started')

        //add the CSS to the doc
        let cssBox = document.createElement('div')
        css = css.trim()
        cssBox.innerHTML = css
        cssBox.id = 'discord_music_css_box'
        document.body.appendChild(cssBox)
        console.log('added CSS')

        //create the root
        let root = document.createElement('div')
        rootContent = rootContent.trim()
        root.innerHTML = rootContent
        root.id = 'discord_music_root'
        //root properties
        root.classList.add('root')
        root.style.left = '20px'
        root.style.top = '20px'

        //root dragging functions
        //prev x and y
        let pX = null
        let pY = null
        let draggingRoot = false
        //mouseclick on root
        root.onmousedown = e => {
            //do not collide with slider drag
            if(e.target instanceof HTMLElement && e.target.id.startsWith('Slider')){
                return
            }
            //start draggin
            draggingRoot = true
            pX = e.clientX
            pY = e.clientY
        }
        //function to actually drag
        function dragRoot(x, y){
            //offsets
            let xDiff = x-pX
            let yDiff = y-pY
            let pRootX = root.style.left //the previous root coord
            pRootX = parseInt(pRootX.substring(0, pRootX.length-2)) //parse the 'px'
            let pRootY = root.style.top//the previous root coord
            pRootY = parseInt(pRootY.substring(0, pRootY.length-2))//parse the 'px'
            //set to new coords
            let rootX = (pRootX+xDiff)+'px'
            let rootY = (pRootY+yDiff)+'px'
            root.style.left = rootX
            root.style.top = rootY
            //set prev mouse coords
            pX = x
            pY = y
            //re gen sliders
            for(let i=0;i<Sliders.length;i++){
                Sliders[i].reGenerateSlider()
            }
        }
        //mouse move and moue up events simply call the drag function if dragging
        document.onmouseup = e => {
            if(draggingRoot){
                dragRoot(e.clientX, e.clientY)
            }
            draggingRoot = false //mouse up stops dragging
        }
        document.onmousemove = e => {
            if(draggingRoot){
                dragRoot(e.clientX, e.clientY)
            }
        }

        //add the root to doc
        document.body.appendChild(root)
        console.log('added root')

        //add sliders
        //time slider for song completion
        let timeSlide = percent => {
            console.log('slide player to '+percent+'%')
        }
        //200 ms delay because I think websockets are gonna be slow prolly
        Sliders.push(new Slider('time_bar', 'time_progress', timeSlide, 5,200))

        let timeSlider = document.getElementById('Slider_0')
        timeSlider.style.visibility = 'hidden'
        Sliders[0].onTimeBar = false
        //mouse enter and mouse leave were acting kind of buggy, so here I use bounding rect and mouse move instead
        Sliders[0].mouseEnterFunction = e => { //display upon entry
            let timeSlider = document.getElementById('Slider_0')
            timeSlider.style.visibility = 'visible'
            Sliders[0].onTimeBar = true
        }
        Sliders[0].mouseLeaveFunction = e => { //hide upon exit
            let timeSlider = document.getElementById('Slider_0')
            if(!Sliders[0].sliding) { //only hide if not being dragged
                timeSlider.style.visibility = 'hidden'
            }
            Sliders[0].onTimeBar = false
        }
        //do not override mouse move - only add to it
        let prevMouseMove = document.onmousemove
        document.onmousemove = e => {
            prevMouseMove(e)
            let timeBar = document.getElementById('time_bar')
            let rect = timeBar.getBoundingClientRect()
            let x = e.clientX
            let y = e.clientY
            let d = 3
            let hoveringTimeBar = x > rect.left-d && x < rect.right+d && y > rect.top-d && y < rect.bottom+d
            if(hoveringTimeBar && !Sliders[0].onTimeBar){
                Sliders[0].mouseEnterFunction(e)
            }
            if(!hoveringTimeBar && Sliders[0].onTimeBar){
                Sliders[0].mouseLeaveFunction(e)
            }
        }

        //volume slider
        let volumeSlide = percent => {
            console.log('slide volume to '+percent+'%')
            let percentText = document.getElementById('volume_percent')
            percentText.innerHTML = Math.round(percent)+'%'
        }
        Sliders.push(new Slider('volume_bar', 'volume_progress', volumeSlide, 5,25))
        //make sliders work
        addSliderEvents()
    }

    stop(){
        if(!this.startPlugin){
            return
        }
        //remove stuff from the html
        //IMPORTANT: discord DOES NOT REMOVE HTML AND JAVASCRIPT UPON RELOADING DISCORD / CLOSING WINDOW
        //IF THIS FUNCTION DIES, YOU HAVE TO CLOSE DISCORD FROM TASK MANAGER OR THE TASKBAR TRAY
        //lest risk a ton of monke moments
        console.log('stopping')
        //remove CSS and root html
        let cssBox = document.getElementById('discord_music_css_box')
        let rootBox = document.getElementById('discord_music_root')
        document.body.removeChild(cssBox)
        document.body.removeChild(rootBox)
        //remove sliders
        for(let i=0;i<Sliders.length;i++){
            let slider = document.getElementById(Sliders[i].sliderId)
            document.body.removeChild(slider)
        }
        console.log('removed elements')
    }
}
