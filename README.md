# Pilami Link Bridge

Pont local entre **Ableton Link** et [Pilami Strudel Lab](https://pilami.fr/strudel/).

Le bridge lit le **BPM**, la position en temps et mesures, les participants Link et les états **Play/Stop**, puis les transmet à l'application web par WebSocket local. Il ne modifie pas le tempo ni le transport de Live.

> **Prototype Windows** : version fonctionnelle testée sur Windows 10 x64 avec Node.js 24 et Ableton Live. Il n'existe pas encore de version exécutable portable prête à lancer. Windows 11, macOS et Linux restent à tester.

## Installation (Windows 10 64 bits)

Prérequis : **Node.js 24**, **Python** et **Visual Studio Build Tools** (compilateur C++ et SDK Windows). Le module Ableton Link natif sera compilé sur ta machine.

1. Télécharge les sources depuis **Code → Download ZIP** et décompresse-les.
2. Exécute `01-installer-windows.cmd` (sans privilèges administrateur).
3. Ce script installe les dépendances, corrige la configuration C++20 et le problème byte-swap Windows du module `@ktamas77/abletonlink@1.2.3`, puis compile le module.
4. Exécute `02-demarrer-windows.cmd` et laisse cette fenêtre ouverte.
5. Dans **Ableton Live**, active **Link** ET **Start/Stop Sync** (« Synchro de démarrage arrêt ») si tu souhaites suivre les commandes de transport.
6. Sur [pilami.fr/strudel/](https://pilami.fr/strudel/), clique sur **Connecter Link**.

**Important :** Link peut synchroniser le BPM sans synchroniser Play/Stop ; l'option Start/Stop Sync est distincte dans Live.

## Fonctionnement

- WebSocket : `ws://127.0.0.1:8765` (interface locale seulement).
- Origines navigateur autorisées : `https://pilami.fr`, `https://www.pilami.fr` et quelques origines locales de développement.
- Informations envoyées environ 10 fois par seconde : `bpm`, `beat`, `phase`, `phase16`, `phase32`, `peers`, `playing`, `startStopSync`.
- Pas de modification du tempo ni de Play/Stop depuis le navigateur.
- Le site fonctionne normalement sans bridge.

La synchronisation du navigateur via WebSocket n'est **pas** à précision audio-échantillon.

## Dépannage

- **`Cannot find module 'ws'`** : l'installation npm n'a pas abouti ; relance l'installateur et consulte l'erreur affichée.
- **Erreur `string_view` ou C++14** : l'installateur applique automatiquement l'option C++20.
- **Erreur `__DARWIN_OSSwapInt64`** : l'installateur ajoute un alias de compatibilité Windows.
- **Le BPM suit mais pas Play/Stop** : vérifie **Start/Stop Sync dans Ableton Live**, distinct de Link.
- **Pas de connexion au WebSocket** : assure-toi que le bridge tourne et que la page est bien ouverte depuis pilami.fr.

## Licence et contributions

Le code du projet Pilami n'a pas encore de licence de redistribution explicite ; il faut en choisir une après vérification des dépendances avant d'annoncer une version libre et des contributions ouvertes. Le module `@ktamas77/abletonlink` et le SDK Ableton Link conservent leurs licences respectives. `node_modules`, binaires compilés et fichiers de configuration personnels sont exclus du dépôt.

Consulte [SECURITY.md](SECURITY.md) et [CHANGELOG.md](CHANGELOG.md).
