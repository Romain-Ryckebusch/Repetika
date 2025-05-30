# Liste de microservices :
**Domaine** | **Fonction** |
|---|---|
Authentification | Création de compte, connexion et gestion des sessions utilisateur
Profils | Gestion des préférences et paramètres de compte
Decks | Stockage des decks (en eux-mêmes, pas leur progression), + pièces jointes et tags, surtout utilisé par les autres microservices
Planification | gère la planification des prochaines révisions avec l'algo FSRS et stocke l'historique des révisions effectuées
Séance d'apprentissage | sélectionne les cartes dues, reçoit et traite les réponses
Cours | gère l'affichage et le débloquage progressif du cours
Quiz | Affiche les quiz permettant de valider un chapitre de cours et passer au suivant (correspond à la phase "learning" d'anki)
Stats | Gère les stats utilisateur et compte de façon générale
Notifications | Affiche les notifications push pour les versions tel
API gateway | point d'entrée unique pour toutes les requêtes API, est utile askip


# A faire ultérieurement :
- Créer un système permettant d'actualiser le contenu de *Quiz* en fonction du contenu de *Planification* (utile en cas de desync de ces deux BDD) : Si une carte appartenant à un chapitre donné est présente dans *Planification* cela signifie nécessairement que le quiz correspondant à ce chapitre a été réussi par le passé. De ce fait, on peut supprimer l'entrée correspondante de *Quiz* au cas où elle y serait restée (ça ne devrait normalement jamais arriver mais bon)

# ***IMPORTANT*** :
- Pour presque toutes les tables et interactions, il faut joindre l'id de l'utilisateur. Ce n'est pas précisé à chaque fois pour ne pas alourdir les tables, mais sauf si précisé (ex : partage de cours) on ne souhaite en général pas que l'utilisateur puisse avoir accès à des informations hors de son compte
- Les noms des cours peuvent être identiques pour deux utilisateurs **différents**. Il faut donc référencer les cours de *Cours* à la fois par nom du cour et par nom d'utilisateur
- Toutes les fonctions donnant à l'utilisateur la liste des cours auquel il a accès doivent inclure les cours "publics" **qu'il a rejoint**. 
- Certaines informations sont souvent demandées, comme la liste des cours de l'utilisateur. Il peut être pertinent de cache ça en local afin de ne pas le redemander à chaque fois

## Exemple structure utilisation :

---
### Révision deck
L'utilisateur veut lancer une séance de révision à propos des cartes d'un deck. Cela ouvre "Séance d'apprentissage". Séance d'apprentissage demande à "Planification" la liste des identifiants de carte à réviser aujourd'hui. Grâce à cette liste, "Séance d'apprentissage" demande à "Decks" la liste des cartes dont l'identifiant correspond à ceux donnés par "Planification". Il affiche ensuite les cartes, en prenant note pour chaque carte de si elle est répondue correctement ou non (en cas de réponse incorrecte, elle reste dans le roulement jusqu'à ce que la réponse soit correcte) puis envoie ces informations à "Planification" pour sauvegarder la progression et update les prochaines dates de révision de ces cartes

[1] Obtention de la liste des cartes à réviser (contenu inclus) | [2] Envoi des informations sur le déroulement de la séance de révision
**Services** | **Entrées** | **Sorties** | **Flux**
---|---|---|---
*Main* | //////// | //////// | [1] Appel à *Séance d'apprentissage* pour obtenir les cartes ; [2] Envoi des réponses aux cartes à *Séance d'apprentissage*
Séance d'apprentissage | [1] ID utilisateur + Nom Deck [+ chapitres] ; [2] Liste résultats | [1] Liste cartes ; [2] //////// | [1] Appel à *Decks* pour obtenir la liste des cartes correspondant aux critères (deck et chapitres ciblés si applicable); Appel à *Planification* à partir de la liste des ID des cartes concernées pour ne garder que celles à apprendre aujourd'hui ; Envoi de cette liste de cartes à *Main* ; [2] Réception des résultats de la révision de main (couples {id: réponse}) ; Envoi de ces résultats à *Planification*
Planification | [1] Liste ID cartes ; [2] Liste résultats | [1] Liste ID cartes ; [2] //////// | [1] Intersection entre les ID des cartes demandées et les ID des cartes à réviser aujourd'hui pour obtenir les ID des cartes demandées à réviser aujourd'hui ; Envoi de cette liste à "Séance d'apprentissage" [2] Réception des résultats et mise à jour des informations de planification (notamment la date de prochaine review) 
Decks | [1] Liste ID cartes | [1] Liste cartes| [1] Envoi de la liste des cartes (complètes, json entier) à *Séance d'apprentissage* en fonction des ID de cartes demandés

