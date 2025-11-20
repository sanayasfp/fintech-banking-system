# 🏦 Test Technique – Compte Bancaire (Version

# Fintech & Full‑Stack)

## 🎯 Objectif du Test

Ce test technique a pour but d’évaluer la capacité du candidat à :

```
Concevoir et implémenter un module financier simple , avec rigueur et précision ;
Respecter une API publique imposée ;
Structurer un projet propre, maintenable et évolutif ;
Appliquer des pratiques courantes dans les environnements Fintech : traçabilité, immuabilité,
cohérence métier, gestion d’erreurs explicite ;
Démontrer ses compétences sur son écosystème technique (backend, outils, testing,
architecture) ;
Montrer, le cas échéant, une maturité full‑stack (frontend, API, mobile, devops, etc.).
```
Ce test est conçu pour être **neutre en langage** , laissant au candidat la possibilité d’utiliser le stack dans
lequel il est le plus à l’aise.

## 📜 Interface Fourni (Immuable)

Le candidat doit implémenter une classe respectant l’interface suivante, sans la modifier :

```
public interface BankAccount
{
voiddeposit(intamount);
voidwithdraw(int amount);
voidprintStatement();
}
```
⚠️ **Il est strictement interdit de modifier l’interface**. Toute solution altérant les signatures est
considérée comme incorrecte.

## 📝 Fonctionnalités Attendues

### 1. Dépôt (deposit)

```
Ajoute une transaction de type crédit.
Refuse les montants nuls ou négatifs.
```
### 2. Retrait (withdraw)

```
Ajoute une transaction de type débit.
Refuse les montants nuls ou négatifs.
```
#### • • • • • • • • • •


```
Refuse tout retrait menant à un solde négatif ( pas de découvert autorisé ).
```
### 3. Relevé (printStatement)

La méthode doit afficher un relevé bancaire contenant : - La date de l’opération ; - Le montant de
l’opération (positif ou négatif) ; - Le solde **après** l’opération ; - Les lignes triées par date **décroissante** (la
plus récente en premier).

**Exemple d’affichage attendu (format non‑contraignant)**

```
Date || Montant || Solde
2024-01-14 || -500 || 2500
2024-01-13 || 2000 || 3000
2024-01-10 || 1000 || 1000
```
L’objectif n’est pas de valider un alignement de texte parfait, mais la **structure du relevé** et la
**cohérence du solde cumulatif**.

## 🔎 Contraintes Fonctionnelles & Techniques

Le candidat doit respecter les principes suivants :

```
Chaque transaction doit être traçable et idéalement immutable ;
Aucune erreur métier ne doit être silencieuse ;
Le code doit être testable , structuré et organisé ;
L’architecture doit éviter les effets de bord et la logique dispersée ;
Le projet doit refléter des pratiques professionnelles.
```
## ⭐ Critères d’Évaluation – Backend & Architecture

```
Critère Attendus
Respect de l’interface API strictement conforme
```
```
Validation métier Gestion correcte des erreurs et des cas limites
```
```
Qualité du code Propreté, lisibilité, absence de duplication
```
```
Modélisation Transaction dédiée, immuable si possible
Relevé (printStatement) Ordonnancement cohérent, solde juste
```
```
Tests Cas standard + cas limites couverts
```
## ⭐ Critères d’Évaluation – Full‑Stack & Stack Technique

Ce test permet d’identifier les profils réellement full‑stack.

#### • • • • • •


```
Axe Indicateurs Évaluation
```
```
Architecture du
projet
```
```
organisation des fichiers, modules,
dépendances
maturité technique
```
```
Usage du stack frameworks, outils, meilleures pratiques
maîtrise réelle du
langage
```
```
Outillage linter, formatter, scripts, CI locale professionnalisme
```
```
Documentation README clair et exploitable
rigueur &
communication
```
```
Qualité des tests couverture, pertinence, clarté expérience
```
```
Vision technique refactoring, extensibilité, limites séniorité
```
## 🎚️ Niveaux Attendus

### 🔹 Junior

```
Implémentation simple dans une seule classe ;
Vérifications basiques ;
Peu ou pas de tests ;
Stack minimal.
```
### 🏦 Intermédiaire

```
Classe Transaction dédiée ;
Tri correct + solde cumulatif ;
Exceptions explicites ;
Tests unitaires principaux ;
Structure de projet correcte.
```
### ⭐ Senior

```
Transactions immuables ;
Séparation claire des responsabilités ;
Clock/provider injecté pour gérer la date ;
Tests complets (cas limites, erreurs, cohérence) ;
Architecture modulaire et extensible ;
Utilisation maîtrisée de l’environnement (framework, tooling, CI...).
```
## 📦 Livrables Attendus

```
Code source complet et fonctionnel ;
Tests unitaires ;
Un README professionnel , contenant :
les instructions d’exécution ;
les choix techniques et architecturaux ;
```
#### • • • • • • • • • • • • • • • • • • • •


```
une explication claire de la conception.
```
## 🧪 Technologies Autorisées

Le candidat est libre de choisir son langage, notamment :

```
Java
Go
Node.js / TypeScript
Python
Ruby
PHP
C#
Tout autre langage maîtrisé ( bonus pour les profils réellement full‑stack)
```
## 🎁 Bonus – Approche Full‑Stack (Optionnel)

Le candidat peut aller plus loin en proposant : - une **API REST** exposant les opérations (/
statement, /deposit, /withdraw) ; - un mini front‑end (React, Vue, Angular, Svelte...) ; - un
stockage persisté (fichier, JSON, SQLite...) ; - un environnement **Dockerisé** ; - un outillage professionnel
(Makefile, scripts npm, linter...).

Ces bonus permettent d’évaluer : - la polyvalence ; - la structuration d’un projet complet ; - la maturité
d’ingénierie.

## 📱 Bonus – Développement Mobile (Optionnel)

Les candidats maîtrisant le mobile peuvent proposer une application permettant :

```
de consulter le relevé du compte ;
d’effectuer un dépôt ou un retrait ;
de consommer une API backend ou d’embarquer la logique localement.
```
Technologies possibles : - **React Native** - **Flutter** - **Kotlin / Android** - **Swift / iOS** - **MAUI** , etc.

Critères observés : - séparation logique (UI / business / data) ; - gestion des erreurs ; - ergonomie et
fluidité ; - tests éventuels.

## 📌 Conclusion

Ce test vise à reproduire une situation proche de la réalité : implémenter une logique financière simple,
mais **avec le niveau de qualité attendu dans un environnement Fintech**. Le candidat est libre de
démontrer l’étendue réelle de ses compétences, aussi bien Backend que Full‑Stack ou Mobile.

#### • • • • • • • • • • • •
