import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

export async function POST(req) {
    const body = await req.json();
    const folderName = body.folderName;

    if (!folderName) {
        return new Response(JSON.stringify({ error: 'No folder name provided' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const result = await findFolder(folderName);
        const systemInfo = getSystemInfo();

        return new Response(JSON.stringify({
            ...result,
            systemInfo,
            searchedFolder: folderName
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error finding folder:', error);
        return new Response(JSON.stringify({
            error: 'Error finding folder',
            details: error.message,
            systemInfo: getSystemInfo(),
            searchedFolder: folderName
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

async function findFolder(folderName) {
    const homeDir = os.homedir();
    const searchDirs = [
        homeDir,
        path.join(homeDir, 'Documents'),
        path.join(homeDir, 'Downloads'),
        path.join(homeDir, 'Desktop'),
    ];

    if (os.platform() === 'win32') {
        searchDirs.push('C:\\Users');
    } else if (os.platform() === 'darwin') {
        searchDirs.push('/Users');
    } else {
        searchDirs.push('/home');
    }

    for (const dir of searchDirs) {
        console.log(`Searching in ${dir}...`);
        const result = await searchInDirectory(dir, folderName);
        if (result.found) {
            return { paths: result.paths, error: null };
        }
    }

    return { paths: [], error: 'Folder not found in common user directories' };
}

async function searchInDirectory(dir, targetFolder, depth = 10) {
    if (depth === 0) return { found: false, paths: [] };

    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        let paths = [];

        for (const entry of entries) {
            if (entry.isDirectory()) {
                const fullPath = path.join(dir, entry.name);
                if (entry.name === targetFolder) {
                    paths.push(fullPath);
                } else if (!isSystemFolder(fullPath)) {
                    const result = await searchInDirectory(fullPath, targetFolder, depth - 1);
                    if (result.found) {
                        paths = paths.concat(result.paths);
                    }
                }
            }
        }

        return { found: paths.length > 0, paths };
    } catch (error) {
        console.error(`Error accessing ${dir}:`, error.message);
        return { found: false, paths: [] };
    }
}

function isSystemFolder(folderPath) {
    const systemFolders = [
        'Library', 'System', 'bin', 'sbin', 'etc', 'var', 'tmp',
        'Program Files', 'Program Files (x86)', 'Windows', 'WinSxS'
    ];
    const folderName = path.basename(folderPath);
    return systemFolders.includes(folderName) || folderName.startsWith('.');
}

function getSystemInfo() {
    return {
        platform: os.platform(),
        type: os.type(),
        release: os.release(),
        userInfo: os.userInfo(),
        cwd: process.cwd(),
    };
}