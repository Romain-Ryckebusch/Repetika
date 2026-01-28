# Repetika

Repetika is a spaced repetition learning platform. The production instance is operated as a SaaS and runs on a Kubernetes cluster hosted on DigitalOcean (DOKS).

This repository is a monorepo containing:

- Multi-service backend (authentication, courses, decks, planning, sessions, quiz, main gateway)
- React Native app built with Expo for web and mobile
- Helm chart for the full stack (`charts/repetika`)
- Infrastructure code for:
  - Local development (kind)
  - Production deployment to DigitalOcean (Terraform + Helm)

---

## High-level architecture (production)

Production is built around:

- **DigitalOcean Kubernetes (DOKS)**  
  Kubernetes cluster running:
  - Backend services (main, decks, cours, planning, session, quiz, authentication)
  - MongoDB and PostgreSQL (stateful services)
  - A frontend deployment (web UI)
  - A gateway (NGINX) for internal API routing

- **DigitalOcean Container Registry (DOCR)**  
  All Docker images for the backend and frontend are built and pushed to a DOCR registry (e.g. `registry.digitalocean.com/repetika`).

- **Helm chart**  
  `charts/repetika` describes the full platform:
  - `mongo` StatefulSet + Service
  - `postgres` StatefulSet + Secret (`secret-postgres.yaml`)
  - `frontend` Deployment + Service (type `LoadBalancer`)
  - `gateway` Deployment + Service (NodePort)
  - Backend deployments and services for each microservice
  - Monitoring stack: Prometheus, Grafana, cAdvisor, node-exporter

- **Observability**
  - Prometheus (+ node-exporter, cAdvisor) for metrics
  - Grafana for dashboards (admin credentials are configurable via Terraform/Helm)

- **CI/CD**
  - GitHub Actions:
    - `.github/workflows/ci.yml`: tests + static checks
    - `.github/workflows/semgrep.yml`: static analysis
    - `.github/workflows/cd-doks.yml`: build images, push to DOCR, apply Terraform to DOKS

---

## Production deployment on DigitalOcean

The production stack is managed with Terraform and Helm and deployed via GitHub Actions.

### Components involved

- **Root Terraform config** (`main.tf`)
  - Uses a remote backend on Terraform Cloud (organization `repetika`, workspace `repetika-doks`).
  - Declares variables such as:
    - `do_token`
    - `cluster_name`
    - `image_registry`
    - `image_tag`
    - `django_secret_key`
    - `postgres_password`
    - `grafana_admin_password`
    - `namespace`
  - Calls the module in `infra/doks`

- **DOKS module** (`infra/doks/main.tf`)
  - Uses `digitalocean`, `kubernetes` and `helm` providers.
  - Targets the DOKS cluster (via `cluster_name` and `do_token`).
  - Creates the Kubernetes namespace
  - Installs/updates the `repetika` Helm release

---

## GitHub Actions CD (DigitalOcean)

### Workflow: `.github/workflows/cd-doks.yml`

On pushes to `master`, the `repetika-doks-cd` job runs and:

1. Builds Docker images for all services and tags them (with the current commit SHA).
2. Pushes images to the DigitalOcean Container Registry (`REGISTRY_NAME`).
3. Runs Terraform to apply infrastructure and Helm changes.

The workflow relies on these **GitHub secrets**:

- `REGISTRY_NAME`  
  DOCR registry name (e.g. `registry.digitalocean.com/repetika`).

- `CLUSTER_NAME`  
  Name of the target DOKS cluster.

- `DIGITALOCEAN_ACCESS_TOKEN`  
  DigitalOcean API token used as `DO_TOKEN` in the job.

- `DJANGO_SECRET_KEY`  
  Secret key for the Django-based services; injected into Helm as `global.app.secretKey`.

- `POSTGRES_PASSWORD`  
  Password for PostgreSQL; used both for the Postgres Secret and the services that connect to it (`global.postgres.password`).

- `GRAFANA_ADMIN_PASSWORD`  
  Admin password for Grafana; mapped to `monitoring.grafana.adminPassword`.

- `TF_API_TOKEN`  
  Terraform Cloud API token (`TF_TOKEN_app_terraform_io`), allowing the workflow to use the remote backend and workspace.

---

## One-time production setup

This section describes the steps to bootstrap a fresh production environment on DigitalOcean using this repo.

### 1. DigitalOcean resources

1. **Create a DOKS cluster**

   * Choose region, node size and node count according to expected load.
   * Name it to match `CLUSTER_NAME`

2. **Create a Container Registry (DOCR)**

   * Create a private registry (e.g. `repetika`).
   * The fully-qualified registry name will look like:

     * `registry.digitalocean.com/repetika`
   * Use that value for `REGISTRY_NAME`.

