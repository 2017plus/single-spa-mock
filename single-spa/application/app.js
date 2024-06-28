import { reroute } from "../navigation/reroute.js";
import { NOT_LOADED } from "./app.helper.js";

export const apps = [];

export const registerApplication = (appName, loadApp, activeWhen, customProps) =>{
    const registeration = {
        name: appName,
        loadApp,
        activeWhen,
        customProps,
        status: NOT_LOADED,
    }

    apps.push(registeration)

    reroute();
}