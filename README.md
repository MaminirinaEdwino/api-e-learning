# Documentation API

## activate user

**Endpoint:** `POST` `{{host}}/user/activate/5`  
### Request Body (JSON)
```json
{
    "deactivate_user_id": 5
}
```
### Authentication
#### type : bearer token
---
## admin backoffice

**Endpoint:** `GET` `{{host}}/admin/backoffice`  
### Authentication
#### type : bearer token
---
## admin gestion user

**Endpoint:** `GET` `{{host}}/admin/gestionuser`  
### Authentication
#### type : bearer token
---
## adminlogin

**Endpoint:** `POST` `{{host}}/admin/login`  
### Request Body (JSON)
```json
{
    "email": "admin@gmail.com",
    "password": "administrateur"
}
```
### Headers
- **Content-Type**: application/json
### Authentication
#### type : No Auth token
---
## auth apprenant formateur

**Endpoint:** `POST` `{{host}}/auth`  
### Request Body (JSON)
```json
{
    "email": "har@gmail.com",
    "password": "administrateur"
}
```
### Headers
- **Content-Type**: application/json
### Authentication
#### type : No Auth token
---
## confirm formateur

**Endpoint:** `POST` `{{host}}/signin/formateur`  
### Request Body (JSON)
```json
{ 
    "nom_prenom": "qsdmflqkjsd",
    "email": "ezm@gmail.com", 
    "password": "administrateur", 
    "confirm_password": "administrateur",
    "entryCode": 123456 
}
```
### Headers
- **Content-Type**: application/json

---
## contact mail

**Endpoint:** `POST` `{{host}}/apropos/contact`  
### Request Body (JSON)
```json
{ 
    "nom": "nom", 
    "email": "email", 
    "sujet": "sujet", 
    "message": "message" 
}
```
### Headers
- **Content-Type**: application/json
### Authentication
#### type : bearer token
---
## deativate user

**Endpoint:** `POST` `{{host}}/user/deactivate`  
### Request Body (JSON)
```json
{
    "deactivate_user_id": 5
}
```
### Headers
- **Content-Type**: application/json
### Authentication
#### type : bearer token
---
## delete contenu formation

**Endpoint:** `DELETE` `{{host}}/contenu/delete/3`  
### Authentication
#### type : bearer token
---
## delete cours

**Endpoint:** `DELETE` `{{host}}/cours/delete/29`  
### Authentication
#### type : bearer token
---
## delete formation

**Endpoint:** `DELETE` `{{host}}/formation/delete/17`  
### Authentication
#### type : bearer token
---
## delete journal

**Endpoint:** `DELETE` `{{host}}/journal/delete/22`  
### Authentication
#### type : bearer token
---
## delete lecon

**Endpoint:** `DELETE` `{{host}}/lecon/delete/7`  
### Authentication
#### type : bearer token
---
## delete user

**Endpoint:** `DELETE` `{{host}}/user/delete/6`  
### Request Body (JSON)
```json
{
    "deactivate_user_id": 5
}
```
### Authentication
#### type : bearer token
---
## enroll cours

**Endpoint:** `POST` `{{host}}/enroll/cours`  
### Request Body (JSON)
```json
{
    "cours_id": 22,
    "references_payement": "msqldkfj",
    "method_payement": "Mvola"
}
```
### Headers
- **Content-Type**: application/json
### Authentication
#### type : bearer token
---
## espace apprenant cours

**Endpoint:** `GET` `{{host}}/espace/apprenant/cours`  
### Authentication
#### type : bearer token
---
## espace apprenant forum id

**Endpoint:** `GET` `{{host}}/espace/apprenant/forum/2`  
### Authentication
#### type : bearer token
---
## espace apprenant progression

**Endpoint:** `GET` `{{host}}/espace/apprenant/progression`  
### Authentication
#### type : bearer token
---
## espace apprenant

**Endpoint:** `GET` `{{host}}/espace/apprenant/`  
### Authentication
#### type : bearer token
---
## espace certificat

**Endpoint:** `GET` `{{host}}/espace/certificat`  

---
## espace formateur progression

**Endpoint:** `GET` `{{host}}/espace/formateur/progression`  
### Authentication
#### type : bearer token
---
## espace formateur

