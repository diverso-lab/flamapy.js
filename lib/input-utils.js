import { existsSync, readFileSync } from 'fs';

export const getFileContent = (filepath) => {
    if (_fileExists(filepath) == false)
        return filepath;

    return _readInput(filepath, "utf-8");
}

function _fileExists(route) {
    try {
        return existsSync(route);
    } catch (error) {
        console.error("Error checking if the input is a file or plain text:", error);
        return false;
    }
}

function _readInput(route) {
    try {
        return readFileSync(route, "utf-8");
    }
    catch (error) {
        console.error("Error reading the input:", error);
        return "";
    }
}

