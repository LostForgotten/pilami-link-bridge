# Pilami Link Bridge — Windows 10 / 11 x64 (préversion)

1. **Décompresse tout le ZIP** dans un dossier local, par exemple `Documents\Pilami-Link`.
2. **Double-clique sur `Pilami-Link.exe`**. Laisse la console ouverte pendant l'utilisation.
3. Active **Link** dans Ableton Live ou un logiciel compatible.
4. Pour synchroniser Play/Stop, active également **Start/Stop Sync** dans Live (français : « Synchro de démarrage arrêt »).
5. Ouvre [pilami.fr/strudel/](https://pilami.fr/strudel/) et clique sur **Connecter Link**.
6. Ferme la console pour arrêter le bridge.

L'application web continue de fonctionner sans le bridge. Le bridge n'a besoin ni de Node.js, ni de Python, ni de Visual Studio sur le PC de l'utilisateur. **Conserve tous les fichiers et sous-dossiers du ZIP ensemble**, y compris `node_modules` : le module natif est indispensable.

## Confidentialité et sécurité

Le programme ouvre uniquement un serveur WebSocket sur `127.0.0.1:8765` (ordinateur local). Il limite les connexions aux origines autorisées par son code et ne communique pas avec un serveur Pilami distant, hormis l'utilisation normale de ton navigateur web sur pilami.fr.

Il n'envoie aucune commande à Ableton. La découverte des pairs utilise le protocole réseau local Ableton Link.

## Préversion

Cette archive est assemblée et testée sur un runner Windows GitHub Actions ; **des tests réels avec Ableton Live sur Windows 10 x64 et Windows 11 x64 se sont bien passés**, y compris la synchronisation BPM, Play/Stop et la connexion au navigateur Pilami. Elle reste une bêta. Elle n'est pas signée numériquement : Windows SmartScreen peut afficher un avertissement. Ne désactive pas les protections Windows globalement pour la faire fonctionner.

Si une version antérieure du bridge tourne déjà, ferme-la avant d'exécuter celle-ci, sinon le port 8765 sera occupé.

Les licences des composants tiers sont regroupées dans `licenses`.

## Source et licences

Le code original Pilami et le SDK Ableton Link sont distribués conformément à la **GPLv2 ou ultérieure**. Les notices de licence et le texte complet de la GPLv2 sont inclus avec l'exécutable ; les sources correspondantes sont fournies dans une seconde archive sur la page GitHub Releases du projet.
