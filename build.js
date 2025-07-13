const fs = require('fs-extra');
const path = require('path');

const srcDir = path.resolve(__dirname, 'src');
const distDir = path.resolve(__dirname, 'dist');
const mode = process.argv[2]; // 'test' or 'deploy'

/**
 * Recursively copies files for the 'test' build, renaming script/style files to .html.
 */
async function copyAndRenameForTest(src, dest) {
    await fs.ensureDir(dest);
    const items = await fs.readdir(src);
    for (const item of items) {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        const stat = await fs.lstat(srcPath);

        if (stat.isDirectory()) {
            await copyAndRenameForTest(srcPath, destPath);
        } else {
            const ext = path.extname(srcPath);
            // TestRunner.gsは.gsのままコピーし、それ以外の.gs, .js, .cssは.htmlを付与する
            if (srcPath.endsWith(path.normalize('tests/TestRunner.gs'))) {
                await fs.copy(srcPath, destPath);
            } else if (['.gs', '.js', '.css'].includes(ext)) {
                await fs.copy(srcPath, destPath + '.html');
            } else {
                await fs.copy(srcPath, destPath);
            }
        }
    }
}

async function build() {
    try {
        // 1. Clean dist directory
        await fs.emptyDir(distDir);

        if (mode === 'test') {
            console.log('Building for TEST environment...');
            await copyAndRenameForTest(srcDir, distDir);
            console.log('Test build complete.');
        } else if (mode === 'deploy') {
            console.log('Building for DEPLOY environment...');
            await fs.copy(srcDir, distDir, {
                filter: (src) => {
                    // Exclude tests and lib directories from production build
                    return !src.startsWith(path.join(srcDir, 'tests')) && !src.startsWith(path.join(srcDir, 'lib'));
                }
            });
            console.log('Deploy build complete.');
        } else {
            throw new Error("Invalid build mode. Use 'test' or 'deploy'.");
        }
    } catch (err) {
        console.error('Build failed:', err);
        process.exit(1);
    }
}

build();