# Hydra dans Firefox : choisir le GPU sur un portable Windows

Un portable équipé d'une carte graphique puissante peut afficher des visuels Hydra moins fluides qu'un PC plus ancien. Avant d'alléger le preset, vérifier quel GPU Firefox utilise réellement pour WebGL.

## Symptôme rencontré

Le preset était fluide sur un PC de bureau, mais ralentissait sur le portable en plein écran sur un écran HDMI. Le rapport Firefox indiquait **Intel Iris Xe Graphics**, alors que le portable possédait également une **NVIDIA GeForce RTX 3060 Laptop GPU**.

**Résultat validé :** choisir **Hautes performances — NVIDIA GeForce RTX 3060 Laptop GPU** pour Firefox dans Windows a rétabli la fluidité du preset sur ce portable en plein écran HDMI. Dans ce cas, le choix du GPU était donc déterminant. La vérification du rapport WebGL reste utile pour diagnostiquer les autres configurations.

## 1. Vérifier le GPU utilisé par Hydra

Dans Firefox, saisir `about:support` dans la barre d'adresse, puis ouvrir la section **Graphiques**.

Repérer **Pilote WebGL 1 — Rendu**. Le nom de la carte apparaît dans cette ligne, par exemple :

```text
ANGLE (Intel, Intel(R) Iris(R) Xe Graphics ..., Direct3D11 ...)
```

Dans ce cas, WebGL utilise la puce Intel intégrée. La seule mention **WebRender** dans la ligne Composition ne permet pas d'identifier le GPU utilisé par le contexte WebGL d'Hydra.

## 2. Choisir la carte dédiée pour Firefox

Sous Windows 11 :

1. Ouvrir **Paramètres → Système → Écran/Affichage → Graphiques**.
2. Rechercher **Firefox** dans la liste des applications.
3. S'il est absent, cliquer sur **Ajouter l'application de bureau**, puis sélectionner `firefox.exe`. Son emplacement habituel est `C:\Program Files\Mozilla Firefox\firefox.exe`. Si Firefox est installé ailleurs, sélectionner son véritable exécutable.
4. Ouvrir sa fiche et choisir **Préférence GPU → Hautes performances**. Vérifier le nom de la carte indiqué : dans notre exemple, **NVIDIA GeForce RTX 3060 Laptop GPU**.
5. Enregistrer si un bouton est proposé, puis fermer complètement Firefox et le relancer.

Selon la version de Windows, le choix peut se trouver derrière un bouton **Options**. La préférence s'applique à Firefox, sans modifier celle des autres applications.

Pour les systèmes Windows récents, utiliser d'abord ce réglage Windows : il peut prendre priorité sur le choix effectué dans le panneau NVIDIA.

## 3. Confirmer le résultat

Après redémarrage de Firefox :

- Relire **Pilote WebGL 1 — Rendu** dans `about:support`. Vérifier que la carte dédiée apparaît effectivement.
- Retester **le preset original**, sur **le même écran HDMI**, avec la même résolution, la même fréquence et le même mode plein écran.
- Comparer la fluidité avant de modifier d'autres réglages.

La sélection « Hautes performances » ne suffit pas à prouver le basculement : le rapport WebGL après redémarrage permet de le vérifier.

## Si le ralentissement reste présent

Dans **Paramètres → Système → Affichage → Affichage avancé**, sélectionner l'écran HDMI et relever sa résolution active et sa fréquence en Hz. Comparer ensuite une fenêtre maximisée et le plein écran, puis le même preset dans un autre navigateur.

Ces essais permettent de distinguer le choix du GPU, le coût de la résolution et un problème lié au plein écran ou au navigateur.

## Sources officielles

- [Mozilla — Informations de dépannage de Firefox](https://support.mozilla.org/en-US/kb/use-troubleshooting-information-page-fix-firefox)
- [Microsoft — Préférences graphiques par application dans Windows 11](https://support.microsoft.com/fr-fr/windows/hardware/display-graphics/optimizations-for-windowed-games-in-windows-11)
- [NVIDIA — Priorité des paramètres graphiques de Windows](https://www.nvidia.com/content/control-panel-help/vlatest/fr-fr/mergedprojects/nv3dfra/Setting_the_Preferred_Graphics_Processor.htm)
- [Microsoft — Fréquence d'actualisation du moniteur](https://support.microsoft.com/fr-fr/windows/hardware/display-graphics/change-the-refresh-rate-on-your-monitor-in-windows)
