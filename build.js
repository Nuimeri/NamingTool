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
        const relativePath = path.relative(srcDir, srcPath);

        // テストに不要な本番用のエントリポイントは除外する
        if (relativePath === 'Code.gs' || relativePath === 'index.html') {
            continue;
        }
        // appsscript.json is handled by the main build function, so skip it here.
        if (relativePath === 'appsscript.json') {
            continue;
        }

        const destPath = path.join(dest, item);
        const stat = await fs.lstat(srcPath);

        if (stat.isDirectory()) {
            await copyAndRenameForTest(srcPath, destPath);
        } else {
            const ext = path.extname(srcPath);
            // TestRunner.gsは.gsのままコピーし、それ以外の.gs, .js, .cssは.htmlを付与する
            if (relativePath === path.normalize('tests/TestRunner.gs')) {
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

        // 2. Copy appsscript.json first, as it's required for clasp to work correctly.
        await fs.copy(path.join(srcDir, 'appsscript.json'), path.join(distDir, 'appsscript.json'));

        if (mode === 'test') {
            console.log('Building for TEST environment...');
            // copyAndRenameForTest will process all files except appsscript.json
            await copyAndRenameForTest(srcDir, distDir);
            console.log('Test build complete.');
        } else if (mode === 'deploy') {
            console.log('Building for DEPLOY environment...');
            await fs.copy(srcDir, distDir, {
                filter: (src) => {
                    const relativeSrc = path.relative(srcDir, src);
                    if (relativeSrc === '') return true; // Allow the root src directory
                    // Exclude tests and lib directories from production build
                    return !relativeSrc.startsWith('tests') && !relativeSrc.startsWith('lib');
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