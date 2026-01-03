# Repetika

A monorepo for a learning platform employing spaced repetition to make learning fun and effective.

## Highlights

- Multi-service backend (authentication, courses, decks, planning, sessions, quiz, main gateway)
- React Native app built with Expo for web and mobile
- Local Kubernetes workflow with **kind + Helm** (fully local)
- Continuous Integration with GitHub Actions, including testing and static analysis

---

## Getting started

### Prerequisites

- Docker Desktop (or Docker Engine)
- `kubectl`
- `kind`
- `helm`
- Node.js LTS + npm
- If testing on a mobile device, install **Expo Go** (App Store / Google Play)

---

### 0) Create a local cluster (kind)

```bash
git clone https://github.com/Romain-Ryckebusch/Repetika.git
cd Repetika

kind create cluster --name repetika --config k8s/kind-config.yml
kubectl cluster-info --context kind-repetika
````

---

### 1) Build backend images locally

The Kubernetes deployment uses local images. Build them, then load them into the kind cluster:

```bash
docker build -t repetika/main-service:local -f services/main_service/Dockerfile .
docker build -t repetika/decks-service:local -f services/decks_service/Dockerfile .
docker build -t repetika/cours-service:local -f services/cours_service/Dockerfile .
docker build -t repetika/planning-service:local -f services/planning_service/Dockerfile .
docker build -t repetika/session-service:local -f services/session_service/Dockerfile .
docker build -t repetika/quiz-service:local -f services/quiz_service/Dockerfile .
docker build -t repetika/authentification-service:local -f services/authentification_service/Dockerfile .

kind load docker-image repetika/main-service:local --name repetika
kind load docker-image repetika/decks-service:local --name repetika
kind load docker-image repetika/cours-service:local --name repetika
kind load docker-image repetika/planning-service:local --name repetika
kind load docker-image repetika/session-service:local --name repetika
kind load docker-image repetika/quiz-service:local --name repetika
kind load docker-image repetika/authentification-service:local --name repetika
```

---

### 2) Configure runtime settings (Helm values)

The Helm chart uses defaults in:

- `charts/repetika/values.yaml`

For local dev you can usually keep defaults. If you want to override values (recommended for secrets), you can pass them at install time:

```bash
helm upgrade --install repetika charts/repetika \
  -n repetika --create-namespace \
  --set app.secretKey="my_secure_key"
```

---

### 3) Deploy the stack with Helm

```bash
helm upgrade --install repetika charts/repetika -n repetika --create-namespace
kubectl get pods -n repetika -w
```

When everything is running, the gateway is exposed locally:

- **Backend gateway**: `http://localhost:8080`

---

### 4) Launch the app (Expo)

```bash
cd apps/mobile/RepetikaApp

npm install
npx expo install   # Press 'Y' when prompted to install ngrok
npx expo start --tunnel
```

#### Using the app

- **Web preview**: open the URL printed by the Expo CLI (or press `w`).
- **Mobile**: open **Expo Go** and scan the QR code.

> Important for mobile: your phone cannot reach `localhost:8080` on your laptop.
> Configure the app to use `http://<YOUR_LAPTOP_LAN_IP>:8080` as the backend base URL

---

## Operations

### View resources

```bash
kubectl get all -n repetika
kubectl get svc -n repetika
```

### Logs

```bash
kubectl logs -n repetika deploy/gateway
kubectl logs -n repetika deploy/main-service
kubectl logs -n repetika deploy/authentification-service
```

### Restart workloads (dev)

```bash
for d in $(kubectl -n repetika get deploy -o name); do kubectl -n repetika rollout restart "$d"; done
for s in $(kubectl -n repetika get sts -o name); do kubectl -n repetika rollout restart "$s"; done
```

### Uninstall (keep kind cluster)

```bash
helm uninstall repetika -n repetika
```

### Delete the kind cluster

```bash
kind delete cluster --name repetika
```

---

## Troubleshooting

* **Pods stuck in Init**: check MongoDB/Postgres pods first:

  ```bash
  kubectl describe pod -n repetika mongodb-0
  kubectl describe pod -n repetika postgres-0
  kubectl get events -n repetika --sort-by=.lastTimestamp | tail -n 50
  ```
* **Image not updating**: rebuild, `kind load docker-image ...`, then restart the deployment.
* **Gateway returns 404 on /**: normal if NGINX is only routing API prefixes. Inspect the deployed config:

  ```bash
  kubectl exec -n repetika deploy/gateway -- nginx -T
  ```
* **Expo tunnel issues**: try `npx expo start` and use **LAN**, or restart the Expo server.

---

## License

See `LICENSE` in the repository root.