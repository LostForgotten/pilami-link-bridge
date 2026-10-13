# Sécurité

Le bridge écoute uniquement sur `127.0.0.1` et vérifie l'en-tête `Origin` des connexions WebSocket. Il ne doit pas être exposé sur une interface réseau publique ni via un reverse proxy accessible sur Internet.

Il ne reçoit aucune commande du navigateur permettant de changer le tempo ou le transport d'Ableton Live.

Ne publiez jamais `node_modules`, les journaux locaux contenant des informations personnelles, les fichiers de configuration privés ou les binaires compilés sans revue de leurs dépendances.