3. **Create a DigitalOcean access token**

   * Scoped with permissions to:

     * Manage Kubernetes clusters and load balancers
     * Read/write the registry
   * Store it as the `DIGITALOCEAN_ACCESS_TOKEN` GitHub secret.

### 2. Configure GitHub secrets

In the GitHub repository settings, create/update:

* `REGISTRY_NAME` = `registry.digitalocean.com/<your-registry>`
* `CLUSTER_NAME` = `<your-doks-cluster-name>`
* `DIGITALOCEAN_ACCESS_TOKEN` = `<do-api-token>`
* `DJANGO_SECRET_KEY` = `<long-random-secret>`
* `POSTGRES_PASSWORD` = `<strong-password>`
* `GRAFANA_ADMIN_PASSWORD` = `<strong-password>`
* `TF_API_TOKEN` = `<terraform-cloud-api-token>`

### 4. First deployment

Once secrets and external resources are ready:

1. Push (or merge) to `master`.
2. The `repetika-doks-cd` workflow will:

   * Build and push images to DOCR.
   * Apply Terraform to ensure:

     * The namespace exists.
     * The Helm release `repetika` is installed/updated with the new image tag and secrets.

To verify:

```bash
# Configure your kubeconfig for the DOKS cluster (via doctl or DigitalOcean UI)
kubectl get pods -n repetika
kubectl get svc -n repetika frontend
```

The `frontend` service is of type `LoadBalancer`. DigitalOcean will provision a load balancer with an external IP/hostname. Attach your domain to that IP/hostname for the production URL.

---

## Local development (kind + Helm)

### Prerequisites (local)

* Docker Desktop or Docker Engine
* `kubectl`
* `kind`
* `helm`
* Node.js LTS + npm
* If testing on a mobile device, install **Expo Go** (App Store / Google Play)

### 0) Create a local cluster (kind)

```bash
git clone https://github.com/Romain-Ryckebusch/Repetika.git
cd Repetika

kind create cluster --name repetika --config k8s/kind-config.yml
kubectl cluster-info --context kind-repetika
```

### 1) Build backend images locally

Build all backend images and load them into the kind cluster:

```bash
docker build -t repetika/main-service:local              -f services/main_service/Dockerfile .
docker build -t repetika/decks-service:local             -f services/decks_service/Dockerfile .
docker build -t repetika/cours-service:local             -f services/cours_service/Dockerfile .
docker build -t repetika/planning-service:local          -f services/planning_service/Dockerfile .
docker build -t repetika/session-service:local           -f services/session_service/Dockerfile .
docker build -t repetika/quiz-service:local              -f services/quiz_service/Dockerfile .
docker build -t repetika/authentification-service:local  -f services/authentification_service/Dockerfile .

kind load docker-image repetika/main-service:local              --name repetika
kind load docker-image repetika/decks-service:local             --name repetika
kind load docker-image repetika/cours-service:local             --name repetika
kind load docker-image repetika/planning-service:local          --name repetika
kind load docker-image repetika/session-service:local           --name repetika
kind load docker-image repetika/quiz-service:local              --name repetika
kind load docker-image repetika/authentification-service:local  --name repetika
```

### 2) Configure runtime settings (Helm values)

For local dev, defaults in:

* `charts/repetika/values.yaml`

are usually fine. If you want to override specific values (e.g. secrets) without editing the file, you can use `--set` / `--set-string` at install/upgrade time:

```bash
helm upgrade --install repetika charts/repetika \
  -n repetika --create-namespace \
  --set app.secretKey="my_secure_key"
```

### 3) Deploy the stack with Helm

```bash
helm upgrade --install repetika charts/repetika -n repetika --create-namespace
kubectl get pods -n repetika -w
```

When everything is running, the gateway is exposed locally:

* Backend gateway: `http://localhost:8080` (depending on your docker/kind networking configuration)

### 4) Launch the app (Expo)

```bash
cd apps/mobile/RepetikaApp

npm install
npx expo install   # Press 'Y' when prompted to install ngrok
npx expo start --tunnel
```

Using the app:

* **Web preview**: open the URL printed by the Expo CLI (or press `w`).
* **Mobile**: open **Expo Go** and scan the QR code.

---

### Troubleshooting (local)

* **Pods stuck in `CrashLoopBackOff`**:

  ```bash
  kubectl get pods -n repetika
  kubectl logs -n repetika <pod-name>
  kubectl get events -n repetika --sort-by=.lastTimestamp | tail -n 50
  ```

* **Image not updating**: rebuild the image, run `kind load docker-image ...`, then restart the deployment.

* **Gateway returns 404 on /**: this can be normal if NGINX only routes specific API prefixes; inspect:

  ```bash
  kubectl exec -n repetika deploy/gateway -- nginx -T
  ```

* **Expo tunnel issues**: try `npx expo start` and use **LAN**, or restart the Expo server.

---

## License

See `LICENSE` in the repository root.

