export const colors = {
    white: '#f3f3f3',
    grey1: 'silver',
    grey2: '#ababab',
    grey3:'#333333',
    black:'#252525',
    dGreen: '#305442',
    lGreen: '#90ee90',
    dBrown: '#967252',
    lBrown: '#c7936d',
    lBlue: '#94caff',
    dBlue: '#0000ca',
    purple: '#360097',
    pink: '#ff0097',
    red: '#dc0000',
    orange: '#ff6500',
    ddBrown: '#392414',
    bronze:'#cd7f32'
}

export default {
    contentAreaAlternate: {
        padding:'0.5em', background: colors.grey2, border:'5px outset', borderColor:colors.grey1, borderBottomLeftRadius:'20px', borderTopRightRadius:'20px', marginBottom:'0.5em', marginTop:'0.5em'
    },
    buttonOuter: {
        color: colors.black, 
        cursor:'pointer',
        textAlign:'center' as 'center',
        border: '3px solid',
        borderRadius: '5px',
        background:'white',
        padding:'2px'
    },
    buttonInner: {
        backgroundImage:'url('+require('./assets/ui_border.png')+')',
        backgroundPosition:'center',
        border:'2px inset white', paddingLeft:'10px', paddingRight:'10px' ,
        color: colors.lGreen, 
        textShadow: '0 2px black',
        cursor:'pointer',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    topBar: {
        background: 'white',
        display:'flex',
        justifyContent:'space-around',
        alignItems: 'center',
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
        borderBottom: '1px solid'
    },
    hr: {
        margin:0,
        marginBottom:'1px'
    },
    modal: {
        background:'black',
        backgroundPosition:'center',
        position:'absolute' as 'absolute',
        width: '350px',
        display:'flex',
        flexDirection: 'column' as 'column',
        justifyContent: 'space-between',
        zIndex:2,
        padding:'10px',
        border: '3px inset',
        boxShadow: '5px 6px 8px 0px black',
        borderColor: colors.lGreen,
        color: colors.lGreen,
        top:0,left:0,right:0,bottom:0,
        margin:'auto'
    },
    centered: {
        margin:'auto',
        top:0,left:0,bottom:0,right:0
    },
    bottomBarContent: {
        background:' rgb(90, 90, 90)',
        display: 'flex',
        flexDirection: 'column' as 'column',
        justifyContent: 'flex-start',
        height: '100%',
        width:'75%'
    },
    bottomBarContentInner: {overflow:'hidden', padding:'0.5em', margin:'0.5em', background:'rgba(33, 3, 3, 0.3)', height:'100%', display:'flex', alignItems:'center', justifyContent:'space-around'},
    notifications: {
        position:'absolute' as 'absolute',
        left:0, bottom:0,
        maxWidth: '80vw',
        height: '5em',
        display:'flex',
        zIndex:2
    },
    close: {
        position:'absolute' as 'absolute', right:20, top:10, cursor:'pointer', fontSize:'18px'
    },
    bounce: {
        width:'2em',
        height:'1em',
        animation: 'shake 5s',
        animationIterationCount: 'infinite'
    }
}