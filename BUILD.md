# Castigat Academy — comment modifier l'app depuis le 30/07/2026

L'app n'est plus compilée dans le navigateur (Babel supprimé) : elle s'affiche
maintenant quasi instantanément. En échange, il y a une petite étape de build
quand on modifie le code.

## Les fichiers

| Fichier | Rôle |
|---|---|
| `src-app.jsx` | **Le code source de l'app** (lisible, en JSX). C'est ici qu'on modifie. |
| `castigat-academy.html` | Le fichier déployé : structure + CSS + le code compilé injecté entre les marqueurs `APP_JS_START` / `APP_JS_END`. On peut y modifier le CSS directement, mais jamais le bloc entre les marqueurs. |
| `build.js` | Compile `src-app.jsx` et met à jour `castigat-academy.html`. |

## Modifier l'app

```bash
# 1. éditer src-app.jsx (le code) ou le CSS dans castigat-academy.html
# 2. recompiler :
node build.js        # (npm i esbuild, une seule fois, si besoin)
# 3. déployer comme d'habitude :
git add -A && git commit -m "..." && git push
```

## Ce qui a changé le 30/07/2026 (chantier A)

- **Précompilation** : babel-standalone supprimé (2,8 Mo + compilation à chaque
  ouverture). Premier affichage : ~10 s → ~1 s.
- **Scroll d'onglet** : changer d'onglet remonte maintenant en haut de page
  (avant : on restait au milieu de l'écran précédent).
- **Icônes** : les 7 emojis de contenu qui n'avaient pas d'équivalent SVG sont
  mappés (💃👂🏯⏰⚡📜📊). Tout passe par `EMOJI_MAP` dans le source.
- **Tokens couleurs** : nouvelles variables `--red`, `--blue`, `--purple`,
  `--ink` (déclinées thème sombre ET clair) ; les hex codés en dur
  correspondants ont été remplacés dans le code. Prochaine étape (chantier C) :
  la direction artistique se réglera dans ces variables.
- **Autofill** : les champs remplis automatiquement par Chrome ne passent plus
  en lavande clair sur fond noir.
