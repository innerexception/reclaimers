import * as React from 'react'
import Dialog from '../Dialog'
import { CssIcon } from '../util/SharedComponents'

export default (speakerIndex:number, text:string)=>
    <div>
        <div style={{display:'flex'}}>
            {CssIcon(speakerIndex, 2)}
            <div style={{border: '2px solid', padding:'5px', borderRadius:'5px', margin:'1em', marginLeft:'10px', width:'100%'}}>
                <Dialog messages={[text]}/>
            </div>
        </div>
    </div>