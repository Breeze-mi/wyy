// 使用 import 替代 require
import { execSync } from 'child_process';
import fs from 'fs';
import { join } from 'path';
import { env } from 'process';



const isZh = () => !!process.argv.includes('zh');
const electronPath = {
    root: join(process.cwd(), 'node_modules/electron'),
    dist: join(process.cwd(), 'node_modules/electron/dist'),
};

// not has electronPath pls pnpm install
const hasPath = (path) => {
    try {
        const stat = fs.statSync(path);
        return stat.isDirectory();
    } catch (e) {
        return false;
    }
}

// hasFile
/**
 * 
 * @param {string} path 
 * @param {string} file 
 * @returns 
 */
const hasFile = (path, file) => {
    try {
        const stat = fs.statSync(join(path, file));
        return stat.isFile();
    } catch (e) {
        return false;
    }
}

/// ===================================================================================

if (!hasPath(electronPath.root)) {
    // exec pnpm install
    execSync('pnpm install');
}



if (hasPath(electronPath.dist) && hasFile(electronPath.dist, 'electron.exe')) {
    console.log('electron.exe exists');
} else {
    if (isZh() || !env.ELECTRON_MIRROR) {
        env.ELECTRON_MIRROR = 'https://npmmirror.com/mirrors/electron/';
    }
    process.chdir(electronPath.root);
    execSync('node install.js');
}

/// ===================================================================================