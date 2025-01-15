# Flapi - Cms Hub - BackEnd

## 🛠 Tech Stack

- TypeScript (Language)
- Adonis (Framework backend)
- CI / CD (Github Actions)
- Docker / DockerCompose (Development-Local)
- Kubernetes (Development-Remote, Staging and Production)
- Unit / Functional Tests (Japa)
- MariaDB (Database)
- MailHog (Development-Local) and Mailjet (Development-Remote, Staging and Production)

<br /><br /><br /><br />

## 📦 Versionning

On utilise la convention SemVer : https://semver.org/lang/fr/ <br /><br />
Pour une Release classique : MAJOR.MINOR.PATCH <br />
Pour une Pre-Release, exemples : MAJOR.MINOR.PATCH-rc.0 OR MAJOR.MINOR.PATCH-beta.3 <br /><br />

Nous utilison release-please de Google pour versionner, via Github Actions. <br />
Pour que cela sois pris en compte il faut utiliser les conventionnal commits : https://www.conventionalcommits.org/en/v1.0.0/ <br />
Release Please crée une demande d'extraction de version après avoir remarqué que la branche par défaut contient des « unités publiables » depuis la dernière version. Une unité publiable est un commit sur la branche avec l'un des préfixes suivants : `feat` / `feat!` et `fix` / `fix!`. <br /><br />

La première Release que créer release-please automatiquement est la version : 1.0.0 <br />
Pour créer une Pre-Release faire un commit vide, par exemple si on'ai à la version 1.0.0, on peut faire :

```bash
git commit --allow-empty -m "chore: release 1.1.0-rc.0" -m "Release-As: 1.1.0-rc.0"
```

<br /><br /><br /><br />

## 🚀 Conventions de Commit

Nous utilisons les conventions de commit pour maintenir une cohérence dans l'historique du code et faciliter le versionnement automatique avec release-please. Voici les types de commits que nous utilisons, ainsi que leur impact sur le versionnage :

- feat : Introduction d'une nouvelle fonctionnalité pour l'utilisateur. Entraîne une augmentation de la version mineure (par exemple, de 1.0.0 à 1.1.0).

- feat! : Introduction d'une nouvelle fonctionnalité avec des modifications incompatibles avec les versions antérieures (breaking changes). Entraîne une augmentation de la version majeure (par exemple, de 1.0.0 à 2.0.0).

- fix : Correction d'un bug pour l'utilisateur. Entraîne une augmentation de la version patch (par exemple, de 1.0.0 à 1.0.1).

- fix! : Correction d'un bug avec des modifications incompatibles avec les versions antérieures (breaking changes). Entraîne une augmentation de la version majeure.

- docs : Changements concernant uniquement la documentation. N'affecte pas la version.

- style : Changements qui n'affectent pas le sens du code (espaces blancs, mise en forme, etc.). N'affecte pas la version.

- refactor : Modifications du code qui n'apportent ni nouvelle fonctionnalité ni correction de bug. N'affecte pas la version.

- perf : Changements de code qui améliorent les performances. Peut entraîner une augmentation de la version mineure.

- test : Ajout ou correction de tests. N'affecte pas la version.

- chore : Changements qui ne modifient ni les fichiers source ni les tests (par exemple, mise à jour des dépendances). N'affecte pas la version.

- ci : Changements dans les fichiers de configuration et les scripts d'intégration continue (par exemple, GitHub Actions). N'affecte pas la version.

- build : Changements qui affectent le système de build ou les dépendances externes (par exemple, npm, Docker). N'affecte pas la version.

- revert : Annulation d'un commit précédent. N'affecte pas la version.

Pour indiquer qu'un commit introduit des modifications incompatibles avec les versions antérieures (breaking changes), ajoutez un ! après le type de commit, par exemple feat! ou fix!.

