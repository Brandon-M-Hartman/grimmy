import { Assets } from "pixi.js";
import roles from '../data/roles.json';

export class AssetLoader {
    static loadAssets():Promise<any> {
        const textures:Array<string> = [];

        Assets.add({
            alias: 'token.background',
            src: 'assets/token/background.png',
        });
        textures.push('token.background');

        Assets.add({
            alias: 'right.1',
            src: 'assets/token/right-1.webp',
        });
        textures.push('right.1');

        Assets.add({
            alias: 'right.2',
            src: 'assets/token/right-2.webp',
        });
        textures.push('right.2');

        Assets.add({
            alias: 'left.1',
            src: 'assets/token/left-1.webp',
        });
        textures.push('left.1');

        for (var i = 1; i <= 6; i++) {
            Assets.add({
                alias: 'top.' + i,
                src: `assets/token/top-${i}.webp`,
            });
            textures.push('top.' + i);
        }

        Assets.add({
			alias: 'setup',
			src: 'assets/token/setup.webp'
		});
        textures.push('setup');

        // load icons for all the roles
        for (const key in roles) {
            Assets.add({
                alias: 'icon.' + key,
                src: 'assets/token/' + key + '.webp'
            });
            textures.push('icon.' + key);
        }

        return Assets.load(textures);
    }
}