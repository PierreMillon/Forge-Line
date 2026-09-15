// Harnais commun à simulate.mjs et tests.mjs (v18.14, revue de code :
// les deux scripts dupliquaient mot pour mot l'ouverture du navigateur,
// le viewport mobile, la neutralisation de requestAnimationFrame et la
// capture des erreurs de page — un changement devait être fait deux fois
// ou les deux outils mesuraient deux jeux différents).
//
// Principe partagé : la page a sa propre boucle requestAnimationFrame
// (temps réel) qui tournerait EN PLUS des appels manuels à update() avec
// des horloges synthétiques — les deux se marchent dessus (vagues
// bloquées, NaN). On la neutralise avant tout script de la page. Le son
// est coupé : en headless l'horloge audio n'avance jamais, chaque
// bruitage laisse un nœud jamais collecté (fuite mémoire, v17.72).

import { chromium } from 'playwright';

export const CHROMIUM_PATH = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
// viewport mobile (Pierre joue sur iPhone) : sans lui, Playwright ouvre
// une page de bureau où une tour ne couvre qu'un quart de la carte
export const MOBILE_VIEWPORT = { width: 420, height: 800 };

export function argVal(name, def){
  const m = process.argv.find(a => a.startsWith(`--${name}=`));
  return m ? m.split('=').slice(1).join('=') : def;
}

// Ouvre le jeu et installe, côté page, les aides partagées :
//   __H.teleport(x, y, fn) : exécute fn avec le joueur déplacé en (x, y), puis le remet
//   __H.buildAt(dx, kind)  : bâtit une tour/catapulte sur la case devant la porte décalée de dx
export async function openGamePage(url){
  const browser = await chromium.launch({ executablePath: CHROMIUM_PATH });
  const page = await browser.newPage({ viewport: MOBILE_VIEWPORT });
  await page.addInitScript(() => { window.requestAnimationFrame = () => 0; });
  const pageErrors = [];
  page.on('pageerror', e => pageErrors.push(String(e)));
  await page.goto(url);
  await page.waitForTimeout(400);
  await page.evaluate(() => {
    sfxVolume = 0; musicVolume = 0;
    window.__H = {
      teleport(x, y, fn){ const px = player.x, py = player.y; player.x = x; player.y = y; try { return fn(); } finally { player.x = px; player.y = py; } },
      buildAt(dx, kind){
        const W = wallScreen();
        const n = towers.length;
        this.teleport(W.gateX + dx, playerSpawnY() - 30, () => kind === 'catapult' ? tryCatapultAction() : tryTowerAction());
        return towers.length > n;
      },
    };
  });
  return { browser, page, pageErrors };
}