**Endpoint:** `GET` `{{host}}/espace/formateur`  
### Authentication
#### type : bearer token
---
## export csv

**Endpoint:** `GET` `{{host}}/export/csv`  

---
## formation catalogue

**Endpoint:** `GET` `{{host}}/formation/catalogue`  

---
## formation edit

**Endpoint:** `PUT` `{{host}}/formation/edit/16`  
### Request Body (JSON)
```json
{
    "nouveau_nom": "teste edit"
}
```
### Headers
- **Content-Type**: application/json
### Authentication
#### type : bearer token
---
## forum cours by id

**Endpoint:** `GET` `{{host}}/forum/cours/4`  
### Authentication
#### type : bearer token
---
## forum new

**Endpoint:** `POST` `{{host}}/forum/new`  
### Request Body (JSON)
```json
{
    "titre": "titre foqsdmlf",
    "description": "qmsldkjf",
    "cours_id": 4
}
```
### Headers
- **Content-Type**: application/json
### Authentication
#### type : bearer token
---
## gestion forum

**Endpoint:** `GET` `{{host}}/gestion/forum`  
### Authentication
#### type : bearer token
---
## gestionformation by id

**Endpoint:** `GET` `{{host}}/gestion/formation/16`  
### Authentication
#### type : bearer token
---
## gestionformation

**Endpoint:** `GET` `{{host}}/gestion/formation`  
### Authentication
#### type : bearer token
---
## get cours formateur

**Endpoint:** `GET` `{{host}}/cours/formateur`  
### Authentication
#### type : bearer token
---
## get cours

**Endpoint:** `GET` `{{host}}/cours`  
### Authentication
#### type : bearer token
---
## get forum

**Endpoint:** `GET` `{{host}}/forum`  
### Authentication
#### type : bearer token
---
## get journal

**Endpoint:** `GET` `{{host}}/journal`  
### Authentication
#### type : bearer token
---
## get lecon

**Endpoint:** `GET` `{{host}}/lecon`  
### Authentication
#### type : bearer token
---
## lecon edit

**Endpoint:** `PUT` `{{host}}/lecon/edit/7`  
### Headers
- **Content-Type**: multipart/form-data
### Authentication
#### type : bearer token
---
## login

**Endpoint:** `POST` `{{host}}/auth`  
### Request Body (JSON)
```json
{
    "email": "har@gmail.com",
    "password": "administrateur"
}
```
### Headers
- **Content-Type**: application/json

---
## logout

**Endpoint:** `GET` `{{host}}/logout`  

---
## module complete

**Endpoint:** `POST` `{{host}}/module/complete`  
### Request Body (JSON)
```json
{
    "cours_id": 4,
    "module_id": 15,
    "is_checked": true
}
```
### Headers
- **Content-Type**: application/json
### Authentication
#### type : bearer token
---
## module delete

**Endpoint:** `DELETE` `{{host}}/module/delete/15`  
### Request Body (JSON)
```json
{
    "cours_id": 4,
    "titre": "module de cours 4",
    "description": "description de module cours 4"
}
```
### Authentication
#### type : bearer token
---
## module edit

**Endpoint:** `PUT` `{{host}}/module/edit/15`  
### Request Body (JSON)
```json
{
    "titre": "module de cours 4 edit",
    "description": "description de module cours 4"
}
```
### Headers
- **Content-Type**: application/json
### Authentication
#### type : bearer token
---
## module get by id

**Endpoint:** `GET` `{{host}}/module/cours/2`  
### Request Body (JSON)
```json
{
    "cours_id": 4,
    "titre": "module de cours 4",
    "description": "description de module cours 4"
}
```
### Authentication
#### type : bearer token
---
## module get

**Endpoint:** `GET` `{{host}}/module/`  
### Request Body (JSON)
```json
{
    "cours_id": 4,
    "titre": "module de cours 4",
    "description": "description de module cours 4"
}
```
### Authentication
#### type : bearer token
---
## module new

**Endpoint:** `POST` `{{host}}/module/new`  
### Request Body (JSON)
```json
{
    "cours_id": 4,
    "titre": "module de cours 4",
    "description": "description de module cours 4"
}
```
### Headers
- **Content-Type**: application/json
### Authentication
#### type : bearer token
---
## new cours

