## <u>Authentification</u>
Comptes utilisateurs, sessions, mots de passe, préférences, paramètres, informations utilisateur.

| <u>id_user</u> | email  | password_hash | date_creation | last_login | pseudo | avatar_url | préférences_json |
|:---------:|:------:|:-------------:|:-------------:|:----------:|:------:|:----------:|:----------------:|
| ObjectId    | string | string        | Date          | Date       | string | string     | JSON             |


## <u>Decks  </u>
Decks de cartes, cartes, tags, pièces jointes. Contient 2 tables :

### Decks

| <u>id_deck</u> | *id_user* | nom_deck | tags  | date_creation |
|:-------:|:-------:|:--------:|:-----:|:-------------:|
| ObjectId  | ObjectId  | string   | array (string)| Date          |

```id_user``` ici l'ID du créateur du Deck.
### Cartes

| <u>id_carte</u> | *id_deck* | *id_chapitre* | front  | back  | pj | tags  |
|:--------:|:-------:|:------:|:------:|:----:|:--------------:|:-----:|
| ObjectId   | ObjectId  | id_chapitre |string | string | JSON | array (string) |

```pj``` : pièces jointes, peuvnet être utilisées par le front et le back
`id_chapitre` : chapitre auxquelles sont rattachées les cartes (elles sont nécessairement liées à un chapitre pour que le système de progression fonctionne)

## <u>Planification  </u>
Historique des révisions, dates de prochaines révisions (algo FSRS).

### Planification

| *id_carte* | *id_user* | date_prochaine | difficulty | stability
|:--------:|:-------:|:--------------:|:---------:|:----------:|
| string   | string  | Date           | Int | Int

### Historique
| *id_carte* | date_resultat | resultat|
|---|---|---|
| ObjectId | Date | int |

```resultat``` : vaut 0 si bon du premier coup, 1 si faux d'abord et pas encore bon au moment de sauvegarder les résultats, et 2 si bon après une ou plusieurs erreurs


## <u>Séance d'apprentissage  </u>
Sessions en cours, résultats des réponses.

| <u>id_session</u> | *id_user* | date  | cartes_json |
|:----------:|:-------:|:-----:|:-----------:|
| ObjectId     | ObjectId  | Date  | JSON        |

```resultats_json``` : `{id_carte : resultat}` où `resultat` est tel que défini dans [Historique](#historique)


### Incomplete reviews
Liste de cartes dont le résultat est '1' : leur review n'a pas encore été finie, elle ne peuvent donc pas être replanifiées, mais ne peuvent pas non plus être ignorées car il faut se souvenir que la première réponse était incorrecte

| *id_user* | *id_carte* |
|-----------|------------|
| ObjectId  | ObjectId   |


## <u>Cours  </u>
Cours, chapitres, progression de lecture, fichiers PDF. Contient 2 tables :

### Cours

| <u>id_cours</u> | *id_auteur* | *id_deck* | nom_cours | chemin_dossier    | public | date_creation |
|:--------:|:---------:|:---------:|:------:|:------:|:-------------:|---|
| ObjectId   | ObjectId    | ObjectId |  string    | string | bool   | Date          |

### Infos publiques
| *id_cours* | Description | tags           |
|------------|-------------|----------------|
| ObjectId   | String      | array (String) |

### Likes

| *id_user* | *id_cours* | vote_positif |
|---|---|---|
| ObjectId | ObjectId | bool |

`id_user` est l'id de la personne ayant noté, `id_cours` celle du cours noté

### Commentaires

| *id_user* | *id_cours* | contenu |
|---|---|---|
| ObjectId | ObjectId | string |

### Chapitres

| id_chapitre | id_cours | nom_chapitre | position | chemin_pdf |
|:-----------:|:--------:|:------------:|:-----:|:-------:|
| ObjectId      | ObjectId   | ObjectId       | int   | string  |

```position``` allant de 1 à [nombre de chapitres].

## <u>Quiz  </u>
Quiz en attente, symbolise les chapitres dont les cartes n'ont pas encore été vues une première fois

| <u>id_quiz</u> | *id_user* | *id_chapitre* | *id_deck*
|:-------:|:-------:|:-----------:|:-----------:|
| ObjectId  | ObjectId  | ObjectId  | ObjectId


## <u>Stats  </u>
Statistiques utilisateur.

| id_user | revisions_json  | nb_cartes_json | stabilite_json | moy_jour | moy_semaine | moy_mois | moy_an |
|:-------:|:---------------:|:--------------:|:--------------:|:--------:|:-----------:|:--------:|:------:|
| ObjectId  | JSON            | JSON           | JSON           | int      | int         | int      | int    |

# Autres
Ne sont pour le moment pas prévus ou à priori pas utilisés.
## <u>Notifications </u>
Messages push, alertes.

| id_notif | id_user | message | date_envoi | lu   |
|:--------:|:-------:|:-------:|:----------:|:----:|
| string   | string  | string  | Date       | bool |

