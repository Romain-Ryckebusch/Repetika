// src/navigation/NavigationService.js
import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name, params) {
    if (navigationRef.current?.isReady()) {
        navigationRef.current.navigate(name, params);
    }
}

export function getCurrentRoute() {
    if (navigationRef.current?.isReady()) {
        return navigationRef.current.getCurrentRoute();
    }
    return null;
}
