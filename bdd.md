## Authentification
Comptes utilisateurs, sessions, mots de passe, préférences, paramètres, informations utilisateur.

| *id_user* | email  | password_hash | date_creation | last_login | pseudo | avatar_url | préférences_json |
|:---------:|:------:|:-------------:|:-------------:|:----------:|:------:|:----------:|:----------------:|
| string    | string | string        | Date          | Date       | string | string     | JSON             |


## Decks  
Decks de cartes, cartes, tags, pièces jointes. Contient 2 tables :

### Decks

| id_deck | id_user | nom_deck | tags  | date_creation |
|:-------:|:-------:|:--------:|:-----:|:-------------:|
| string  | string  | string   | array | Date          |

```id_user``` ici l'ID du créateur du Deck.
### Cartes

| id_carte | id_deck | front  | back  | pj_front       | pj_back        | tags  |
|:--------:|:-------:|:------:|:-----:|:--------------:|:--------------:|:-----:|
| string   | string  | string | string| array          | array          | array |

```pj``` : pièce jointe.

## Planification  
Historique des révisions, dates de prochaines révisions (algo FSRS).

| id_carte | id_user | date_prochaine | historique_json |
|:--------:|:-------:|:--------------:|:---------------:|
| string   | string  | Date           | JSON            |


## Séance d'apprentissage  
Sessions en cours, résultats des réponses.

| id_session | id_user | date  | cartes_json | résultats_json |
|:----------:|:-------:|:-----:|:-----------:|:--------------:|
| string     | string  | Date  | JSON        | JSON           |


## Cours  
Cours, chapitres, progression de lecture, fichiers PDF. Contient 2 tables :

### Cours

| id_cours | id_auteur | nom_cours | url    | public | date_creation |
|:--------:|:---------:|:---------:|:------:|:------:|:-------------:|
| string   | string    | string    | string | bool   | Date          |

### Chapitres

| id_chapitre | id_cours | nom_chapitre | ordre | pdf_url |
|:-----------:|:--------:|:------------:|:-----:|:-------:|
| string      | string   | string       | int   | string  |

```ordre``` allant de 1 à [nombre de chapitres].

## Quiz  
Quiz en attente, validation de chapitres, progression.

| id_quiz | id_user | id_chapitre | id_carte | status |
|:-------:|:-------:|:-----------:|:--------:|:------:|
| string  | string  | string      | string   | string |


## Stats  
Statistiques utilisateur.

| id_user | revisions_json  | nb_cartes_json | stabilite_json | moy_jour | moy_semaine | moy_mois | moy_an |
|:-------:|:---------------:|:--------------:|:--------------:|:--------:|:-----------:|:--------:|:------:|
| string  | JSON            | JSON           | JSON           | int      | int         | int      | int    |

# Autres
Ne sont pour le moment pas prévus ou à priori pas utilisés.
## Notifications 
Messages push, alertes.

| id_notif | id_user | message | date_envoi | lu   |
|:--------:|:-------:|:-------:|:----------:|:----:|
| string   | string  | string  | Date       | bool |

