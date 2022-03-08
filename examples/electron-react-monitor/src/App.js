import './App.css';
import React from 'react';

import {Controller, ControllerChooser} from './Controller';

function App() {
    const [controllerData, setControllerData] = React.useState([]);
    const [currentController, setCurrentController] = React.useState(0);

    const prevController = () => {
        setCurrentController((currentController) => {
            return Math.max(0, Math.min(currentController - 1, 3));
        })
    }
    const nextController = () => {
        setCurrentController((currentController) => {
            return Math.max(0, Math.min(currentController + 1, 3));
        })
    }

    React.useEffect(() => {
        const onControllerData = (e) => {
            const controllers = e.detail;
            setControllerData(controllers);
            const rumble = controllers.map(c => c.buttons.buttonA);
            window.dispatchEvent(new CustomEvent("controllerRumble", { detail: rumble }));
        }
        window.addEventListener('controllerData', onControllerData);
        return () => {
            window.removeEventListener('controllerData', onControllerData);
        }
    }, [])

    return (
        <div className="App">
            <center>Press the A button on any of the controllers to make it rumble.</center>
            <br/>
            <ControllerChooser currentController={currentController} onDecrement={prevController} onIncrement={nextController} />
            <Controller data={controllerData} currentController={currentController} />
        </div>
    );
}

export default App;
