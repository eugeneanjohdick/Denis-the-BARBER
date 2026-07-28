# Denis the BARBER

## Identité
Application mobile (Android + iOS) de réservation de rendez-vous pour le salon de coiffure homme "Denis the BARBER", situé à Deido (Bonateki), Douala, Cameroun. Pas de paiement en ligne. Bilingue français/anglais dès la conception, dans l'interface client ET l'interface administrateur, via un système de traduction centralisé.

Équipe : Denis (coiffeur/gérant) et Collins (coiffeur), chacun avec son propre planning. Architecture pensée pour accueillir d'autres coiffeurs et une 2e agence plus tard sans refonte (chaque enregistrement métier est rattaché à une agence).

## Stack technique
- Frontend mobile : React Native (Expo)
- Backend : Node.js / Express
- Base de données : Airtable — **plan gratuit** pendant la phase de test : 1 000 enregistrements par base (partagés entre toutes les tables), 1 000 appels API/mois, 5 req/s. Concevoir le backend et les workflows n8n en conséquence (lectures groupées, cache mémoire pour les données à faible churn, cron peu fréquent — voir détails dans Memory).
- Automatisation & notifications WhatsApp : n8n auto-hébergé

## Décisions d'architecture actées
- **Identifiants** : pas de champ `*_id` autonumber dédié dans les tables Airtable — le backend utilise le `recordId` natif d'Airtable comme identifiant, y compris pour les clés étrangères.
- **Interface admin** : intégrée à la même app Expo que les clients (pas d'app séparée, pas de web app), écrans "rôle admin" protégés par connexion.
- **Authentification admin** : nom d'utilisateur (`login_username`, ex. ICECASH pour Denis, FOKAS pour Collins) + PIN/mot de passe (hashé côté backend) + session token. Pas d'OTP à chaque connexion (accès interne à Denis/Collins, distinct du flux client).
- **Authentification client** : OTP WhatsApp.
- **Hébergement (phase de test)** : Render.com ou Railway, tier gratuit, pour le backend Express et n8n. Migration vers un VPS payant prévue une fois le concept validé.
- **WhatsApp** : Meta Cloud API officiel (pas Twilio), niveau gratuit avec numéro de test. Templates pré-approuvés nécessaires pour les rappels envoyés hors fenêtre de 24h.
- **Distribution de test** : pas de comptes développeur Apple/Google Play pour l'instant. Distribution via Expo Go + APK Android (EAS Build, profil preview). Comptes stores ouverts seulement à la mise en production réelle.

## Statut actuel (2026-07-28)
Les 13 tables Airtable sont créées. Le backend Node/Express (Phase 3) est fait : structure du projet, config/env validée, couche d'accès Airtable avec cache + compteur d'appels, health-check + pingeur externe, authentification (JWT, OTP WhatsApp client, login_username+PIN admin), calcul des créneaux disponibles, création et annulation de rendez-vous — tout testé avec de vraies données Airtable et un vrai numéro WhatsApp, poussé sur [github.com/eugeneanjohdick/Denis-the-BARBER](https://github.com/eugeneanjohdick/Denis-the-BARBER).

Prochaine étape à décider : Phase 2 (système de traduction centralisé), Phase 4 (automatisation n8n : rappels, liste d'attente, avis), ou Phase 5 (app mobile Expo).

## Notes
Le journal détaillé des décisions, leur justification et le contexte au fil de l'eau vivent dans Memory (auto memory), pas ici — ce fichier ne garde que les éléments stables du projet.
