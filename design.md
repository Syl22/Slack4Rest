# Slack4Rest
Slack4Rest est un plugin slack permettant une génération simplifié de commandes effectuant des requêtes sur des API Rest.

## Principe de mise en oeuvre
Les commandes sont générées à partir d'un fichier json. Celui-ci contient les informations nécessaires au bon fonctionnement de la commande :
- le nom de la commande
- le nombre d'arguments
- la nature de la requête (GET/POST/PUT/DELETE...)
- l'adresse uri du jeu de donné étudié
- les champs à préciser en paramètre
- les champs renvoyés dans la réponse
- le format de la réponse.
Lorsque que la commande est appelée, de la façon suivante :
```
/cmd [nom commande] [paramètres commande]
```
la commande /cmd va appeler un fichier javascript server.js, qui va chercher le fichier json correspondant à la commande et l'analyser pour renvoyer un résultat.

## Règles d'architecture


## Modèle statique

## Modèle dynamique

## Contraintes d'analyse
La **non-uniformité des API Rest** est la principale contrainte de cette application. Nous avons opté pour que l'utilisateur nous donne toutes les informations nécessaires à une requête, mais cela pose deux problèmes :
- Il faut créer une commande et tout définir pour chaque requête souhaitée.
- L'application ne peut prédir la structure d'une API à partir d'un exemple de requête.

Pour résoudre en partie ce problème, on pourrait autoriser un "héritage" de requêtes, où l'utilisateur peut spécifier une requête "mère" où aller chercher les informations manquantes. Une solution plus ambitieuse serait de restreindre notre application aux API respectant la spécification [OpenAPI](https://www.openapis.org/). Le nombre d'API possible s'en verrait réduit mais l'application serait alors bien plus autonome.

Un autre problème apparu rapidement concerne **l'authentification**. Étant souvent un processus en plusieurs étapes, nous avons préféré l'ignorer et se limiter à des requêtes 100% sans états. L'utilisateur peut toujours spécifier un token ou une clé d'API dans une requête, comme c'est le cas dans la commande exemple *weather*.

## Cadre de production
Le plugin slack4Rest est hebergé par un serveur tournant sur une virtual machine de l'istic. Le développement à été réalisé en javascript, grâce à un repository git. Nous avons aussi utilisé l'API Slack et Botkit.

