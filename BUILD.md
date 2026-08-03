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

## Ce qui a changé le 03/08/2026 (chantier B)

**Tunnel de vente.** Un seul mur d'abonnement (`Paywall`), ouvrable depuis
n'importe quel écran via `usePaywall()`. Tout ce qui est verrouillé est
maintenant cliquable et y mène : les 4 outils, le bandeau des outils, les nœuds
du parcours bloqués par l'abonnement. « 4 jours gratuits » est devenu le titre,
avec un bouton d'essai, dans le mur, sur le mur de niveau et dans le Profil.

**Écran d'exercice.** Les durées écrites dans les consignes (« (4s) »,
« 15 secondes », « sur 4 temps ») sont lues et jouées : cercle de respiration
animé, décompte, repères sonores, cycles comptés pour « Répétez 10 fois »,
enchaînement automatique. Les consignes sans durée reçoivent un minuteur replié
calé sur la durée annoncée de l'exercice. Un chrono de pratique s'affiche en tête.
Rien n'est inventé : tout vient du texte des consignes (`parseStep`, `stepGuide`).

**Entrée dans l'app.** Mode découverte depuis la page d'accueil (`st.preview`) :
on entre sans compte, un bandeau propose la création de compte. Le test de
niveau est devenu optionnel et reproposé plus tard sur l'accueil
(`st.pendingQuiz`). En découverte : pas de conseil du jour, pas de tutoriel,
pas d'invitation à installer.

### Point à trancher (non modifié)

Dans l'onglet Pratique, les exercices ne sont filtrés que par l'XP, pas par le
plan : une compte gratuit avec assez d'XP peut ouvrir des exercices de niveaux
que le parcours, lui, verrouille derrière l'abonnement. C'est un choix
commercial, pas un bug de code — à décider avant de le refermer.
