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




## Exemple structure utilisation :

---
### Révision deck
L'utiilisateur veut lancer une séance de révision à propos des cartes d'un deck. Cela ouvre "Séance d'apprentissage". Séance d'apprentissage demande à "Planification" la liste des identifiants de carte à réviser aujourd'hui. Grâce à cette liste, "Séance d'apprentissage" demande à "Decks" la liste des cartes dont l'identifiant correspond à ceux donnés par "Planification". Il affiche ensuite les cartes, en prenant note pour chaque carte de si elle est répondue correctement ou non (en cas de réponse incorrecte, elle reste dans le roulement jusqu'à ce que la réponse soit correcte) puis envoie ces informations à "Planification" pour sauvegarder la progression et update les prochaines dates de révision de ces cartes

**Services** | **Entrées** | **Sorties** | **Flux**
---|---|---|---
*Main* | //////// | //////// | Appel à *Séance d'apprentissage* pour obtenir les cartes ; Envoi des réponses aux cartes à *Séance d'apprentissage*
Séance d'apprentissage | [1] id utilisateur + Nom Deck [+ chapitres] ; [2] Liste résultats | [1] Liste cartes ; [2] //////// | [1] Appel à *Planification* Pour obtenir la liste des id des cartes à apprendre ; Appel à *Decks* pour obtenir la liste des cartes correspondant à ces id ; Envoi de cette liste de cartes à *Main* ; [2] Réception des résultats de la révision de main (couples {id: réponse}) ; Envoi de ces résultats à *Planification*
Planification | [1] id utilisateur + Nom Deck [+ chapitres] ; [2] Liste résultats | [1] Liste id cartes ; [2] //////// | [1] Envoi de la liste des id des cartes du jour à *Séance d'apprentissage* en fonction du deck demandé (**et** des chapitres le cas échéant) ; [2] Réception des résultats et mise à jour des informations de planification (notamment la date de prochaine review) 
Decks | [1] Liste id cartes | [1] Liste cartes| [1] Envoi de la liste des cartes (complètes, json entier) à *Séance d'apprentissage* en fonction des id de cartes demandés
---

### Création cartes
