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

Développement d'un plugin générateur de commandes. Pour cela l'utilisateur doit définir le jeu de données, ainsi que les champs étudiés. L'utilisateur doit aussi définir le nom de la commande et le format de la réponse. Le format d'utilisation des commandes générées est le suivant :
```
/cmd [nom commande] [paramètres commande]
```

todo generation -> json et form

## Membres du projet

* **Sylvain Lotout**
* **Jules Charlet**
* **Vincent Bonhomme**
* **Corentin Lefranc**