*<u>Notes</u>* : Les résultats peuvent avoir 3 valeurs : 0 pour "réussite directe" ; 1 pour "échec sans réussite" ; 2 pour "échec puis réussite". Le 1 étant notamment utilisé si l'utilisateur arrête de réviser avant la fin de la séance, à terme toutes les cartes du jour devraient finir par une réussite (donc 0 ou 2)

---

### Création cartes
L'utilisateur veut ajouter des cartes à un deck. Il doit donc sélectionner le cours et le chapitre concerné. Il aura alors l'occasion d'entrer le contenu des champs "Front" et "Back" (le fait d'ajouter des pièces jointes et de créer des modèles customs viendra après, pour le moment on fait simple) et de créer ainsi une liste de cartes. Cette liste sera ensuite envoyée à "Decks" pour le stockage, et à "Quiz" pour conditionner leur révision à la réponse d'un quiz de départ (correspondant à la phase "learning" d'Anki). Elles ne seront pas directement ajoutées à "Planification", ce sera géré par la fonction "quiz" (voir section [Quiz de validation](#quiz-de-validation) dans ce document)
*A ajouter par la suite* : Création de modèles et champs customs ; Possibilité de voir les chapitres concernés en parallèle de la création de carte

[1] Obtention de la liste des decks existants **appartenant à l'utilisateur** | [2] Envoi des cartes créées
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

### Lecture cours
L'utilisateur veut pouvoir consulter un de ses cours (qu'il possède et a débloqué). *Main* demande donc à *Cours* la liste des cours auquel l'utilisateur à accès, ainsi que le nombre de chapitres débloqués et existants pour chacun de ses cours, puis affiche ces informations à l'utilisateur (cours + nombre de chapitres débloqués/nombre de chapitres total). L'utilisateur sélectionne ensuite le cours qu'il souhaite voir, "Cours" détermine le nombre de chapitres que cet utillisateur a débloqués, combine les pdfs correspondants à ces chapitres, et envoie le pdf "combiné" à l'utilisateur pour lecture. 
*A noter* : En dessous du cours se trouvera un bouton pour réaliser le "quiz de validation" permettant de débloquer le prochain chapitre, sa fonction est détaillée dans la section [Quiz de validation](#quiz-de-validation)

[1] Obtenir la liste des chapitres lisibles + leur progression (chapitres débloqués/total) | [2] Obtenir le pdf de tous les chapitres débloqués
 
**Services** | **Entrées** | **Sorties** | **Flux**
---|---|---|---
*Main* | //////// | //////// | [1] Appel à *Cours* pour avoir la liste des informations sur les Cours (Noms, chapitres débloqués, chapitres existants) ; Envoi de cette information à l'utilisateur ; [2] Envoi du nom du cours choisi à *Cours* ; Réception du pdf de cours (combinant les pdf des chapitres débloqués)
*Cours* | [1] //////// [2] Nom cours | [1] Liste (Nom cours + nb chapitres débloqués + nb chapitres total) ; [2] pdf combiné du cours | [1] Appel à *Quiz* pour obtenir le nombre de chapitres non-débloqués pour chaque cours ; Soustraction du nombre de chapitres total par cette valeur afin d'avoir le nombre de chapitres débloqués ; Envoi de ce résultat avec le nom et le nombre de chapitres total ; [2] Appel à *Quiz* pour déterminer les chapitres débloqués ; Identification grâce à la BDD des chemins des pdfs concernés (ainsi que leur ordre) ; fusion des pdfs dans l'ordre indiqué ; Envoi de ce pdf fusionné à *Main*
*Quiz* | [1] Liste nom cours ; [2] Nom cours | [1] Table {Cours : nb chapitres non-débloqués} | [1] Pour chaque cours, détermine le nombre d'entrées dans la BDD, ce qui correspond aux nombre de chapitres pas encore débloqués + 1. Renvoie ensuite une map liant les noms des cours au nb de chapitres non-débloqués ; [2] Pareil que le 1 mais pour un cours donné

Notes additionnelles : selon l'implémentation de l'affichage des cours, il faudra peut-être créer un "[3] Lecture d'un chapitre spécifique". Il sera très similaire au 2 mais demandera aussi une position de chapitre et enverra directement le pdf associé plutôt que le combiner





---

### Ajout cours
L'utilisateur veut créer un cours. Il doit pour cela envoyer un pdf (une fonctionnalité tournant en local permettant de convertir les images en pdf) et spécifier les pages de début et de fin de chaque chapitre, ainsi que leur nom. Il peut également décider d'envoyer directement une liste de pdfs associés à des chapitres, auquel cas cette liste sera recombinée et les informations de séparation seront conservées et envoyées comme avant. Si le cours n'est pas divisé en chapitres l'utilisateur peut décider de tout envoyer en bloc, ce qui internalement créera un unique chapitre de toute la longueur du cours. Ces informations (PDF + liste (nom chapitre ; position ; longueur)) sont ensuite envoyées à *Cours*. *Cours* divise le pdf en des pdfs ne contenant qu'un unique chapitre, et répertorie dans la base de données leur emplacement dans le cloud ainsi que leur cours associé et leur "numéro de chapitre" (= position) afin de pouvoir le reconstruire dans l'ordre

<u>*Notes*</u> : Dans le MLD, les cours seuls et la liste des chapitres correspondants peuvent être stockés dans deux tables différentes, une table "Cours" (ne contenant que les noms des cours et des informations sur tout le cours) et une table chapitre (contenant les noms des chapitres et toutes les informations sur eux, + une clef étrangère vers la ligne de la table "Cours" correspondante)

[1] Envoi des informations de création de cours (pdf, liste [nom chapitre ; Longueur chapitre])
**Services** | **Entrées** | **Sorties** | **Flux**
---|---|---|---
*Main* | //////// | //////// | [1] Envoi des informations de création de cours à *Cours* ; Le pdf de tout le cours est envoyé directement (et sera divisé par chapitres une fois reçu), avec une liste ordonnée contenant les longueurs (en pages) et noms des chapitres, et le nom du cours, permettant ainsi de savoir exactement quand commencent et se finissent des chapitres donnés
*Cours* | [1] pdf complet ; liste [Nom chapitre ; Longueur] ; Nom cours | //////// | [1] Réception du pdf et de la liste d'informations permettant de le traiter ; Division du pdf selon les informations donnant la position et le nom des chapitres. Les fichiers sont stockés sur le serveur, et leurs informations (emplacement sur le serveur ; nom ; position dans le cours) sont stockés dans la BDD de *Cours*, et le cours est considéré "privé" par défaut (pourra être rendu public par [Partage Cours](#partage-cours))

---
### Modification cours
L'utilisateur souhaite modifier un cours qu'il possède. *Main* va donc demander à *Cours* la liste des cours de l'utilisateur afin qu'il puisse en sélectionner un à modifier. L'utilisateur en choisira un, et *Main* demandera à *Cours* les informations sur le cours donné puis les affichera à l'utilisateur (le pdf combiné, et les informations sur les chapitres). L'utilisateur pourra remplacer le pdf par un autre, modifier, ajouter, et/ou supprimer des chapitres. *Main* enverra ensuite les informations des modifications à *Cours* pour les mettre à jour, et si un chapitre est supprimé il les enverra également à *Decks* pour supprimer les cartes associées (*Decks* se chargera de les supprimer également de *Quiz* et de *Planification*)

<u>*Notes*</u> : Le titre du cours est la seule information ne pouvant pas être modifiée


[1] Obtenir liste des cours de l'utilisateur | [2] Obtenir informations détaillées sur le cours sélectionné (dont pdf complet) | [3] Mettre à jour les différentes BDD
**Services** | **Entrées** | **Sorties** | **Flux**
---|---|---|---
*Main* | //////// | //////// | [1] Appel à *Cours* pour obtenir la liste des cours appartenant à l'utilisateur ; [2] Appel à *Cours* pour obtenir les informations détaillées sur le cours sélectionné (y compris le pdf combiné) ; [3] Envoi des modifications à *Cours*, ainsi qu'à *Decks* si au moins un chapitre est modifié
*Decks* | [3] Liste (Nom deck + chapitres supprimés) | [3] //////// | [3] Pour chaque chapitre de la liste, suppression de toutes les cartes correspondant à la fois à ce cours et à ce chapitre dans la BDD ; Envoi des informations de suppression à *Planification* et à *Quiz* pour les y supprimer (normalement, tous les id des cartes de *Decks* se trouvent dans l'un ou l'autre)
*Planification* | [3] Liste ID cartes supprimées | [3] //////// | [3] Suppression de toutes les cartes dont l'ID fait partie de la liste (qui faisaient partie d'un chapitre supprimé)
*Cours* | [3] Liste [Ancien nom chapitre ; Nouveau nom chapitre ; Nouvelle longueur ; Nouvelle position] (avec "null" comme "Nouveau nom chapitre" pour signifier une suppression) ; nouveau pdf complet (ou information sur le fait qu'il n'a pas changé)| [3] //////// | [1] Envoi de la liste des noms de tous les cours possédés par l'utilisateur ; [2] Envoi des informations sur le cours sélectionné ; Combinaison des pdfs des différents chapitres dans l'ordre et envoi du résultat ; [3] Processus similaire à [Ajout Cours](#ajout-cours), pour chaque élément de la liste d'entrée la BDD est modifiée par les nouvelles informations (en se servant de "Ancien nom chapitre" pour retrouver les éléments), si un nouveau nom est "null" sa ligne de BDD est son pdf correspondants sont supprimés ; Si un nouveau pdf a été envoyé, il est divisé selon les nouvelles limites de chapitre, et les pdfs de chapitre correspondant au cours modifié sont tous remplacés par ces nouveaux pdfs
*Quiz* | [3] Liste (Cours & chapitres) supprimés | [3] //////// | [3] Suppression des entrées de quiz correspondant à un chapitre supprimé, si le chapitre était dans *Quiz*

---
### Suppression cours
L'utilisateur souhaite supprimer définitivement un cours qu'il possède, ainsi que les cartes et quiz associés. La suppression peut se passer de deux manières différentes, selon que le cours est public ou privé. Si le cours est public, *Main* destiné l'information de suppression à *Planification*, *Quiz*, et *Cours* uniquement. De plus, si le cours appartient à l'utilisateur suppresseur, *Cours* change le propriétaire à "none" de façon à ce que les autres personnes suivant ce cours puissent continuer à y accéder (seul un administrateur peut supprimer un cours universellement)
*Cours* renverra la liste des chapitres afin de pouvoir les supprimer de *Quiz*, et *Decks* doit également être appelé afin d'obtenir la liste des id des cartes concernées pour les supprimer de *Planification*
Si le cours est privé, *Cours* et *Decks* se chargent également de supprimer toutes les références respectivement au cours (dont pdf) et aux cartes du cours

*<u>Notes</u>* : du à la division particulière de cette fonction, les "deux" étapes seront nommées [1], [public], et [privé]. [1] Représente la partie commune aux deux étapes, les étapes exclusivement publiques ou privées sont respectivement nommées [public] ou [privé]


[1] Suppression cours (avant séparation) | [public] Suppression cours public | [privé] Suppression cours privé
**Services** | **Entrées** | **Sorties** | **Flux**
---|---|---|---
*Main* | //////// | //////// | [1] Envoi du nom du cours à supprimer à *Cours* ; Réception de l'information sur la nature du cours (public ou privé) ainsi que de la liste des noms des chapitres ; Envoi de ces informations à *Quiz* pour suppression ; Envoi de ces informations à *Decks* pour obtenir la liste des id des cartes concernées ([privé] et supprimer ces lignes de la BDD) ; Envoi de cette liste d'id à *Planification*
*Decks* | [1] Nom cours | [1] Liste ID cartes | [1] Obtention depuis la BDD interne de la liste des ID des cartes appartenant à ce Cours/Deck (N.B. les Decks ont le nom du cours associé) ; [privé] Suppression de toutes les cartes de cette liste ; [1] Renvoi de la liste des ID des cartes du cours (que les cartes aient été supprimées ou non)
*Planification* | [1] Liste ID cartes | [1] //////// | [1] Suppression de toutes les entrées de la BDD dont l'ID fait partie de la liste reçue
*Cours* | [1] Nom cours | [1] Nature cours ; Liste noms chapitres | [1] Obtention depuis la BDD de la nature du cours (public ou privé) ; Obtention de la liste des noms des chapitres [public] **si l'utilisateur authentifié est le propriétaire**, remplacement du propriétaire par "none". **Sinon**, suppression de son nom de la table "Souscriveur" ; [privé] Suppression de tous les pdfs des chapitres du cours ; Suppression de toutes les entrées concernant ce cours de la BDD ; [1] Renvoi des informations sur la nature du cours et la liste des chapitres du cours
*Quiz* | [1] Nom cours ; Liste noms chapitres | [1] //////// | [1] Suppression de tous les chapitres du cours de la BDD

---
### Partage cours 
L'utilisateur souhaite rendre un de ses cours "public". Pour cela *Main* envoie simplement cette information à *Cours*, qui change le status du cours de "privé" à "public", les conséquences secondaires sont détaillées dans [Suppression cours](#suppression-cours) et [Souscription cours partagé](#souscription-cours-partagé). Le cours peut donc être découvert par la fonction "Souscription cours partagé" (et de façon plus générale par les services des autres utilisateurs), et sa suppression n'est plus "complète" mais ne supprime que les éléments propres à l'utilisateur

*Notes* : Dans le MLD, différentes tables seront consacrées à stocker toutes les informations "communautaires" liées au cours publiés : une table "Likes/dislikes", une table "Commentaires", etc.

[1] Publication du cours
**Services** | **Entrées** | **Sorties** | **Flux**
---|---|---|---
*Main* | //////// | //////// | [1] L'utilisateur choisit un cours à rendre public (parmis les cours qui 1. lui appartiennent et 2. sont privés), écrit la metadata (à voir ensemble. Peut contenir une description, des exemples de cartes, etc.) ; *Main* envoie ensuite ces informations à *Cours*
*Cours* | [1] Nom cours ; metadata publique (description, exemples de cartes, etc. A discuter.) | [1] //////// | [1] Changement interne du status du cours (devient "Public") ; Ajout de toute la metadata (y compris une clef étrangère vers le "Cours" correspondant) à la table "Metadata cours public"

---
### Souscription cours partagé
L'utilisateur souhaite rejoindre un des cours publics dont il n'est pas l'auteur. *Main* demande donc à *Cours* la liste des noms des cours publics, la liste de leur metadata correspondante, la liste des informations communautaires, et la liste de leurs chapitres. *Main* les présente ensuite selon des modalités à définir (ex : pouvoir trier par date d'ajout, nombre de "Like", nombre de téléchargements, etc.). L'utilisateur sélectionne ensuite un cours, *Main* envoie l'information à *Cours* qui se charge de l'ajouter à la liste de "Souscriveur" du cours donné (liste automatiquement consultée par toutes les fonctions d'accès au cours, mais pas celles de changement des cartes (création/modification/suppression))