**Endpoint:** `POST` `{{host}}/cours/new`  
### Headers
- **Content-Type**: multipart/form-data
### Authentication
#### type : bearer token
---
## newformation

**Endpoint:** `POST` `{{host}}/formation/new`  
### Request Body (JSON)
```json
{
    "nom_formation":"teste lave be sdfdtydf"
}
```
### Headers
- **Content-Type**: application/json
### Authentication
#### type : bearer token
---
## notification read

**Endpoint:** `POST` `{{host}}/notification/read`  
### Authentication
#### type : bearer token
---
## post lecon

**Endpoint:** `POST` `{{host}}/lecon/new/`  
### Headers
- **Content-Type**: multipart/form-data
### Authentication
#### type : bearer token
---
## post new

**Endpoint:** `POST` `{{host}}/post/new`  
### Request Body (JSON)
```json
{
    "forum_id": 3,
    "contenu": "module de cours 4"
}
```
### Headers
- **Content-Type**: application/json
### Authentication
#### type : bearer token
---
## postuler formateur

**Endpoint:** `POST` `{{host}}/signin/postuler`  
### Headers
- **Content-Type**: multipart/form-data

---
## quiz delete

**Endpoint:** `DELETE` `{{host}}/quiz/formateur/delete/8`  
### Request Body (JSON)
```json
{ 
    "module_id": 6 , 
    "titre_quiz": "new quiz", 
    "description_quiz": "description new quiz", 
    "score_minimum": 90, 
    "questions": [
        {
            "texte": "qmldskjfqmls",
            "reponse_correcte": "sqdfqsf",
            "reponse_incorrecte_1": "mlsqkjdfml 1",
            "reponse_incorrecte_2": "mlsqkjdfml 2",
            "reponse_incorrecte_3": "mlsqkjdfml 3"
        }
    ] 
}
```
### Authentication
#### type : bearer token
---
## quiz edit

**Endpoint:** `PUT` `{{host}}/quiz/edit/7`  
### Request Body (JSON)
```json
{ 
    "module_id": 6 , 
    "titre_quiz": "new quiz edit", 
    "description_quiz": "description new quiz", 
    "score_minimum": 90, 
    "questions": [
        {
            "texte": "qmldskjfqmls",
            "reponse_correcte": "sqdfqsf",
            "reponse_incorrecte_1": "mlsqkjdfml 1",
            "reponse_incorrecte_2": "mlsqkjdfml 2",
            "reponse_incorrecte_3": "mlsqkjdfml 3"
        }
    ] 
}
```
### Headers
- **Content-Type**: application/json
### Authentication
#### type : bearer token
---
## quiz formateur

**Endpoint:** `GET` `{{host}}/quiz/formateur`  
### Authentication
#### type : bearer token
---
## quiz new

**Endpoint:** `POST` `{{host}}/quiz/new`  
### Request Body (JSON)
```json
{ 
    "module_id": 6 , 
    "titre_quiz": "new quiz", 
    "description_quiz": "description new quiz", 
    "score_minimum": 90, 
    "questions": [
        {
            "texte": "qmldskjfqmls",
            "reponse_correcte": "sqdfqsf",
            "reponse_incorrecte_1": "mlsqkjdfml 1",
            "reponse_incorrecte_2": "mlsqkjdfml 2",
            "reponse_incorrecte_3": "mlsqkjdfml 3"
        }
    ] 
}
```
### Headers
- **Content-Type**: application/json
### Authentication
#### type : bearer token
---
## sendcode admin

**Endpoint:** `GET` `{{host}}/send/code`  

---
## signin apprenant

**Endpoint:** `POST` `{{host}}/signin/apprenant`  
### Headers
- **Content-Type**: multipart/form-data

---
## sous formation by id

**Endpoint:** `GET` `{{host}}/sousformation/16`  

---
## sous formation new

**Endpoint:** `POST` `{{host}}/sousformation/new`  
### Request Body (JSON)
```json
{
    "id_formation": 7,
    "sous_formation": "sousousous1"
}
```
### Headers
- **Content-Type**: application/json
### Authentication
#### type : bearer token
---
