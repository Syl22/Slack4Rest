# Post-mortem

## Télécharger le projet

    git clone https://github.com/Syl22/Slack4Rest.git
    
## Build

    cd Slack4Rest
    npm install
    
## Lancer le serveur

[Créer une application Slack](https://api.slack.com/apps) et ajouter une commande /cmd pointant vers [ip]:[port]/slack/receive

Définir les variables d'environnement CLIENT_ID, CLIENT_SECRET, VERIFICATION TOKEN et PORT. Les trois premières sont trouvable sur [l'interface de votre application Slack](https://api.slack.com/apps).

    export CLIENT_ID=
    export CLIENT_SECRET=
    export VERIFICATION_TOKEN=
    export PORT="8080"

Puis lancer le serveur

    npm start

Connecter botkit au serveur slack en allant sur [ip]:[port]/login.
La commande est disponible en faisant /cmd sur slack. 

## Bug connu

Si l'erreur "TypeError: Cannot read property 'user_id' of undefined" se produit, faire ceci : 

* Ouvrir node_modules/botkit/lib/SlackBot.js
* Trouver aux altentours de la ligne 230 le code suivant :
```
    }
    
    bot.identity = {
        id: team.bot.user_id,
        name: team.bot.name
    };
```     
* Le remplacer par celui-ci (inclut l'affectation à bot.identity dans le if du dessus) :

```
    bot.identity = {
        id: team.bot.user_id,
        name: team.bot.name
    };
    
    }
```
Voir https://github.com/howdyai/botkit/issues/590 et https://github.com/howdyai/botkit/pull/1281

## Améliorations possibles

* Pouvoir spécifier le type de retour (pour traiter une date par exmple)
* Ajouter la compatibilité avec Swagger.io afin de faciliter l'ajout de commandes
