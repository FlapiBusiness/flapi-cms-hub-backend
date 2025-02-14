# 📜 **Documentation Swagger & Génération de l'API Frontend**

## 📌 **Sommaire**

1. [Introduction](#introduction)
2. [Ajouter une nouvelle route dans Swagger](#ajouter-une-nouvelle-route-dans-swagger)
   - [Annotations obligatoires](#annotations-obligatoires)
   - [Annotations recommandées](#annotations-recommandées)
   - [Exemple d'annotations](#exemple-dannotations)
3. [Générer le fichier Swagger](#générer-le-fichier-swagger)
4. [Mettre à jour l’API pour le Frontend](#mettre-à-jour-lapi-pour-le-frontend)
5. [Vérifications & Bonnes pratiques](#vérifications--bonnes-pratiques)
6. [Problèmes connus](#problèmes-connus)

---

## 📌 **Introduction**

Ce guide explique comment :  
✅ Ajouter de nouvelles routes à la documentation Swagger  
✅ Générer le fichier `swagger.json` et `swagger.yml`  
✅ Mettre à jour l’API pour le frontend en utilisant **OpenAPI Tools**

Nous utilisons **[`adonis-autoswagger`](https://www.npmjs.com/package/adonis-autoswagger)** pour générer automatiquement la documentation Swagger.

📌 **Plus d’informations sur OpenAPI Tools ?** Un guide détaillé est disponible ici : **[`openapitools/openapitools.md`](openapitools/openapitools.md)**

---

## 📌 **Ajouter une nouvelle route dans Swagger**

### 📝 **1. Ajouter les annotations Swagger au-dessus de la méthode**

Chaque route doit être documentée avec des **annotations JSDoc**. Ces annotations sont utilisées pour générer automatiquement la documentation Swagger.

### **🔹 Annotations obligatoires**

| Annotation                  | Description                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| `@<nomDeLaMéthode>`         | **Obligatoire** - Identifie la méthode, doit être identique au nom de la fonction           |
| `@operationId <nom>`        | **Obligatoire** - Définit le nom de la méthode utilisée dans l'API générée pour le frontend |
| `@tag <nom>`                | **Obligatoire** - Permet de regrouper plusieurs routes sous une même catégorie              |
| `@content application/json` | **Obligatoire** si la route renvoie du JSON                                                 |

### **🔹 Annotations recommandées**

| Annotation                                               | Description                                                                      |
| -------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------- |
| `@summary <texte>`                                       | Donne un titre court expliquant l’objectif de la route                           |
| `@description <texte>`                                   | Donne plus de détails sur le fonctionnement de la route                          |
| `@responseBody <code> <Interface \| Model \| Validator>` | Définit les réponses attendues (succès ou erreurs)                               | Définit les réponses attendues (succès ou erreurs) |
| `@requestBody <Validator>`                               | Définit le format du **body** attendu (ex: données de création d'un utilisateur) |
| `@queryParam <nom> <type>`                               | Spécifie un paramètre dans l'URL                                                 |
| `@param <nom> <type>`                                    | Spécifie un paramètre passé en route dynamique (`/users/:id`)                    |

---

### ✨ **Exemple d’annotations**

Exemple d’annotations pour une méthode **signIn** :

```ts
/**
 * @signIn
 * @operationId signIn
 * @tag Auth
 * @summary Connexion d'un utilisateur
 * @description Cette route permet à un utilisateur de se connecter et de recevoir un token JWT.
 * @content application/json
 * @requestBody <loginValidator>
 * @responseBody 200 - <LoginSuccessResponse>
 * @responseBody 401 - <UnauthorizedResponse>
 */
public async signIn({ request, response }: HttpContext) {
  const { email, password } = request.all()
  const token = await AuthService.signIn(email, password)
  return response.status(200).json({ token })
}
```

---

## 📌 **Générer le fichier Swagger**

📌 **Avant de passer à l’étape suivante**, il est possible de **vérifier le bon fonctionnement des routes** en accédant à **`http://localhost:3333/docs`**.

Une fois que tout semble correct, il faut **générer Swagger pour OpenAPI Tools**.

### **Commande à exécuter :**

```sh
npm run generate:swagger
```

📌 Cette commande va :  
✅ **Créer/Mettre à jour** `swagger.json` et `swagger.yml`  
✅ Permettre d’utiliser ces fichiers avec OpenAPI Tools

---

## 📌 **Mettre à jour l’API pour le Frontend**

Une fois le Swagger mis à jour, on doit **générer l'API TypeScript pour le frontend** en utilisant **OpenAPI Generator**.

### **Commande à exécuter :**

```sh
npm run generate:openapitools
```

📌 Cette commande va :  
✅ **Utiliser `swagger.json` et `swagger.yml` pour générer l’API**  
✅ **Mettre à jour le dossier `api/` avec les nouvelles routes**

---

## ⚠️⚠️ **Une fois terminé, pense à copier le dossier `api/` dans le repo frontend.⚠️⚠️**

---

## 📌 **Vérifications & Bonnes pratiques**

✔ **Vérifie l’UI Swagger** (http://localhost:3333/docs)  
✔ **Teste tes endpoints avec Swagger UI** avant de générer l’API frontend

---

## 📌 **Problèmes connus**

### ❌ **Problème avec `Database` dans un Validator**

Si `adonis-autoswagger` ne comprend pas un **Validator** utilisant `Database`, la solution est de créer une **Interface** dans `/app/interfaces`.

✅ Exemple :

```ts
// app/interfaces/auth_interface.ts
export interface LoginPayload {
  email: string
  password: string
}
```

Puis, l’utiliser dans le **@requestBody** au lieu du Validator :

```ts
/**
 * @requestBody <LoginPayload>
 */
```

---

### 🚀 **Résumé des étapes finales**

1️⃣ **Ajoute les annotations Swagger** dans ton controller  
2️⃣ **Vérifie le Swagger dans `/docs`**  
3️⃣ **Génère Swagger pour OpenAPI Tools** (`npm run generate:swagger`)  
4️⃣ **Génère l’API pour le frontend** (`npm run generate:openapitools`)  
5️⃣ **Copie le dossier `api/`** dans le repo frontend

---

## 🎯 **Besoin d’aide ?**

Si tu rencontres un problème, vérifie :  
✅ L’UI Swagger (`/docs`)  
✅ Le fichier **swagger.json**  
✅ Le terminal (`npm run generate:openapitools`)

🚀 **Bonne documentation et bon dev !** 🔥
