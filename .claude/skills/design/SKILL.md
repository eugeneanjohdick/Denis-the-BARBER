---
name: design
description: Direction visuelle et charte graphique de l'app mobile "Denis the BARBER" (React Native/Expo) — palette de couleurs exacte, typographie, style des composants (boutons, cards, coins, ombres) et liste explicite de ce qu'il faut éviter. Consulter systématiquement cette skill avant d'écrire ou modifier le moindre style visuel dans l'app mobile (StyleSheet, thème, couleurs, polices, ombres, rayons de bordure, composants UI) — même si l'utilisateur ne prononce pas les mots "design" ou "charte graphique", dès qu'un écran, un composant ou un style React Native est en jeu.
---

# Direction visuelle — Denis the BARBER

Salon de coiffure homme haut de gamme à Deido (Bonateki), Douala, Cameroun. L'app doit se sentir moderne, haut de gamme, fluide, élégante, intuitive — jamais comme un gabarit d'app générique. Chaque écran doit refléter cette identité, pas seulement respecter une liste de règles.

## Palette (exacte, ne pas dévier)

| Rôle | Couleur | Hex |
|---|---|---|
| Fond profond / texte sur fond clair | Noir | `#0E0E10` |
| Fond clair / texte sur fond sombre | Blanc cassé | `#F6F3EC` |
| Accent, CTA, mise en valeur | Doré | `#B8935A` |
| Fond secondaire, cards, séparateurs | Anthracite | `#2B2B2E` |

Le doré est une touche précieuse, pas une couleur de fond : l'utiliser pour les CTA principaux, les accents, les icônes actives, les bordures fines de mise en valeur — jamais en aplat sur de grandes surfaces, sous peine de perdre son effet.

## Typographie

- **Titres** : une police serif distinctive (ex. Playfair Display ou équivalent élégant via `@expo-google-fonts/*`) — c'est elle qui porte le côté haut de gamme.
- **Corps de texte** : une police sans-serif propre et très lisible (ex. Inter ou équivalent) — jamais la police système par défaut (San Francisco sur iOS, Roboto sur Android), qui donne immédiatement un look d'app générique.
- Charger les polices via `expo-font` / `@expo-google-fonts/...` dès le chargement de l'app (écran de démarrage), pas en fallback silencieux vers la police système.
- Le français est souvent plus long que l'anglais (cf. traductions bilingues) : prévoir des zones de texte flexibles, ne jamais figer une hauteur de ligne sur la longueur du texte anglais.

## Style des composants

- **Boutons** : forme et ombre pensées spécifiquement pour la marque, pas un style Material Design par défaut. Le bouton principal (doré ou noir) doit se distinguer clairement des actions secondaires.
- **Cards** : fond anthracite ou blanc cassé selon le contexte, ombres subtiles et personnalisées (diffuses, faible opacité) plutôt que les ombres "élévation" standard d'un design system générique.
- **Coins arrondis** : choisir le rayon consciemment par type de composant plutôt que d'appliquer un rayon uniforme partout. Un bouton principal, une card de service, et un champ de texte n'ont pas à partager le même rayon — la variation intentionnelle fait partie de l'identité visuelle.
- **Transitions et chargement** : privilégier des animations fluides et discrètes (fade, léger scale) plutôt que des transitions par défaut de la navigation.

## À éviter explicitement

- Ombres Material Design génériques (elevation par défaut, box-shadow standard sans réflexion)
- Dégradés bleu-violet (cliché visuel des apps startup génériques, aucun rapport avec l'identité du salon)
- Coins arrondis uniformes à 12px appliqués mécaniquement à tous les composants
- Police système par défaut pour le texte (San Francisco / Roboto)

## Application dans le code

Les tokens de cette charte (couleurs, tailles de police, rayons, ombres) doivent vivre dans `mobile/src/theme/` sous forme de constantes réutilisables (pas de couleurs ou de tailles codées en dur dans chaque écran). Chaque nouvel écran ou composant construit dans l'app doit consommer ce thème plutôt que redéfinir ses propres valeurs.

## Références visuelles

Le dossier [references/](references/) accueillera le logo officiel et des photos réelles du salon et des coiffeurs, à fournir par l'utilisateur. Dès qu'un fichier y est présent, le consulter avant de construire un écran pour calibrer l'ambiance réelle (matières, lumière, coupe de cheveux typique) au-delà de la seule palette abstraite — les photos priment sur toute supposition esthétique.
