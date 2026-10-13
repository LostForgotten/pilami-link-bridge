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

Cette archive est assemblée et testée sur un runner Windows GitHub Actions, mais **le comportement avec Ableton Live sur un véritable PC doit encore être testé**. Elle n'est pas signée numériquement : Windows SmartScreen peut afficher un avertissement. Ne désactive pas les protections Windows globalement pour la faire fonctionner.

Si une version antérieure du bridge tourne déjà, ferme-la avant d'exécuter celle-ci, sinon le port 8765 sera occupé.

Les licences des composants tiers sont regroupées dans `licenses`.
