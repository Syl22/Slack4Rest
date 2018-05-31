# Slack4Rest

Ce projet est basé sur la plateforme Slack. Celle-ci permet l'intégration d'applications tierces, qui se servent de commandes slash ('/commande') pour être appelées depuis Slack. Le but de ce projet est de se servir de cette fonctionnalité pour faire appel à des API Rest. Il est pour le moment essentiellement basé sur [l'API Star](https://data.explore.star.fr/explore/?sort=title).

## Première version

Développement d'un plugin simple utilisant les jeux de données du Star pour lister les horaires de bus à un certain arrêt, le nombre de vélos disponibles à un arrêt ainsi que les alertes traffic pour une certaine ligne. Les formats d'utilisation de ces commandes dans Slack sont les suivants :
```
/bus [n° ligne] [nom arrêt]
```
```
/velo [nom station]
```
```
/alerte [n° ligne]
```

## Deuxième version

Développement d'un plugin générateur de commandes. Pour générer une commande, l'utilisateur doit fournir un jeu de données, ainsi que les champs qui l'intéressent. L'utilisateur doit aussi définir le nom de la commande et le format de la réponse. Une fois générées, les commandes s'utilisent de la façon suivante :
```
/cmd [nom commande] [paramètres commande]
```
La génération des commandes se fait à partir d'un fichier json. Ce format pouvant être assez rebutant pour un utilisateur lambda, il peut être rempli à partir d'un formulaire un ligne.

le lien du formulaire en ligne, ainsi que la liste des commandes déjà créées, peuvent être obtenus grâce à la commande suivante :
```
/cmd help
```


## Membres du projet

* **Sylvain Lotout**
* **Jules Charlet**
* **Vincent Bonhomme**
* **Corentin Lefranc**
