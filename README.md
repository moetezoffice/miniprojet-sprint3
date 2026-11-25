# Mes Plantes

Application Angular avec un backend Spring Boot et une base MySQL. Le modèle existant est conservé : `Plante` possède un `Type`; les types et plantes sont enregistrés en base.

## Démarrage

1. Démarrer MySQL. Par défaut, l'application utilise `root` sans mot de passe et crée la base `mes_plantes` si nécessaire.
2. Depuis le dossier `backend`, démarrer l'API :

   ```powershell
   mvn spring-boot:run
   ```

3. Depuis le dossier `frontend`, démarrer Angular dans un autre terminal :

   ```powershell
   cd frontend
   npm install
   npm start
   ```

4. Ouvrir <http://localhost:4200/>.

L'API écoute sur le port 8090 et utilise le préfixe `/produits`. Les identifiants MySQL peuvent être remplacés avec `DB_URL`, `DB_USERNAME` et `DB_PASSWORD`. La première exécution enregistre les trois types de plantes connus de l'interface.

## Comptes de démonstration

- Administrateur : `admin` / `123`
- Utilisateur : `moetez` / `123`

Ces comptes sont gardés en mémoire par le backend pour l'atelier JWT. Leurs identifiants peuvent être remplacés par `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `USER_USERNAME` et `USER_PASSWORD`.

## JWT et autorisations

La page de connexion envoie le nom utilisateur et le mot de passe à `POST /produits/auth/login`. Spring Security vérifie les identifiants, puis signe un JWT contenant le nom utilisateur, les rôles et une date d'expiration. Angular conserve le jeton pendant la session et l'ajoute aux requêtes API sous la forme `Authorization: Bearer <jeton>`.

Les utilisateurs authentifiés peuvent lire les plantes et les types. Seul le rôle administrateur peut créer, modifier ou supprimer les données. Les guards Angular masquent les écrans réservés à l'administrateur, mais c'est le backend qui applique réellement les droits. Le jeton expire après 60 minutes par défaut; la durée se règle avec `JWT_EXPIRATION_MINUTES`. Pour une utilisation hors atelier, définir `JWT_SECRET` avec une clé secrète propre et changer les mots de passe de démonstration.

Le JWT est sans session serveur : la déconnexion supprime le jeton du navigateur. Un jeton déjà copié reste utilisable jusqu'à son expiration; l'application ne gère pas de renouvellement ni de révocation des jetons.

## API REST de l'application

Toutes les routes de gestion nécessitent un jeton valide.

| Méthode | Route | Droit | Fonction |
| --- | --- | --- | --- |
| `POST` | `/produits/auth/login` | Public | Ouvrir une session et recevoir un JWT |
| `GET` | `/produits/api` | Utilisateur connecté | Lister les plantes |
| `GET` | `/produits/api/{id}` | Utilisateur connecté | Consulter une plante |
| `POST` | `/produits/api` | Administrateur | Créer une plante |
| `PUT` | `/produits/api/{id}` | Administrateur | Modifier une plante |
| `DELETE` | `/produits/api/{id}` | Administrateur | Supprimer une plante |
| `GET` | `/produits/api/prodscat/{typeId}` | Utilisateur connecté | Filtrer par type |
| `GET` | `/produits/api/rechercheParNom?nom=aloe` | Utilisateur connecté | Rechercher par nom |
| `GET` | `/produits/api/rechercheParPrix?nom=aloe&prix=20` | Utilisateur connecté | Rechercher par nom et prix minimal |
| `GET` | `/produits/api/trieNom` | Utilisateur connecté | Trier par nom |
| `GET` | `/produits/api/trieNomPrix` | Utilisateur connecté | Trier par nom puis prix décroissant |

Exemple de création :

```json
{
  "nom": "Aloe vera",
  "prix": 18.5,
  "dateCreation": "2026-11-24T00:00:00.000Z",
  "typeId": 2
}
```

## Spring Data REST

Les dépôts exposent aussi les ressources HAL de Spring Data REST :

- `GET /produits/plantes`
- `GET /produits/plantes?size=2&page=0&sort=nom,desc`
- `GET /produits/plantes/search/findByNomContaining?nom=aloe`
- `GET /produits/plantes/search/findByTypeId?id=2`
- `GET /produits/plantes?projection=resumePlante`
- `GET /produits/types?size=100`

Angular charge les types depuis cette dernière ressource au format `_embedded.types`. Les identifiants sont exposés par la configuration Spring Data REST.

Les ressources Spring Data REST appliquent les mêmes règles d'accès : lecture pour les utilisateurs connectés, écriture pour l'administrateur.
