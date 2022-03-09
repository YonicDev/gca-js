import './App.css';

import React from "react";
import type { ControllerStatus } from "gca-js"

import { ControllerChooser, Controller } from "./Controller"; 

export default function App() {
    const [controllerData, setControllerData] = React.useState<ControllerStatus[]>([]);
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
        const onControllerData = (e: CustomEvent) => {
            const controllers = e.detail as ControllerStatus[];
            setControllerData(controllers);
            const rumble = controllers.map(c => c.buttons.buttonA);
            window.dispatchEvent(new CustomEvent("controllerRumble", { detail: rumble }));
        }
        (window as any).addEventListener('controllerData', onControllerData);
        return () => {
            (window as any).removeEventListener('controllerData', onControllerData);
        }
    }, [])

    return (
        <div className="App">
            <div style={{textAlign: "center"}}>Press the A button on any of the controllers to make it rumble.</div>
            <ControllerChooser currentController={currentController} onDecrement={prevController} onIncrement={nextController} />
            <Controller data={controllerData} currentController={currentController} />
        </div>
    );
}
