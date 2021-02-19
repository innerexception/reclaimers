import * as React from 'react'
import * as Phaser from 'phaser'
import WorldScene from './canvas/WorldScene'

interface State {
    phaserInstance?: Phaser.Game
}

export default class Viewscreen extends React.Component<State> {

    state = {
        phaserInstance: null,
        containerRef: React.createRef<HTMLDivElement>()
    }

    componentWillUnmount(){
        (this.state.phaserInstance as Phaser.Game).scene.scenes[0].unsubscribeRedux()
        this.state.phaserInstance.destroy(true)
    }

    componentDidMount() {
        this.state.phaserInstance = new Phaser.Game({
            type: Phaser.WEBGL,
            width: this.state.containerRef.current.clientWidth,
            height: this.state.containerRef.current.clientHeight,
            parent: 'canvasEl',
            render: {
                pixelArt: true
            },
            scene: [
                new WorldScene({key: 'map'})
            ]
        })
        window.addEventListener("resize", ()=>{
            let game = (this.state.phaserInstance as Phaser.Game)
            game.canvas.width = this.state.containerRef.current.clientWidth
            game.canvas.height = this.state.containerRef.current.clientHeight
        });
    }

    render() {
        return <div ref={this.state.containerRef} id='canvasEl' style={{width:'100vw', height:'100vh', border:'1px solid black'}}/>
    }
}