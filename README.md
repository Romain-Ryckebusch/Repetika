# Installation de Docker et Minikube

## Docker
### *À compléter*

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

## Afficher l'ip de Minikube (appelée par la suite *IP_MINIKUBE*)
``minikube ip``

### On peut afficher les services (pour connaître leur port)
``minikube kubectl get svc``

# Mise en place d'Contrôleur d'entrée Ingress

## Activation
``minikube addons enable ingress``

### création d'une IP locale (ex : 127.0.0.1 ou 192.168.49.2) pour exposer les services de type LoadBalancer utilisés par l'Ingress Controller
``minikube tunnel``

# On peux maintenant interagir avec le cluster Minkube

## Avec React

``fetch('http://IP_MINIKUBE/api/main/GetChapter')``

## Directement dans le navigateur

``http://IP_MINIKUBE/api/main/ajout-cours``


