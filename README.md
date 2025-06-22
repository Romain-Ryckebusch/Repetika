# Utilisation de l'appli sur votre téléphone (Android et IOS)


## Ordinateur

Clonez le projet github ici présent.
Récupérez l'IP de votre ordinateur via le terminal
*Windows :*
```ipconfig```
*Linux :*
```ifconfig```
### Application

Modifiez le fichier 
```Repetika\mobileApp\RepetikaApp\src\config\config.js```
en remplacant BASE_URL par l'ip de votre odinateur (ne pas oublier :8000/api a la fin).

Dans ``` Reptika/mobileApp/RepetikaApp/ ```:
Installez les dépendances (uniquement la première fois)
```npm install```
```npx expo install```

Lancez expo:
```npx expo start --tunel```

### Serveur
Dans ``` Repetika\core ```

La première fois:
Installez les dépendances python:
````pip -r core/requirements.txt````

Dans ``` Repetika\core\MainServer ```
Executez la commande:
``` python manage.py runserver 0.0.0.0:8000 ```


## Téléphone
Sur votre téléphone, installez expo go.
Scannez le qr code qui s'est affiché quand vous avez éxecuté npx expo start


---


# Installation de Docker et Minikube

## Docker
Suivez les instructions correspondant à votre système d'exploitation sur [le site officiel de Docker](https://www.docker.com/)

### ajoutez votre utilisateur à la liste des utilisateurs Docker 
``sudo usermod -aG docker $USER'``

## Minikube
### Téléchargement de Minikube
```bash 
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
rm minikube-linux-amd64
```

### Lancement de Minikube
``minikube start``


---



# Création des conteneurs et leur déploiment

### On veut pointer vers le Docker interne de Minikube
``eval $(minikube docker-env)``

### Construction des images Docker

```bash
docker build -t main-service:latest ./main_service
docker build -t decks-service:latest ./decks_service
docker build -t cours-service:latest ./cours_service
docker build -t planning-service:latest ./planning_service
docker build -t session-service:latest ./session_service
docker build -t quiz-service:latest ./quiz_service
docker build -t authentification-service:latest ./authentification_service
```

### Ajout dans Kubernets avec kubectl
``minikube kubectl -- apply -f yaml/ ``

---


# Restauration de la base de données MongoDB


### Trouver le nom du pod MongoDB (exemple: mongodb-xxxxxxxxxx-xxxxx)
``minikube kubectl get pods``

### Copier la sauvegarde dans le pod
``minikube kubectl cp ./k8s/Default-Repetika-mongodump mongodb-xxxxxxxxxx-xxxxx:/tmp/save_mongo``

### Ouvrir un shell dans le pod
``minikube kubectl -- exec -it mongodb-xxxxxxxxxx-xxxxx -- bash``

### Restaurer la base MongoDB dans le pod
``mongorestore /tmp/save_mongo``

## Accès à la base MongoDB via Compass (port forwarding)
``minikube kubectl port-forward svc/mongodb-service 27017:27017``

## Afficher l'ip de Minikube
``minikube ip``

### On peut afficher les services (pour connaître leur port)
``minikube kubectl get svc``

---


# Mise en place d'Contrôleur d'entrée Ingress

## Activation
``minikube addons enable ingress``

### création d'une IP locale (ex : 127.0.0.1 ou 192.168.49.2) pour exposer les services de type LoadBalancer utilisés par l'Ingress Controller
``minikube tunnel``

## Ouvrir le fichier /etc/hosts
``sudo nano /etc/hosts``

## ajouter cette ligne en remplaceant IP_MINIKUBE par l'ip de Minikube
``IP_MINIKUBE main.local``

### Cette ligne indique au système que lorsqu'on entre main.local dans un navigateur ou une requête réseau, il doit contacter l’adresse ip correspondant à Minikube

---


# On peux maintenant interagir avec le cluster Minkube

## Avec React

``fetch('http://main.local/api/main/GetChapter')``

## Directement dans le navigateur

``http://main.local/api/main/ajout-cours``
