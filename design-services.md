# Liste de microservices :
**Domaine** | **Fonction** |
|---|---|
Authentification | Création de compte, connexion et gestion des sessions utilisateur
Profils | Gestion des préférences et paramètres de compte
Decks | Stockage des decks (en eux-mêmes, pas leur progression), + pièces jointes et tags, surtout utilisé par les autres microservices
Partage |  upload/download des cours & decks, likes, commentaires (essentiellement le lien entre app et site web de cloud)
Planification | gère la planification des prochaines révisions avec l'algo FSRS et stocke l'historique des révisions effectuées
Séance d'apprentissage | sélectionne les cartes dues, reçoit et traite les réponses
Cours | gère l'affichage et le débloquage progressif du cours
Quiz | Affiche les quiz permettant de valider un chapitre de cours et passer au suivant (correspond à la phase "learning" d'anki)
Stats | Gère les stats utilisateur et compte de façon générale
Notifications | Affiche les notifications push pour les versions tel
API gateway | point d'entrée unique pour toutes les requêtes API, est utile askip


# A faire :
Supprimer "Séance d'apprentissage" qui est complètement redondant, en adaptant les connexions en fonction
Discuter d'une potentielle fusion de "Quiz" et "Planification", les deux ayant globalement la même fonction et "Quiz" étant essentiellement une grosse BDD

# Notes :
Pour presque toutes les tables et interactions, il faut joindre l'id de l'utilisateur. Ce n'est pas précisé à chaque fois pour ne pas alourdir les tables, mais sauf si précisé on ne souhaite en général pas que l'utilisateur puisse avoir accès à des informations hors de son compte

## Exemple structure utilisation :

---
### Révision deck
L'utilisateur veut lancer une séance de révision à propos des cartes d'un deck. Cela ouvre "Séance d'apprentissage". Séance d'apprentissage demande à "Planification" la liste des identifiants de carte à réviser aujourd'hui. Grâce à cette liste, "Séance d'apprentissage" demande à "Decks" la liste des cartes dont l'identifiant correspond à ceux donnés par "Planification". Il affiche ensuite les cartes, en prenant note pour chaque carte de si elle est répondue correctement ou non (en cas de réponse incorrecte, elle reste dans le roulement jusqu'à ce que la réponse soit correcte) puis envoie ces informations à "Planification" pour sauvegarder la progression et update les prochaines dates de révision de ces cartes

**Services** | **Entrées** | **Sorties** | **Flux**
---|---|---|---
*Main* | //////// | //////// | [1] Appel à *Séance d'apprentissage* pour obtenir les cartes ; [2] Envoi des réponses aux cartes à *Séance d'apprentissage*
Séance d'apprentissage | [1] ID utilisateur + Nom Deck [+ chapitres] ; [2] Liste résultats | [1] Liste cartes ; [2] //////// | [1] Appel à *Decks* pour obtenir la liste des cartes correspondant aux critères (deck et chapitres ciblés si applicable); Appel à *Planification* à partir de la liste des ID des cartes concernées pour ne garder que celles à apprendre aujourd'hui ; Envoi de cette liste de cartes à *Main* ; [2] Réception des résultats de la révision de main (couples {id: réponse}) ; Envoi de ces résultats à *Planification*
Planification | [1] Liste ID cartes ; [2] Liste résultats | [1] Liste ID cartes ; [2] //////// | [1] Intersection entre les ID des cartes demandées et les ID des cartes à réviser aujourd'hui pour obtenir les ID des cartes demandées à réviser aujourd'hui ; Envoi de cette liste à "Séance d'apprentissage" [2] Réception des résultats et mise à jour des informations de planification (notamment la date de prochaine review) 
Decks | [1] Liste ID cartes | [1] Liste cartes| [1] Envoi de la liste des cartes (complètes, json entier) à *Séance d'apprentissage* en fonction des ID de cartes demandés
---

### Création cartes
L'utilisateur veut ajouter des cartes à un deck. Il doit donc sélectionner le cours et le chapitre concerné. Il aura alors l'occasion d'entrer le contenu des champs "Front" et "Back" (le fait d'ajouter des pièces jointes et de créer des modèles customs viendra après, pour le moment on fait simple) et de créer ainsi une liste de cartes. Cette liste sera ensuite envoyée à "Decks" pour le stockage, et à "Quiz" pour conditionner leur révision à la réponse d'un quiz de départ (correspondant à la phase "learning" d'Anki). Elles ne seront pas directement ajoutées à "Planification", ce sera géré par la fonction "quiz" (voir section "Quiz de validation" dans ce document (W.I.P))
*A ajouter par la suite* : Création de modèles et champs customs ; Possibilité de voir les chapitres concernés en parallèle de la création de carte

