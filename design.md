# Slack4Rest
Slack4Rest est un plugin slack permettant une génération simplifié de commandes effectuant des requêtes sur des API Rest.

## Principe de mise en oeuvre
Les commandes sont générées à partir d'un fichier json. Celui-ci contient les informations nécessaires au bon fonctionnement de la commande :
- le nom de la commande
- le nombre d'arguments
- la nature de la requête (GET/POST)
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

## Cadre de production
Le plugin slack4Rest est hebergé par un serveur tournant sur une virtual machine de l'istic. Le développement à été réalisé en javascript, grâce à un repository git. Nous avons aussi utilisé l'API Slack et Botkit.