<u>*Notes :*</u> Du à la quantité importante d'opérations que *Cours* doit réaliser dans l'étape [2], il peut être pertinent de lui demander de l'exécuter périodiquement (ex : toutes les 6h) et cache le résultat

[1] Obtention de la liste des cours publics (et de leurs informations associées) | [2] Sélection d'un cours et ajout sur les listes de membres
**Services** | **Entrées** | **Sorties** | **Flux**
---|---|---|---
*Main* | //////// | //////// | [1] *Main* demande à *Cours* la liste de tous les cours définis comme publics, ainsi que la metadata correspondant à ces cours, les informations communautaires résumées (nombre de membres, de likes, et de commentaires, pas leur contenu individuel) ; [2] L'utilisateur choisit un de ces cours, *Main* envoie l'information à *Cours* pour que ce dernier l'ajoute à la table "Souscriveur"
*Cours* | [1] //////// ; [2] Nom du cours sélectionné ; Auteur du cours sélectionné | [1] Liste [Nom cours ; nb likes ; nb commentaires ; nb souscriptions ; Auteur ; metadata] ; [2] //////// | [1] *Cours* cherche d'abord le nom de tous les cours publics (ainsi que leurs auteurs) dans sa BDD principale ; Il va ensuite dans "Metadata" pour déterminer la metadata de chaque cours ; Il va dans "Infos communautaires" Pour obtenir le nombre de likes et commentaires correspondant à chaque cours ; Il va dans "Souscriveur" pour déterminer le nombre de souscriveurs de chaque cours ; Il renvoie toutes ces informations à *Main* ; [2] *Cours* ajoute le nom de l'utilisateur à la table "Souscriveur", en associant son nom à l'ID du cours rejoint