**Services** | **Entrées** | **Sorties** | **Flux**
---|---|---|---
*Main* | //////// | //////// | [1] Appel à *Decks* pour obtenir la liste des decks existants ; [2] Envoi des cartes créées à "Decks" ;  Envoi des ID des cartes créées (ainsi que leur chapitre)  à "Quiz"
Decks | [1] ID utilisateur ; [2] Liste cartes | [1] Liste noms decks ; [2] //////// | [1] Envoi de la liste des noms de decks à *Main* ; [2] Stockage des cartes dans la base de données
Quiz | [2] Liste (ID cartes + Cours & Chapitre)  | [2] //////// | [2] Ajout des ID des cartes (associées au deck et au chapitre) à la BDD de *Quiz*, qui répertorie les ID des cartes pour lesquelles le quiz initial n'a pas encore été effectué (on pourrait ne pas stocker le deck et le chapitre ici et le retrouver dans "Deck", mais les stocker ici permettent de déterminer directement si un chapitre est présent ou non).
---

### Quiz de validation
L'utilisateur veut voir une première fois les cartes correspondant à un chapitre de cours qu'il a fini de lire afin de faire la review initiale et les faire appraraître dans le roulement des révisions. "Cours" détermine donc la liste des chapitres dont la lecture a été terminée par l'utilisateur, et croise les informations avec "Quiz" afin de déterminer pour chaque chapitre s'il reste au moins une carte qui n'a pas été amorcée ("Quiz" ne stockant que les cartes qui n'ont pas encore été amorcées). L'utilisateur peut ensuite choisir d'effectuer les quiz d'un de ces chapitres non-complétés. Il répond aux cartes jusqu'à les avoir toutes complétées, et elles sont ensuites supprimées de "Quiz" et ajoutées à "Planification" pour démarrer leur révision longue-durée

[1] : Déterminer les chapitres sélectionnables | [2] Mettre à jour "Quiz" et "Planification" par rapport aux cartes amorcées
**Services** | **Entrées** | **Sorties** | **Flux**
---|---|---|---
*Main* | //////// | //////// | [1] Appel à *Cours* pour avoir la liste des chapitres finis ; Appel à "Quiz" à partir de cette liste pour savoir lesquels y sont présents ; Envoi de cette information à l'utilisateur ; [2] Envoi de la liste des ID des cartes validées à "Quiz" (pour retrait) ; Envoi de la liste des ID des cartes validées à "Planification" (pour ajout et première planification)
Planification | [2] Liste ID cartes | [2] //////// | [2] Effectue la première planification des cartes données, ce qui les ajoute à la BDD interne
Cours | [1] //////// | [1] Liste (Cours & Chapitres) | [1] Envoi de la liste des chapitres considérés comme terminés (lus au moins 1 fois)
Quiz | [1] Liste (Cours & Chapitres) ; [2] Liste ID cartes | [1] Liste (Cours & Chapitres) ; [2] //////// | [1] De la liste de chapitres donnée, ne renvoie que ceux présents au moins 1 fois dans la BDD interne (ce qui implique qu'il reste au moins 1 carte non-amorcée). ; [2] Supprime de la BDD les cartes de la liste
---

### Connexion
Une fois l’utilisateur connecté, l’application ouvre « profil », applique ses paramètres préenregistrés si ils existent sinon elle applique ceux par défaut. (Elle vérifie le nombre de notifications pour l’afficher) 
Si l’utilisateur veux changer ses paramètres il va se rendre sur la page dédiée, celle-ci va afficher les paramètres actuels. Une fois que l’utilisateur à validé ses choix les nouveaux paramètres s’appliquent et sont transmis à « profil »

### Social
- L’utilisateur veux afficher la page Social. Cela ouvre « stats » qui demande à « profil » les amis de l’utilisateur actuel. « stats » transmet les statistiques réduites de l’utilisateur actuel, celles de ses amis ainsi que celles des autres utilisateurs.
- L’utilisateur veux afficher la page Stats. Cela ouvre « stats » qui transmet les statistiques complètes de l’utilisateur actuel
- L’utilisateur à révisé un certain nombre de carte ou quitte le mode révision, Cela ouvre « stats » qui  met à jour ses statistiques

**Services** | **Entrées** | **Sorties** | **Flux**
---|---|---|---
Profils  |[1] ID utilisateur   | [1]liste d’amis|[]
Stats|[1] ID utilisateur,[2]liste ID amis | [1] stats réduites utilisateur,[2] liste stats réduites amis,[3] liste stats réduites utilisateurs hors amis|à compléter
Stats|[1] ID utilisateur| [1] stats utilisateur|à compléter
Stats||à compléter||à compléter||à compléter
