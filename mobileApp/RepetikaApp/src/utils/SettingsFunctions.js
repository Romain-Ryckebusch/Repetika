const Settings = [
    [
        ["SettingsScreen.section1.title"],
        ["SettingsScreen.section1.param1", "boolean", (itemValue) => {console.log("param1 : value changed - "+itemValue)}], 
        ["SettingsScreen.section1.param2", "boolean", (itemValue) => {console.log("param2 : value changed - "+itemValue)}], 
        ["SettingsScreen.section1.param3", "boolean", (itemValue) => {console.log("param3 : value changed - "+itemValue)}], 
        ["SettingsScreen.section1.param4", "boolean", (itemValue) => {console.log("param4 : value changed - "+itemValue)}], 
        ["SettingsScreen.section1.param5", "boolean", (itemValue) => {console.log("param5 : value changed - "+itemValue)}], 
        ["SettingsScreen.section1.param6", "boolean", (itemValue) => {console.log("param6 : value changed - "+itemValue)}], 
        ["SettingsScreen.section1.param7", "boolean", (itemValue) => {console.log("param7 : value changed - "+itemValue)}], 
    ],

    [
        ["SettingsScreen.section2.title"],
        ["SettingsScreen.section2.param1", "choice", (itemValue) => {console.log("picker1 : value changed - "+itemValue)}, "English", "Français"],
        ["SettingsScreen.section2.param2", "boolean", (itemValue) => {console.log("param1 : value changed - "+itemValue)}],
        ["SettingsScreen.section2.param3", "boolean", (itemValue) => {console.log("param2 : value changed - "+itemValue)}],
    ],

];

export default Settings;