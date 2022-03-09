import React from 'react';
import type { ControllerStatus } from 'gca-js';

export function Controller(props: {data: ControllerStatus[], currentController: number}) {
    const {data, currentController} = props;

    if(data.length <= 0) return null;

    const controller = data[currentController];
    const isConnected = controller.connected;

    function getDualAxisTransform(horizontal: number, vertical: number) {
        return `translate(${horizontal*5}%, ${-vertical*5}%)`;
    }

    function getSingleAxisBar(axis: number) {
        return `${(axis+1)*50}%`
    }

    return (
        <div className="controllerDisplay">
            { !isConnected && <div className="not-connected-alert">Not connected</div> }
            <div style={{opacity: isConnected ? 1 : 0.5}} className="triggers-container">
                <div className="trigger-box">
                    <div className="trigger-axis">
                        <div style={{width: controller.buttons.buttonL ? "100%" : getSingleAxisBar(controller.axes.triggerL)}} className="trigger-bar"></div>
                    </div>
                    <div style={{background: controller.buttons.buttonL ? undefined : "none"}} className="trigger-button">L</div>
                </div>
                <div className="trigger-box">
                    <div className="trigger-axis">
                        <div style={{width: controller.buttons.buttonR ? "100%" : getSingleAxisBar(controller.axes.triggerR)}} className="trigger-bar"></div>
                    </div>
                    <div style={{background: controller.buttons.buttonR ? undefined : "none"}} className="trigger-button">R</div>
                </div>
            </div>
            <svg style={{opacity: isConnected? 1 : 0.5}} id="controller" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 686 496">
                <path id="MainBody" style={{fill: "black"}} d="M609.9049,159.657c-5.9169-40.7249-33.7634-64.0468-36.8957-67.1791,3.8293-13.2262-36.8957-30.631-41.0727-32.0234-37.5927-12.1832-46.6419-4.8723-46.6419-4.8723S417.42,32.9574,343.2794,32.26,194.6486,59.41,190.124,59.0723C149.399,47.5861,131.6465,79.61,129.2111,83.4371,67.949,117.5482,75.26,173.5887,75.26,173.5887S67.9507,234.5015,63.0767,321.87s7.6569,137.1429,44.902,138.8829,48.0342-84.9317,49.7742-115.2134a148.1622,148.1622,0,0,1,12.8785-52.5572c4.5247-5.2216,13.5756,25.41,13.5756,25.41,13.9232,32.371,42.1173,53.9511,77.273,51.1665s61.2622-37.245,61.2622-70.3114-19.84-56.3882-28.1941-62.6545S281.3218,218.84,281.3218,218.84c9.0493-5.2216,40.7251-.6953,40.7251-.6953a59.7535,59.7535,0,0,0,37.94,1.3923c20.1878-6.2646,44.2049-1.0447,43.162,0-3.134,6.9515-51.5159,40.3672-42.119,84.9215s41.42,72.4008,78.6654,67.1792,59.52-36.5481,62.3051-55.3436,13.9233-20.1878,13.9233-20.1878c22.3986,31.6774,8.6948,169.0515,71.1383,169.0515,26.4541,0,35.6451-53.8229,36.894-62.4216C628.7476,369.7019,615.8218,200.3871,609.9049,159.657Z"/>
                <polyline id="CStickBase" points="432.45 243.752 401.524 256.657 388.279 287.528 401.185 318.454 432.629 331.2 463.556 318.294 475.734 287.351 462.828 256.424" style={{fill: "#ffc82c"}}/>
                <path id="LButton" d="M190.124,59.0723C149.399,47.5861,131.6465,79.61,129.2111,83.4371" style={{fill: "#c6c6c6"}}/>
                <path id="ZButton" style={{fill: controller.buttons.buttonZ ? "#7051f2" : "#999999"}} d="M573.0092,92.4779c3.8293-13.2262-36.8957-30.631-41.0727-32.0234-37.5927-12.1832-46.6419-4.8723-46.6419-4.8723" />
                <path id="MainStickBase" d="M171.6761,196.7434a35.7785,35.7785,0,1,1,35.15-36.3958q.0054.3087.0054.6174a35.4679,35.4679,0,0,1-35.1546,35.7784Z" style={{fill: "#adadad"}}/>
                <path id="Dpad" d="M283.6205,279.75V295.065c0,2.3071-.3376,4.1618-2.648,4.1618h-22.667v19.5077c0,2.307-.0877,4.12-2.3948,4.12H241.9875c-2.307,0-5.6216-1.8126-5.6216-4.12V299.2268H218.3181c-2.3071,0-5.5795-1.8565-5.5795-4.1618V279.7494c0-2.307,3.2724-4.15,5.5795-4.15h18.0478V256.08c0-2.3071,3.3146-4.1078,5.6216-4.1078h13.9232c2.3071,0,2.3948,1.8007,2.3948,4.1078V275.6h22.667C283.2829,275.6,283.6205,277.4424,283.6205,279.75Z" style={{fill: "#c4c4c4"}}/>
                <path id="StartButton" style={{fill: controller.buttons.buttonStart ? "#c4c4c4" : "#999999"}} d="M340.8407,183.1578a12.7048,12.7048,0,1,1,12.7047-12.7048h0A12.7049,12.7049,0,0,1,340.8407,183.1578Z" />
                <path id="YButton" style={{fill: controller.buttons.buttonY ? "#c4c4c4" : "#999999"}} d="M480.942,93.0062c20.61-10.526,44.3855-1.9138,42.465,11.8339-.66,4.7254-.9653,10.3757-8.18,13.5755-8.9311,3.9593-15.0658-.724-30.8049,7.657-16.0024,8.5294-32.5415-18.2268-3.48-33.0664Z"/>
                <path id="BButton" style={{fill: controller.buttons.buttonB ? "#d11111" : "#999999"}} d="M447.8875,175.1515A21.5919,21.5919,0,1,1,426.47,196.9166c0-.0578-.0007-.1154-.0007-.1732a21.5059,21.5059,0,0,1,21.4182-21.5919Z" />
                <path id="AButton" style={{fill: controller.buttons.buttonA ? "#1cd3a3" : "#999999"}} d="M510.2736,197.6024a32.5466,32.5466,0,1,1,32.2772-32.8138q.0011.1345.0011.269A32.4166,32.4166,0,0,1,510.2736,197.6024Z" />
                <path id="XButton" style={{fill: controller.buttons.buttonX ? "#c4c4c4" : "#999999"}} d="M574.0166,181.7182c-4.7254-.6582-10.3774-.9654-13.5755-8.18-3.9593-8.9311.7239-15.0675-7.6569-30.805-8.5278-16.0108,18.2267-32.5449,33.068-3.48,10.5176,20.6114,1.9071,44.3805-11.8423,42.4667Z" />
                <g id="MainStick" style={{transform: isConnected? getDualAxisTransform(controller.axes.mainStickHorizontal, controller.axes.mainStickVertical): undefined }}>
                    <circle cx="171" cy="161" r="23.5" style={{fill: "#cdcdcd"}}/>
                    <path d="M171,139a22,22,0,1,1-22,22,22,22,0,0,1,22-22m0-3a25,25,0,1,0,25,25,25.0282,25.0282,0,0,0-25-25Z" style={{fill: "#515151"}}/>
                </g>
                <g id="CStick" style={{transform: isConnected? getDualAxisTransform(controller.axes.cStickHorizontal, controller.axes.cStickVertical) : undefined }}>
                    <circle cx="432" cy="287" r="23.5" style={{fill: "#ffc82c"}}/>
                    <path d="M432,265a22,22,0,1,1-22,22,22,22,0,0,1,22-22m0-3a25,25,0,1,0,25,25,25.0283,25.0283,0,0,0-25-25Z" style={{fill: "#af7500"}}/>
                </g>
                <circle id="DpadCenter" cx="248" cy="287" r="6" style={{fill: "#666"}}/>
                <polygon id="DpadTop" style={{fill: controller.buttons.padUp ? "red" : "#666"}} points="248 258 241.072 272 254.928 272 248 258" />
                <polygon id="DpadLeft" style={{fill: controller.buttons.padLeft ? "red" : "#666"}} points="219 287 233 293.928 233 280.072 219 287" />
                <polygon id="DpadDown" style={{fill: controller.buttons.padDown ? "red" : "#666"}} points="248 316 254.928 302 241.072 302 248 316" />
                <polygon id="DpadRight" style={{fill: controller.buttons.padRight ? "red" : "#666"}} points="277 287 263 280.072 263 293.928 277 287" />
            </svg>
        </div>
    )
}

export function ControllerChooser(props: {onIncrement: () => void, onDecrement: () => void, currentController: number}) {
    const {onIncrement, onDecrement, currentController} = props;
    return (
        <div className="controller-chooser">
            <button disabled={currentController<=0} onClick={onDecrement}>&larr;</button>
            <span> Controller #{currentController + 1} </span>
            <button disabled={currentController>=3} onClick={onIncrement}>&rarr;</button>
        </div>
    )
}