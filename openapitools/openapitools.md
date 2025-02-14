## 📖 **OpenAPI Generator - Documentation et Guide d'Utilisation**

🔗 **Documentation officielle :** [OpenAPI Generator](https://openapi-generator.tech/)

---

## 📌 **Sommaire**

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Utilisation de OpenAPI Generator](#utilisation-de-openapi-generator)
4. [Authentification](#authentification)
   - [Basic Auth (Nom d'utilisateur / Mot de passe)](#1️⃣-basic-auth-nom-dutilisateur--mot-de-passe)
   - [Bearer Token (JWT, OAuth2)](#2️⃣-bearer-token-jwt-oauth2)
   - [API Key (clé dans le header)](#3️⃣-api-key-clé-dans-le-header)
   - [Authentification via Header Customisé](#4️⃣-authentification-via-header-customisé)
   - [API nécessitant une connexion préalable](#🔥-si-ton-api-swagger-nécessite-une-connexion-avant-dobtenir-le-swagger-json)
5. [Conversion en méthodes statiques](#⚡-conversion-des-méthodes-en-méthodes-statiques)
6. [Gestion des templates personnalisés](#🛠-gestion-des-templates-personnalisés)
7. [Résumé des commandes](#📋-résumé-des-commandes)

---

## 🚀 **Introduction**

OpenAPI Generator est un outil puissant permettant de **générer automatiquement des clients API, SDK et serveurs** à partir d'une spécification OpenAPI (Swagger). Il prend en charge de nombreux langages et frameworks, dont **TypeScript avec Axios**.

Ce guide explique comment l'installer, l'utiliser, gérer l'authentification et modifier les templates pour **convertir les méthodes API en méthodes statiques**.

---

## ⚙ **Installation**

**Prérequis :**

- **Java** est nécessaire pour exécuter OpenAPI Generator. Assure-toi de l’avoir installé :

  ```sh
  java -version
  ```

  Si ce n'est pas le cas, télécharge-le depuis [Java SE Downloads](https://www.oracle.com/java/technologies/javase-downloads.html).

- **Installation via `npx` (recommandé) :**

  ```sh
  npx openapi-generator-cli version
  ```

  Cela permet d'utiliser l'outil sans installation globale.

- **Installation globale (optionnelle) :**
  ```sh
  npm install -g @openapitools/openapi-generator-cli
  ```

---

## 🛠 **Utilisation de OpenAPI Generator**

Pour générer un client **TypeScript Axios** basé sur un Swagger **public** :

```sh
npx openapi-generator-cli generate -i https://petstore.swagger.io/v2/swagger.json -g typescript-axios -o ./api
```

Si l'API est **protégée**, voir la section [Authentification](#authentification).

---

## 🔐 **Authentification**

### 1️⃣ **Basic Auth (Nom d'utilisateur / Mot de passe)**

Si ton API Swagger utilise **Basic Auth**, ajoute :

```sh
npx openapi-generator-cli generate -i https://petstore.swagger.io/v2/swagger.json -g typescript-axios -o ./api --auth "username:password"
```

---

### 2️⃣ **Bearer Token (JWT, OAuth2)**

Si ton API utilise un **Bearer Token** (OAuth2, JWT...), ajoute un **header Authorization** :

```sh
npx openapi-generator-cli generate -i https://petstore.swagger.io/v2/swagger.json -g typescript-axios -o ./api --additional-properties=fetchOptions.headers.Authorization="Bearer TON_ACCESS_TOKEN"
```

---

### 3️⃣ **API Key (clé dans le header)**

Si ton API requiert une clé d’API, ajoute un **header personnalisé** :

```sh
npx openapi-generator-cli generate -i https://petstore.swagger.io/v2/swagger.json -g typescript-axios -o ./api --additional-properties=fetchOptions.headers."X-API-KEY"="TA_CLE_API"
```

---

### 4️⃣ **Authentification via Header Customisé**

Si ton API requiert un **autre type d’authentification**, tu peux passer plusieurs headers :

```sh
npx openapi-generator-cli generate -i https://petstore.swagger.io/v2/swagger.json -g typescript-axios -o ./api \
--additional-properties=fetchOptions.headers."Authorization"="Basic dXNlcm5hbWU6cGFzc3dvcmQ=" \
--additional-properties=fetchOptions.headers."Custom-Header"="Valeur"
```

---

### 🔥 **Si ton API Swagger nécessite une connexion avant d'obtenir le Swagger JSON**

1. **Récupérer le Swagger JSON avec authentification :**
   ```sh
   curl -H "Authorization: Bearer TON_ACCESS_TOKEN" https://petstore.swagger.io/v2/swagger.json -o swagger.json
   ```
2. **Générer le client en local :**
   ```sh
   npx openapi-generator-cli generate -i ./swagger.json -g typescript-axios -o ./api
   ```

---

## ⚡ **Conversion des méthodes en méthodes statiques**

Par défaut, OpenAPI Generator génère des classes API avec des méthodes d’instance, nécessitant une instanciation :

```typescript
const petApi = new PetApi()
const pets = await petApi.findPetsByStatus(['available']).then((res) => res.data)
```

Nous allons transformer ces méthodes en **méthodes statiques**, permettant un accès direct sans instanciation :

```typescript
const pets = await PetApi.findPetsByStatus(['available']).then((res) => res.data)
```

### ✅ **Étapes à suivre :**

1. **Supprimer l'héritage de `BaseAPI`**
   Trouve cette ligne :

   ```mustache
   export class {{classname}} extends BaseAPI {
   ```

   Remplace-la par :

   ```mustache
   export class {{classname}} {
   ```

2. **Rendre les méthodes statiques**
   Dans `apiInner.mustache`, trouve :

   ```mustache
   public {{nickname}}(...)
   ```

   Remplace par :

   ```mustache
   public static async {{nickname}}(...)
   ```

3. **Modifier la gestion des requêtes**
   Trouve cette ligne :
   ```mustache
   return globalAxios.request(localVarAxiosArgs.options);
   ```
   Remplace-la par :
   ```mustache
   return globalAxios.request({
       ...localVarAxiosArgs.options,
       url: BASE_PATH + localVarAxiosArgs.url
   });
   ```

Après ces modifications, **toutes les méthodes API seront utilisables en statique**, sans instanciation.

---

## 🛠 **Gestion des templates personnalisés**

Si tu veux **personnaliser la génération**, voici comment utiliser des templates custom :

1. **Créer un dossier pour les templates** :
   ```sh
   mkdir static-template
   ```
2. **Copier les templates par défaut** :
   ```sh
   npx openapi-generator-cli author template -g typescript-axios -o static-template
   ```
3. **Modifier `static-template/apiInner.mustache`** (voir la section [Conversion en méthodes statiques](#⚡-conversion-des-méthodes-en-méthodes-statiques)).
4. **Générer le client avec le template modifié** :
   ```sh
   npx openapi-generator-cli generate -i https://petstore.swagger.io/v2/swagger.json -g typescript-axios -o ./api -t static-template
   ```

---

## 📋 **Résumé des commandes**

| Action                                     | Commande                                                                    |
| ------------------------------------------ | --------------------------------------------------------------------------- |
| **Générer un client API TypeScript Axios** | `npx openapi-generator-cli generate -i URL -g typescript-axios -o ./api`    |
| **Avec Basic Auth**                        | `--auth "username:password"`                                                |
| **Avec Bearer Token**                      | `--additional-properties=fetchOptions.headers.Authorization="Bearer TOKEN"` |
| **Avec API Key**                           | `--additional-properties=fetchOptions.headers."X-API-KEY"="VALEUR"`         |
| **Avec un template customisé**             | `-t static-template`                                                        |