---









## Partie Quentin

### Connexion
Une fois l’utilisateur connecté, l’application ouvre « profil », applique ses paramètres préenregistrés si ils existent sinon elle applique ceux par défaut. (Elle vérifie le nombre de notifications pour l’afficher) 
Si l’utilisateur veux changer ses paramètres il va se rendre sur la page dédiée, celle-ci va afficher les paramètres actuels. Une fois que l’utilisateur à validé ses choix les nouveaux paramètres s’appliquent et sont transmis à « profil »

### Social
- L’utilisateur veux afficher la page Social. Cela ouvre « stats » qui demande à « profil » les amis de l’utilisateur actuel. « stats » transmet les statistiques réduites de l’utilisateur actuel, celles de ses amis ainsi que celles des autres utilisateurs.
- L’utilisateur veut ajouter un ami, « profil » transmet la liste de tout les utilisateurs puis qui modifie le liste d’amis.

**Services** | **Entrées** | **Sorties** | **Flux**
---|---|---|---
Main | //////// | //////// | [1] Appel à Stats pour affichage Social ; [2] Appel à Profils pour afficher la liste des utilisateurs ; [3] ajouter (ou supprimer) un ami
Profils| ID utilisateur | liste ID amis, liste utilisateurs | [2] Appel à "profil" pour obtenir la liste d'amis d'un utilisateur et la liste des autres utilisateurs
Profils| ID utilisateur, ID utilisateur cible, Action à affectuer|  //////// | [3] Appel à "profil" pour ajouter (ou supprimer) un ami
Stats|[1] ID utilisateur | [1] stats réduites utilisateur,[2] liste stats réduites amis,[3] liste stats réduites utilisateurs hors amis|appel profil pour obtenir la liste d'amis d'un utilisateur et la liste des autres utilisateurs puis appel stats pour obtenir les statistiques reduites correspondantes

### Statistiques
- L’utilisateur veux afficher la page Stats. Cela ouvre « stats » qui transmet les statistiques complètes de l’utilisateur actuel 
- L’utilisateur à révisé un certain nombre de carte ou quitte le mode révision, Cela ouvre « stats » qui met à jour ses statistiques suite à une demande d’un autre micro-service 


**Services** | **Entrées** | **Sorties** | **Flux**
---|---|---|---
Main | //////// | //////// |[1] Appel à Stats pour obtenir les statistiques complètes, [2] Appel à Stats pour obtenir les statistiques reduites de plusieurs utilisateurs, [3] Mise à jour des statistiques
Stats |ID utilisateur|statistiques complètes|[1] Appel à Stats pour obtenir les statistiques complètes
Stats |liste ID utilisateurs|liste statistiques réduites|[2] Appel à Stats pour obtenir les statistiques réduites
Stats |ID utilisateur, stat à modifier, valeur à modifier| ////////| [3] Mise à jour des statistiques

