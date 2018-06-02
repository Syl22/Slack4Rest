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

Si l'erreur "error: Could not load team while processing webhook:  Error: could not find team [***]" se produit, faire ceci : 

* Ouvrir node_modules/botkit/lib/SlackBot.js
* Trouver aux altentours de la ligne 230 le code suivant :
```
    bot.identity = {
    id: team.bot.user_id,
    name: team.bot.name
    };
    }
```     
* Le remplacer par celui-ci :

```
    }
    bot.identity = {
    id: team.bot.user_id,
    name: team.bot.name
    };
```
