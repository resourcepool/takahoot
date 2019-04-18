# Documentation takahoot
> Takahoot est une solution composé de 1 ou plusieurs cibles se connectant à des sessions kahoot pour répondre à des
quizz en utilisant des nerfs.

On distingue 3 éléments principaux:
- les cibles composées principalement de 4 boutons, 1 carte arduino et une interface de controle (3 leds, bouton de 
calibration et potentiometre de sensibilité)
- kahoot (kahoot.com) l'interface de jeux en ligne, ou sont sauvegardés les questionnaires et qui permet de lancer les
quizz (utiliser le compte takimahoot)
- le serveur takahoot qui se connecte aux cibles et permet leur configuration. Le serveur se charge de connecter les
joueurs à une session/quizz kahoot pour permettre de jouer

## Serveur
cd takahoot/
Utiliser node 10+/11+ (testé principalement avec node 11)
Installer le projet (npm install)
Lancer le serveur de dev (npm run dev)

## Configuration
1. Positionner les 4 cibles (1-NW, 2-NE, 3-SW, 4-SE)
2. Connecter les 4 cibles dans le bon ordre
3. Lancer le serveur takahoot
4. Lancer la configuration: les 4 cibles doivent apparaître (Si les cibles n'apparaissent pas revenir au point 2)
5. Initialisation: les cibles s'allument (3 leds ON)
6. Appairage: sélectionner les cibles une par une en vérifiant le positionnement (1-NW, 2-NE, 3-SW, 4-SE)
7. Calibration: les 4 cibles passent au rouge durant la calibration ~5 à 10 secondes
8. Test* et rêglage de la sensibilité: tester et rêgler les cibles une par une en ajustant la sensibilité avec le potentiomètre
vert 
9. Une fois les rêglages satisfaisant terminer les tests

*: NB concernant le fonctionnement des cibles:
(R: led rouge, Y: led jaune, G: led verte)
- RGY ON: connecté
- RGY BLINK: appairage
- R ON: calibration
- Y ON: en attente
- G ON: touché
NB: la cible est bloqué lorsqu'un tir est détecté et la led passe à G ON, dès lors aucun tir ne sera détecté (un tir 
peut être détecté seulement lorsque la cible est en attente, Y ON)

## Jeux
Pré-requis: les cibles participantes doivent avoir été configurée en suivant les étapes du point précédent
1. Accéder à l'interface de jeux: les cibles configurées apparaissent
2. Lancer une session sur kahoot et obtenir une id de session (copier l'identifiant de jeux)
3. Saisir/Coller l'identifiant de jeux dans l'interface serveur et lancer
4. Les joueurs apparaissent dans la session kahoot (si non revenir au point 2 et rafraîchir la page)
5. La partie est prête et démarre automatiquement en fonction de la configuration du jeux
6. Au début de chaque question (apparition des propositions sur l'écran kahoot chaque cible est remise en attente)
7. À la fin du jeux 2 options:
    - terminer la partie en fermant la session kahoot et en nettoyant le server (il faudra relancer cf point 2)
    - relancer le même questionnaire, pas d'action requise
    
## Troubleshoot
* joueurs phantomes: force refresh kahoot (dans le pire des cas relancer le serveur takahoot)

