# Pilami Link Bridge v0.1.0-beta.1

**Première bêta publique — Windows 10/11 x64.**

Pilami Link Bridge synchronise [Pilami Strudel Lab](https://pilami.fr/strudel/) avec Ableton Link : tempo, temps, phases et événements Play/Stop.

### Télécharger

- **Pilami-Link-Windows-x64-v0.1.0-beta.1.zip** — application portable pour Windows 64 bits. Décompresser entièrement puis lancer `Pilami-Link.exe`. Ne nécessite aucune installation de Node.js, Python ou Visual Studio.
- **Pilami-Link-Sources-v0.1.0-beta.1.zip** — sources correspondantes du pont et des dépendances Ableton Link, scripts de compilation et notices GPL.

### Installation et test

1. Ferme une éventuelle ancienne instance du bridge.
2. Décompresse complètement l'archive Windows dans un dossier local.
3. Lance `Pilami-Link.exe` et laisse la fenêtre ouverte.
4. Dans Ableton Live, active **Link**.
5. Pour que Play/Stop suive Live, active également **Start/Stop Sync** (« Synchro de démarrage arrêt »). Il s'agit d'un réglage distinct !
6. Ouvre [pilami.fr/strudel/](https://pilami.fr/strudel/) et clique sur **Connecter Link**.

Le bridge écoute uniquement sur `127.0.0.1:8765` et ne commande pas le tempo de Live.

### État et limites

- Compilation et test automatique Windows réalisés via GitHub Actions.
- Fonctionnement BPM + Play/Stop validé manuellement avec Ableton Live sur **Windows 10 64 bits**.
- **Windows 11 n'est pas encore vérifié** ; retours bienvenus.
- Le binaire est **non signé numériquement** : Windows SmartScreen peut avertir. Ne désactive pas les protections de Windows globalement.
- Le dossier livré contient plusieurs fichiers : **ne déplace pas l'EXE seul**, conserve les sous-dossiers avec lui.

### Licences

Code original du projet : GPL-2.0-or-later. SDK Ableton Link : GPLv2+ (ou licence propriétaire distincte). Wrapper Node `@ktamas77/abletonlink` : MIT. Les notices de licence et l'archive des sources correspondantes accompagnent cette bêta.

Un grand merci aux premiers testeurs ! ♥
