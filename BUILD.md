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

## Chantier DA — 4 août 2026

Application de la direction artistique validée (monologues illustrés + parcours)
à toute l'app.

### La racine
- `castigat-academy.html`, bloc `<style>` : jetons `:root` refaits (nuit bleue
  `#0A0E1C`, carte `#121829`, deux ors, violet `#B8A0E0`), plus `--gr-or`,
  `--gr-violet`, `--gr-nuit`, `--ombre`.
- Typographie : **Archivo** partout (`.heading` = 900, `-.025em`),
  **Cormorant Garamond italique** réservé aux vers via `.vers`.
  Bebas Neue, Inter, Noto Sans, Oswald et Playfair Display supprimés du chargement.
- Nouveaux composants : `.ill-card` (+ `::before` voile, `::after` grain),
  `.illus`, `.ill-in`, `.pill`, `.tag`, `.sep`, `.rang`, `.vl`.

### Les dessins
- `img/n/*.svg` — les 12 niveaux ; `img/p/*.svg` — 7 personnages du répertoire.
- Optimisés à svgo, fond opaque retiré, chargés en `loading="lazy"`.
  **Ce sont des fichiers du dépôt : ils doivent être poussés avec le HTML.**
- Composant `Illus` dans `src-app.jsx`, table `LV_ART` (dégradé par niveau) et
  `MONO_PERSO` / `MONO_GRAD` (monologues).
- Un texte sans dessin reçoit une capitale ornée en Cormorant — jamais un trou.

### Les écrans
- `Home` : en-tête compact, carte illustrée du niveau, section « Aujourd'hui »
  en rangées, puis `ProgressPath` remonté juste après.
- `ProgressPath` entièrement réécrit : niveaux passés repliés, deux prochains en
  cartes illustrées, le reste en lignes. La grille de bulles a disparu (elle
  doublait l'onglet Pratique).
- `ModList` : bandeau illustré pour le niveau en cours, rangées `.rang`.
- Bibliothèque de monologues : cartes illustrées.
- `Profile` : carte du comédien illustrée.
- `ExV` : en-tête refait ; l'écran de fin reçoit `next` / `onNext` depuis
  `ModList` et propose l'exercice suivant.

### Corrections embarquées
1. `passedExams` n'est plus purgé au démarrage (ne restaient que les identifiants
   inconnus).
2. Bouton d'examen mort supprimé avec la réécriture de `ProgressPath`.
3. `finish()` n'accepte plus qu'un nombre — les étoiles ne sont plus `null`.
4. Échauffement vocal : bouton ajouté dans l'onglet Outils.

### Reste à faire
- 17 monologues sur 25 n'ont pas encore leur dessin (crédits Higgsfield jusqu'au
  13 août 2026).
- Décision commerciale : l'onglet Pratique ne lit toujours pas `st.plan`.
- `index.html` force encore un re-téléchargement complet à chaque visite.

## Corrections du 4 août (soir)

- **Mur d'abonnement sur Pratique et Culture.** `ModList` lit désormais
  `st.plan` : au-delà de `startLevel + 3`, les niveaux se replient sur une
  ligne et le clic ouvre l'offre. L'onglet passait de 20 hauteurs d'écran à
  3,4 pour un compte gratuit, et le parcours payant n'est plus accessible
  par cette porte.
- **La série compte le travail, plus les ouvertures.** L'effet qui
  incrémentait `streak` au chargement et au retour d'onglet est supprimé ;
  la série avance quand l'XP augmente. `serieVive(st)` affiche zéro si la
  dernière journée travaillée n'est ni aujourd'hui ni hier.
- **Le Monstre Sacré** redessiné (le salut au rideau) : l'ancien gardait un
  bloc sombre rectangulaire.

## La séance et la révision espacée — 4 août

### La séance du jour
- `construireSeance(st)` compose trois contenus : un exercice, une révision
  due (ou une leçon neuve), puis un second exercice d'une autre catégorie.
- Le composant `Seance` monte `ExV` / `CuV` à la suite, sans repasser par le
  menu, et `SeanceFin` clôt la journée (contenus, minutes, XP).
- `ExV` et `CuV` acceptent `seance={i,n}` : compteur d'étape en en-tête, et
  l'écran de fin enchaîne au lieu de renvoyer au menu.
- L'accueil : la carte du niveau porte « Ma séance · N min », et la section
  qui suit **est** la séance (les trois étapes). Une fois faite, la section
  redevient « Aujourd'hui » à la carte et la carte dit « À demain ».
- `st.seanceFaite` (date) et `st.seances` (compteur).

### La révision espacée
- `updateSRS` était appelée à **chaque question** du quiz de culture, ce qui
  multipliait l'intervalle par quatre sur un quiz de quatre questions. Elle
  n'est plus appelée qu'une fois, à la fin, sur le résultat d'ensemble.
- `revisionsDues(st)` et `prochaineRevision(st)` : la lecture, qui n'existait
  pas. Une section « À revoir » sur l'accueil, triée par retard, qui dit
  depuis combien de temps la leçon n'a pas été revue et si elle est fragile.
- Ce qui est déjà dans la séance du jour n'est pas répété dans « À revoir ».
- L'ancienne « révision de la semaine » (un module au hasard) est supprimée.