Pour plus de détails sur les conventions de commit, consultez : [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

<br /><br /><br /><br />

## 📚 Domains of different environments

- Development-Remote : https://dev.hub.api.flapi.org
- Staging : https://staging.hub.api.flapi.org
- Production : https://hub.api.flapi.org

<br /><br /><br /><br />

## ⚙️ Setup Environment Development

1. Clone the project repository using the following commands :

```bash
git clone git@github.com:FlapiBusiness/flapi-cms-hub-backend.git
```

2. Steps by Platform :

```bash
# Windows :
1. Requirements : Windows >= 10
2. Download and Install WSL2 : https://learn.microsoft.com/fr-fr/windows/wsl/install
3. Download and Install Docker Desktop : https://docs.docker.com/desktop/install/windows-install/

# macOS :
1. Requirements : macOS Intel x86_64 or macOS Apple Silicon arm64
2. Requirements (2) : macOS 11.0 (Big Sur) +
2. Download and Install Docker Desktop : https://docs.docker.com/desktop/install/mac-install/

# Linux (Ubuntu / Debian) :
1. Requirements : Ubuntu >= 20.04 or Debian >= 10
2. Download and Install Docker (Ubuntu) : https://docs.docker.com/engine/install/ubuntu/
3. Download and Install Docker (Debian) : https://docs.docker.com/engine/install/debian/
```

<br /><br /><br /><br />

## 🔄 Cycle Development
1. Open Docker Desktop
2. Run command :
```bash
   # Start the development server on http://localhost:3555 (AdonisJS)
   # Start the development server on http://localhost:7450 (PhpMyAdmin)
   # Start the development server on http://localhost:8025 (Mailhog)
   # Start MariaDB port is : 3310
   npm install # just for the idea
   npm run dev:docker
```

<br /><br /><br /><br />

## 🔄 Unit / Functional Tests

### **General Tests:**

1. **Run all tests (unit and functional):**
   ```bash
   npm run test:all
   ```

2. **Run all tests with a watcher for changes:**
   ```bash
   npm run test:all:watch
   ```

---

### **Unit Tests:**

1. **Run only unit tests:**
   ```bash
   npm run test:unit
   ```

2. **Run unit tests with a watcher:**
   ```bash
   npm run test:unit:watch
   ```

---

### **Functional Tests:**

1. **Run only functional tests:**
   ```bash
   npm run test:functional
   ```

2. **Run functional tests with a watcher:**
   ```bash
   npm run test:functional:watch
   ```

<br /><br /><br /><br />



## 🔑 **Gestion des Secrets d'Environnement**

Ce projet utilise le package `@foadonis/crypt` pour stocker et gérer de manière sécurisée les variables d'environnement.

### **Présentation des commandes :**

- `env:get:dev` : Déchiffre et affiche la valeur d'une variable d'environnement pour le `développement`.
- `env:get:dev-remote` : Déchiffre et affiche la valeur pour le `développement à distance`.
- `env:get:staging` : Déchiffre et affiche la valeur pour le `staging`.
- `env:get:prod` : Déchiffre et affiche la valeur pour la `production`.
- `env:get:test` : Déchiffre et affiche la valeur pour les `tests`.

<br />

- `env:set:dev` : Chiffre et stocke une nouvelle variable dans `.env.development`.
- `env:set:dev-remote` : Chiffre et stocke une nouvelle variable dans `.env.development-remote`.
- `env:set:staging` : Chiffre et stocke une nouvelle variable dans `.env.staging`.
- `env:set:prod` : Chiffre et stocke une nouvelle variable dans `.env.production`.
- `env:set:test` : Chiffre et stocke une nouvelle variable dans `.env.test`.

### **Utilisation des commandes :**

1. **Déchiffrer une variable d'environnement :**
   Utilisez les scripts npm suivants en fonction de l'environnement désiré :
   ```bash
   # .env
   npm run env:get:dev -- <VARIABLE_NAME>

   # .env.development-remote
   npm run env:get:dev-remote -- <VARIABLE_NAME>

   # .env.staging
   npm run env:get:staging -- <VARIABLE_NAME>

   # .env.prod
   npm run env:get:prod -- <VARIABLE_NAME>

   # .env.test
   npm run env:get:test -- <VARIABLE_NAME>
   ```

2. **Chiffrer et stocker une nouvelle variable d'environnement :**
   Utilisez les scripts npm suivants en fonction de l'environnement désiré :
   ```bash
   # .env
   npm run env:set:dev -- <VARIABLE_NAME> "<VALUE>"

   # .env.development-remote
   npm run env:set:dev-remote -- <VARIABLE_NAME> "<VALUE>"

   # .env.staging
   npm run env:set:staging -- <VARIABLE_NAME> "<VALUE>"

   # .env.prod
   npm run env:set:prod -- <VARIABLE_NAME> "<VALUE>"

   # .env.test
   npm run env:set:test -- <VARIABLE_NAME> "<VALUE>"
   ```

### **Gestion des fichiers versionnés et non versionnés :**

- Les fichiers **`.env` et `.env.*`** contenant des variables chiffrées peuvent être versionnés.
- Le fichier **`.env.keys`** contenant les clés privées de déchiffrement ne doit jamais être versionné.
- Un fichier **`.env.keys.example`** est fourni pour montrer la structure des clés, sans valeurs réelles.

### **Accès sécurisé aux clés :**

Les clés privées réelles sont stockées de manière sécurisée dans **1Password**, dans le coffre nommé **`.env.keys (Flapi - AdonisJS)`**.


<br /><br /><br /><br />

## 🚀 Production

### ⚙️➡️ Automatic Distribution Process (CI / CD)

#### Si c'est un nouveau projet suivez les instructions :

1. Ajoutées les SECRETS_GITHUB pour :
   - DOCKER_HUB_USERNAME
   - DOCKER_HUB_ACCESS_TOKEN
   - KUBECONFIG
   - PAT_TOKEN (crée un nouveau token si besoin sur le site de github puis dans le menu du "Profil" puis -> "Settings" -> "Developper Settings' -> 'Personnal Access Tokens' -> Tokens (classic))